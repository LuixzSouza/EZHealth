'use client';

import { useState, useEffect, useRef } from 'react';
import { ParagraphBlue } from '@/components/theme/ParagraphBlue';
import { useForm } from 'react-hook-form';
import { Heading } from '@/components/typography/Heading';

// ✅ NOVO: Componente do Modal de Medição
function MeasurementModal({ isOpen, vitalSignConfig, onComplete }) {
  // Etapas internas do modal: 'instruction', 'measuring', 'finished'
  const [modalStep, setModalStep] = useState('instruction');
  const [displayValue, setDisplayValue] = useState('...');
  const [finalResult, setFinalResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [graphPoints, setGraphPoints] = useState([]);
  const timersRef = useRef([]);

  // Função para gerar valores aleatórios realistas
  const getRandomValue = (min, max, isFloat = false) => {
    const random = Math.random() * (max - min) + min;
    return isFloat ? parseFloat(random.toFixed(1)) : Math.floor(random);
  };

  // Efeito que reseta o modal sempre que ele é aberto para um novo equipamento
  useEffect(() => {
    if (isOpen) {
      setModalStep('instruction');
      setDisplayValue('...');
      setFinalResult(null);
      setProgress(0);
      setGraphPoints([]);
    }
  }, [isOpen, vitalSignConfig.key]);

  // Efeito que dispara a simulação QUANDO a etapa muda para 'measuring'
  useEffect(() => {
    if (modalStep === 'measuring') {
      const { min, max, isFloat, duration, isPressure } = vitalSignConfig;
      const simulationDuration = duration || 4000;

      // 1. Simulação do valor numérico
      const valueInterval = setInterval(() => {
        if (isPressure) {
          setDisplayValue(`${getRandomValue(110, 130)}/${getRandomValue(70, 90)}`);
        } else {
          setDisplayValue(getRandomValue(min, max, isFloat));
        }
      }, 300);

      // 2. Simulação da barra de progresso
      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 1, 100));
      }, simulationDuration / 100);
      
      // 3. Simulação do gráfico
      const graphInterval = setInterval(() => {
        setGraphPoints(prev => {
          const lastX = prev.length > 0 ? prev[prev.length - 1].x : 0;
          const newPoint = { x: lastX + 5, y: 50 + (Math.random() - 0.5) * 30 };
          return [...prev, newPoint].slice(-50);
        });
      }, 60);

      // 4. Conclusão da medição
      const completionTimeout = setTimeout(() => {
        timersRef.current.forEach(timer => clearInterval(timer)); // Para os updates
        
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
    
    return () => { // Função de limpeza
      timersRef.current.forEach(timer => {
        clearInterval(timer);
        clearTimeout(timer);
      });
    };
  }, [modalStep, vitalSignConfig]); // Roda de novo se a etapa ou o equipamento mudar

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center flex flex-col items-center gap-6">
        <div className="text-orange-500">{vitalSignConfig.icon}</div>

        {/* Etapa 1: Instrução */}
        {modalStep === 'instruction' && (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Preparar Medição</h3>
            <p className="text-slate-600 dark:text-slate-400 min-h-[48px]">{vitalSignConfig.instruction}</p>
            <button
              onClick={() => setModalStep('measuring')}
              className="w-full font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition bg-orange text-white hover:bg-orange/80 focus:ring-orange"
            >
              Iniciar Medição
            </button>
          </div>
        )}

        {/* Etapa 2: Medindo */}
        {modalStep === 'measuring' && (
          <div className="w-full flex flex-col items-center gap-4 animate-fade-in">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              Medindo {vitalSignConfig.label}...
            </h3>
            <p className="text-5xl font-mono font-bold text-orange-500 min-h-[60px]">
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
  );
}

// ✅ NOVO: Configuração centralizada para cada sinal vital
const VITAL_SIGNS_CONFIG = {
  temperatura: {
    key: 'temperatura', label: 'Temperatura', unit: '°C',
    instruction: 'Por favor, posicione o sensor de temperatura na testa.',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V8a3 3 0 00-6 0v8a3 3 0 006 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h- цифровой-термометр-икона-вектор-иллюстрация_1" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 9h.01" />
        </svg>
    ),
    min: 36.1, max: 37.2, isFloat: true
  },
  pressao: {
    key: 'pressao', label: 'Pressão Arterial', unit: 'mmHg',
    instruction: 'Por favor, insira o braço no medidor e relaxe.',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    ),
    isPressure: true
  },
  frequencia: {
    key: 'frequencia', label: 'Frequência Cardíaca', unit: 'bpm',
    instruction: 'Posicione o dedo indicador no sensor de oximetria.',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    min: 60, max: 95
  },
  saturacao: {
    key: 'saturacao', label: 'Saturação', unit: 'SpO₂ %',
    instruction: 'Mantenha o dedo no sensor por mais alguns instantes.',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
    ),
    min: 96, max: 99
  }
};

