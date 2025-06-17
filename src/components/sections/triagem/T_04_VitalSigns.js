'use client'

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ParagraphBlue } from '@/components/theme/ParagraphBlue';
import { Heading } from '@/components/typography/Heading';
import Image from 'next/image';

// Componente para exibir o modal do vídeo de instrução
function VideoModal({ isOpen, onClose, videoUrl, title }) {
  if (!isOpen) return null;

  return (
    // z-index maior (z-60) para ficar por cima do outro modal (z-50)
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60] p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 flex justify-between items-center border-b dark:border-zinc-700">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-4">
          <video className="w-full rounded" src={videoUrl} controls autoPlay muted>
            Seu navegador não suporta a tag de vídeo.
          </video>
        </div>
      </div>
    </div>
  );
}

// Componente do Modal de Medição principal
function MeasurementModal({ isOpen, vitalSignConfig, onComplete }) {
  const [modalStep, setModalStep] = useState('instruction');
  const [displayValue, setDisplayValue] = useState('...');
  const [finalResult, setFinalResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [graphPoints, setGraphPoints] = useState([]);
  const timersRef = useRef([]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const getRandomValue = (min, max, isFloat = false) => {
    const random = Math.random() * (max - min) + min;
    return isFloat ? parseFloat(random.toFixed(1)) : Math.floor(random);
  };

  useEffect(() => {
    if (isOpen) {
      setModalStep('instruction');
      setDisplayValue('...');
      setFinalResult(null);
      setProgress(0);
      setGraphPoints([]);
      setIsVideoModalOpen(false);
    }
  }, [isOpen, vitalSignConfig.key]);

  useEffect(() => {
    if (modalStep === 'measuring') {
      const { min, max, isFloat, duration, isPressure } = vitalSignConfig;
      const simulationDuration = duration || 5000; // Aumentado para 5 segundos

      const valueInterval = setInterval(() => {
        if (isPressure) {
          setDisplayValue(`${getRandomValue(110, 130)}/${getRandomValue(70, 90)}`);
        } else {
          setDisplayValue(getRandomValue(min, max, isFloat));
        }
      }, 300);

      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 1, 100));
      }, simulationDuration / 100);
      
      const graphInterval = setInterval(() => {
        setGraphPoints(prev => {
          const lastX = prev.length > 0 ? prev[prev.length - 1].x : 0;
          const newPoint = { x: lastX + 5, y: 50 + (Math.random() - 0.5) * 30 };
          return [...prev, newPoint].slice(-50);
        });
      }, 60);

      const completionTimeout = setTimeout(() => {
        timersRef.current.forEach(timer => clearInterval(timer));
        
        let finalValue;
        if (isPressure) {
          finalValue = `${getRandomValue(118, 122)}/${getRandomValue(78, 82)}`;
        } else {
          finalValue = getRandomValue(min, max, isFloat);
        }
        
        setFinalResult(finalValue);
        setDisplayValue(finalValue);
        setModalStep('finished');

      }, simulationDuration);

      timersRef.current = [valueInterval, progressInterval, graphInterval, completionTimeout];
    }
    
    return () => {
      timersRef.current.forEach(timer => {
        clearInterval(timer);
        clearTimeout(timer);
      });
    };
  }, [modalStep, vitalSignConfig]);

  if (!isOpen) return null;

  return (
    <>
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={vitalSignConfig.videoUrl}
        title={`Como Medir: ${vitalSignConfig.label}`}
      />
      
      <div className="fixed inset-0 bg-slate-900 bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center flex flex-col items-center gap-6">
          <div className="text-orange">{vitalSignConfig.icon}</div>

          {/* Etapa 1: Instrução */}
          {modalStep === 'instruction' && (
            <div className="w-full flex flex-col items-center gap-4 animate-fade-in">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Preparar Medição</h3>
              <p className="text-slate-600 dark:text-slate-400 min-h-[48px]">{vitalSignConfig.instruction}</p>
              <div className="w-full space-y-3">
                <button
                  onClick={() => setModalStep('measuring')}
                  className="w-full font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition bg-orange text-white hover:bg-orange/80 focus:ring-orange"
                >
                  Iniciar Medição
                </button>
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="w-full font-semibold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition bg-transparent border border-orange text-orange hover:bg-orange/10 focus:ring-orange"
                >
                  Ver vídeo de instrução
                </button>
              </div>
            </div>
          )}

          {/* Etapa 2: Medindo */}
          {modalStep === 'measuring' && (
            <div className="w-full flex flex-col items-center gap-4 animate-fade-in">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                Medindo {vitalSignConfig.label}...
              </h3>
              <p className="text-5xl font-mono font-bold text-orange min-h-[60px]">
                {displayValue}
                <span className="text-2xl ml-2 text-slate-400">{vitalSignConfig.unit}</span>
              </p>
              <svg className="w-full h-24" viewBox="0 0 250 100">
                <polyline fill="none" stroke="#f97316" strokeWidth="2" points={graphPoints.map(p => `${p.x},${p.y}`).join(' ')} />
              </svg>
              <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-2.5">
                <div className="bg-orange h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
              </div>
            </div>
          )}

          {/* Etapa 3: Concluído */}
          {modalStep === 'finished' && (
              <div className="flex flex-col items-center gap-6 animate-fade-in">
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-500">Medição Concluída</h3>
                  <p className="text-5xl font-mono font-bold text-slate-800 dark:text-slate-200 min-h-[60px]">
                    {displayValue}
                    <span className="text-2xl ml-2 text-slate-400">{vitalSignConfig.unit}</span>
                  </p>
                  <button
                    onClick={() => onComplete(vitalSignConfig.key, finalResult)}
                    className="w-full font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition bg-orange text-white hover:bg-orange-600 focus:ring-orange-400"
                  >
                    Avançar
                  </button>
              </div>
          )}
        </div>
      </div>
    </>
  );
}