const measurementOrder = ['temperatura', 'pressao', 'frequencia', 'saturacao'];


export function T_04_VitalSigns({ onNext, defaultValues }) {
  // ✅ ALTERADO: Estados para controlar o novo fluxo
  const [measurementState, setMeasurementState] = useState('idle'); // idle, measuring, complete
  const [currentMeasurement, setCurrentMeasurement] = useState(null); // 'temperatura', 'pressao', etc.

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({ defaultValues });

  // ✅ ALTERADO: Inicia o processo de medição sequencial
  const startMeasurementProcess = () => {
    setMeasurementState('measuring');
    setCurrentMeasurement(measurementOrder[0]); // Começa com o primeiro item da lista
  };

  // ✅ ALTERADO: Chamado quando um modal de medição conclui
  const handleMeasurementComplete = (key, finalValue) => {
    // 1. Atualiza o valor no formulário
    setValue(`sinaisVitais.${key}`, finalValue, { shouldValidate: true });

    // 2. Encontra o próximo item a ser medido
    const currentIndex = measurementOrder.indexOf(key);
    const nextMeasurement = measurementOrder[currentIndex + 1];

    if (nextMeasurement) {
      // Se houver próximo, abre o modal para ele
      setCurrentMeasurement(nextMeasurement);
    } else {
      // Se não houver, finaliza o processo
      setMeasurementState('complete');
      setCurrentMeasurement(null);
    }
  };
  
  const onSubmit = (data) => onNext(data);

  const isFormDisabled = measurementState === 'measuring' || isSubmitting;

  return (
    <>
      {/* O modal será renderizado aqui fora do fluxo principal */}
      <MeasurementModal
        isOpen={!!currentMeasurement}
        vitalSignConfig={currentMeasurement ? VITAL_SIGNS_CONFIG[currentMeasurement] : {}}
        onComplete={handleMeasurementComplete}
      />

      <section className="pt-8 flex items-center justify-center w-full bg-zinc-50 dark:bg-themeDark px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-6 w-full max-w-md dark:bg-zinc-900"
        >
          <Heading as="h2" text="Sinais Vitais" colorClass="dark:text-orangeDark text-orange" />
          <ParagraphBlue>
            {measurementState === 'idle' && 'Clique em "Iniciar Medição" para capturar os dados dos sensores.'}
            {measurementState === 'measuring' && 'Aguarde, capturando dados dos sensores...'}
            {measurementState === 'complete' && 'Dados capturados! Verifique se estão corretos e prossiga.'}
          </ParagraphBlue>

          {/* Campos de Input - Lógica simplificada */}
          <div className="flex flex-col gap-4">
            {/* Mapeia a configuração para criar os campos dinamicamente */}
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
                    disabled={isFormDisabled || measurementState === 'idle'}
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

          {/* Botões de Ação */}
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