// Configuração centralizada para cada sinal vital
const VITAL_SIGNS_CONFIG = {
  temperatura: {
    key: 'temperatura', label: 'Temperatura', unit: '°C',
    instruction: 'Por favor, posicione o sensor de temperatura na testa.',
    icon: ( <Image className='dark:invert' width={400} height={400} alt='video temperatura' src={"/images/signal_help/temperatura.png"}/> ),
    min: 36.1, max: 37.2, isFloat: true,
    videoUrl: '/video/signal_vídeo_temperatura.mp4' // Placeholder URL
  },
  pressao: {
    key: 'pressao', label: 'Pressão Arterial', unit: 'mmHg',
    instruction: 'Por favor, insira o braço no medidor e relaxe.',
    icon: ( <Image className='dark:invert' width={400} height={400} alt='video temperatura' src={"/images/signal_help/pressao_arterial.png"}/> ),
    isPressure: true,
    videoUrl: '/video/signal_video_pressao_arterial.mp4' // Placeholder URL
  },
  frequencia: {
    key: 'frequencia', label: 'Frequência Cardíaca', unit: 'bpm',
    instruction: 'Posicione o dedo indicador no sensor de oximetria.',
    icon: ( <Image className='dark:invert' width={400} height={400} alt='video temperatura' src={"/images/signal_help/frequencia_cardiaca.png"}/> ),
    min: 60, max: 95,
    videoUrl: '/video/signal_video_frequencia_cardiaca.mp4' // Placeholder URL
  },
  saturacao: {
    key: 'saturacao', label: 'Saturação', unit: 'SpO₂ %',
    instruction: 'Mantenha o dedo no sensor por mais alguns instantes.',
    icon: ( <Image className='dark:invert' width={400} height={400} alt='video temperatura' src={"/images/signal_help/oxigenio.png"}/> ),
    min: 96, max: 99,
    videoUrl: '/video/signal_video__spo2.mp4' // Placeholder URL
  }
};

const measurementOrder = ['temperatura', 'pressao', 'frequencia', 'saturacao'];

// Componente principal que orquestra o fluxo
export function T_04_VitalSigns({ onNext, defaultValues }) {
  const [measurementState, setMeasurementState] = useState('idle'); // idle, measuring, complete
  const [currentMeasurement, setCurrentMeasurement] = useState(null); // 'temperatura', 'pressao', etc.
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({ defaultValues });

  const startMeasurementProcess = () => {
    setMeasurementState('measuring');
    setCurrentMeasurement(measurementOrder[0]);
  };

  const handleMeasurementComplete = (key, finalValue) => {
    setValue(`sinaisVitais.${key}`, finalValue, { shouldValidate: true });

    const currentIndex = measurementOrder.indexOf(key);
    const nextMeasurement = measurementOrder[currentIndex + 1];

    if (nextMeasurement) {
      setCurrentMeasurement(nextMeasurement);
    } else {
      setMeasurementState('complete');
      setCurrentMeasurement(null);
    }
  };
  
  const onSubmit = (data) => onNext(data);

  const isFormDisabled = measurementState === 'measuring' || isSubmitting;

  return (
    <>
      <MeasurementModal
        isOpen={!!currentMeasurement}
        vitalSignConfig={currentMeasurement ? VITAL_SIGNS_CONFIG[currentMeasurement] : {}}
        onComplete={handleMeasurementComplete}
      />

      <section className="py-16 flex items-center justify-center w-full bg-zinc-50 dark:bg-themeDark px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 flex flex-col gap-6 w-full max-w-md"
        >
          <Heading as="h2" text="Sinais Vitais" colorClass="dark:text-orange text-orange" />
          <ParagraphBlue>
            {measurementState === 'idle' && 'Clique em "Iniciar Medição" para capturar os dados dos sensores.'}
            {measurementState === 'measuring' && 'Aguarde, capturando dados dos sensores...'}
            {measurementState === 'complete' && 'Dados capturados! Verifique se estão corretos e prossiga.'}
          </ParagraphBlue>

          <div className="flex flex-col gap-4">
            {measurementOrder.map(key => {
              const config = VITAL_SIGNS_CONFIG[key];
              return (
                <div key={key}>
                  <label htmlFor={key} className="block text-zinc-800 font-semibold mb-1 dark:text-zinc-200">
                    {config.label} ({config.unit}):
                  </label>
                  <input
                    type={config.isFloat || !config.isPressure ? 'number' : 'text'}
                    step={config.isFloat ? '0.1' : '1'}
                    id={key}
                    disabled={measurementState === 'idle'}
                    readOnly // Paciente não deve editar os valores medidos
                    {...register(`sinaisVitais.${key}`, { 
                      required: `${config.label} é obrigatório`,
                      ...(config.isFloat || !config.isPressure) && { valueAsNumber: true }
                    })}
                    className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${
                      errors.sinaisVitais?.[key]
                        ? 'border-red-500 focus:ring-red-300'
                        : 'border-zinc-300 focus:ring-orange'
                    } text-black dark:bg-zinc-700 dark:border-zinc-600 dark:text-white disabled:bg-zinc-100 disabled:cursor-not-allowed dark:disabled:bg-zinc-800`}
                    placeholder={measurementState !== 'complete' ? 'Aguardando medição...' : `Ex: ${config.min}`}
                  />
                  {errors.sinaisVitais?.[key] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.sinaisVitais[key].message}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex flex-col gap-4 mt-6">
            {measurementState === 'idle' && (
              <button
                type="button"
                onClick={startMeasurementProcess}
                className="font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition bg-orange text-white hover:bg-orange/80 focus:ring-orange"
              >
                Iniciar Medição
              </button>
            )}
            
            <button
              type="submit"
              disabled={isFormDisabled || measurementState !== 'complete'}
              className={`font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${
                isFormDisabled || measurementState !== 'complete'
                  ? 'bg-zinc-400 text-zinc-200 cursor-not-allowed dark:bg-zinc-600 dark:text-zinc-400'
                  : 'bg-orange text-white hover:bg-orange-600 focus:ring-orange-400'
              }`}
            >
              {isSubmitting ? 'Enviando...' : 'Próximo'}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}