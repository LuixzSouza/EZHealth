'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ParagraphBlue } from '@/components/theme/ParagraphBlue';
import { useForm } from 'react-hook-form';
import { Heading } from '@/components/typography/Heading';

export function T_04_VitalSigns({ onNext, defaultValues }) {
  // 'idle': esperando para iniciar | 'connecting': conectando ao aparelho | 'measuring': medindo dados | 'complete': medição concluída
  const [measurementState, setMeasurementState] = useState('idle');
  // Valores exibidos na tela durante a fase 'measuring'
  // IMPORTANTE: Inicializar valores numéricos como null e strings como ''
  const [displayValues, setDisplayValues] = useState({
    temperatura: null, // null para type="number"
    pressao: '',       // '' para type="text"
    frequencia: null,  // null para type="number"
    saturacao: null    // null para type="number"
  });
  // Estado para os pontos do gráfico simulado
  const [graphPoints, setGraphPoints] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch, // Para observar os valores do formulário quando a medição estiver completa
    reset // Para resetar o formulário quando "Medir Novamente" for clicado
  } = useForm({ defaultValues });

  // Armazena os valores reais do formulário do react-hook-form para exibição quando não estiver medindo
  const formTemperatura = watch('sinaisVitais.temperatura');
  const formPressao = watch('sinaisVitais.pressao');
  const formFrequencia = watch('sinaisVitais.frequencia');
  const formSaturacao = watch('sinaisVitais.saturacao');

  // Ref para armazenar os valores finais reais que serão definidos no formulário
  const finalValuesRef = useRef({
    temperatura: defaultValues?.sinaisVitais?.temperatura || 36.7,
    pressao: defaultValues?.sinaisVitais?.pressao || '120/80',
    frequencia: defaultValues?.sinaisVitais?.frequencia || 78,
    saturacao: defaultValues?.sinaisVitais?.saturacao || 97
  });

  // Ref para armazenar IDs de timers/intervals para limpá-los ao desmontar o componente
  const timersRef = useRef([]);

  // Função para iniciar o processo de medição
  const startMeasurement = useCallback(() => {
    // Limpa quaisquer timers anteriores antes de iniciar um novo ciclo
    timersRef.current.forEach(timerId => {
      clearInterval(timerId);
      clearTimeout(timerId);
    });
    timersRef.current = [];

    // Reseta displayValues e graphPoints para o início da nova medição
    // Importante: Reseta para os valores que não causarão NaN no input type="number"
    setDisplayValues({ temperatura: null, pressao: '', frequencia: null, saturacao: null });
    setGraphPoints([]);
    setMeasurementState('connecting');

    // Estágio 1: Conectando (2 segundos)
    const connectTimeout = setTimeout(() => {
      setMeasurementState('measuring');

      // Estágio 2: Medindo (Simula fluxo de dados e gráfico)
      let currentGraphValue = 50; // Ponto de partida para a linha do gráfico
      const graphInterval = setInterval(() => {
        // Simula dados do gráfico tipo batimento cardíaco
        currentGraphValue = 50 + Math.sin(Date.now() / 100) * 40; // Onda senoidal para ritmo cardíaco
        setGraphPoints(prev => {
          const newPoints = [...prev, { x: prev.length * 5, y: currentGraphValue }];
          // Mantém apenas os últimos N pontos para mostrar uma janela móvel
          return newPoints.slice(-50); // Mostra os últimos 50 pontos
        });
      }, 50); // Atualiza o gráfico frequentemente

      timersRef.current.push(graphInterval);

      const simulatedDataStream = [
        { temperatura: 35.0, pressao: '90/60', frequencia: 50, saturacao: 90 },
        { temperatura: 35.5, pressao: '100/70', frequencia: 60, saturacao: 92 },
        { temperatura: 36.0, pressao: '110/75', frequencia: 70, saturacao: 95 },
        // Garante que o último valor da simulação é o final, e que são numéricos para os inputs type="number"
        {
          temperatura: parseFloat(finalValuesRef.current.temperatura),
          pressao: String(finalValuesRef.current.pressao),
          frequencia: parseFloat(finalValuesRef.current.frequencia),
          saturacao: parseFloat(finalValuesRef.current.saturacao)
        },
      ];

      let step = 0;
      const measurementInterval = setInterval(() => {
        if (step < simulatedDataStream.length) {
          const data = simulatedDataStream[step];
          // Assegura que os valores passados para setDisplayValues sejam os tipos corretos
          // e que nulls sejam tratados como null, não NaN, para numbers
          setDisplayValues({
            temperatura: typeof data.temperatura === 'number' ? data.temperatura : null,
            pressao: typeof data.pressao === 'string' ? data.pressao : '',
            frequencia: typeof data.frequencia === 'number' ? data.frequencia : null,
            saturacao: typeof data.saturacao === 'number' ? data.saturacao : null,
          });
          step++;
        } else {
          // Medição concluída
          clearInterval(measurementInterval);
          clearInterval(graphInterval); // Para a animação do gráfico
          timersRef.current = timersRef.current.filter(
            id => id !== graphInterval && id !== measurementInterval
          );

          // Define os valores finais no react-hook-form
          setValue('sinaisVitais.temperatura', finalValuesRef.current.temperatura);
          setValue('sinaisVitais.pressao', finalValuesRef.current.pressao);
          setValue('sinaisVitais.frequencia', finalValuesRef.current.frequencia);
          setValue('sinaisVitais.saturacao', finalValuesRef.current.saturacao);
          setMeasurementState('complete');
        }
      }, 500); // Atualiza os números dos sinais vitais a cada 500ms

      timersRef.current.push(measurementInterval);
    }, 2000); // Conecta por 2s

    timersRef.current.push(connectTimeout);
  }, [setValue]);

  // Limpa os timers ao desmontar o componente
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timerId => {
        clearInterval(timerId);
        clearTimeout(timerId);
      });
    };
  }, []);

  // Função para resetar e medir novamente
  const handleMeasureAgain = () => {
    // Reseta o formulário para os valores padrão (ou limpa completamente, se preferir)
    // Ao resetar, garanta que os valores padrão para number sejam null para serem "não controlados" inicialmente,
    // ou um número válido. NUNCA uma string vazia para inputs type="number".
    reset({
      sinaisVitais: {
        temperatura: null, // Resetar para null
        pressao: '',       // Resetar para string vazia
        frequencia: null,  // Resetar para null
        saturacao: null,   // Resetar para null
      }
    });
    // Inicia o processo de medição do zero
    startMeasurement();
  };

  const onSubmit = (data) => {
    onNext(data);
  };

  const isFormDisabled = measurementState !== 'complete' || isSubmitting;
  const showStartButton = measurementState === 'idle' && !isSubmitting;

  // Funções auxiliares para garantir que nunca passemos NaN para o value
  const formatNumberValue = (rawValue) => {
    if (Number.isNaN(rawValue)) return '';
    if (rawValue === null || rawValue === undefined) return '';
    return rawValue;
  };

  const formatStringValue = (rawValue) => {
    return rawValue ?? '';
  };

  return (
    <section className="pt-8 flex items-center justify-center w-full bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-6 w-full max-w-md dark:bg-gray-900"
      >
        <Heading as="h2" text="Sinais Vitais" colorClass="dark:text-orangeDark text-orange" />

        <ParagraphBlue>
          Esses dados são capturados automaticamente pelos sensores do totem. Verifique se estão corretos.
        </ParagraphBlue>

        {/* Exibição Dinâmica do Estado e Gráfico */}
        <div
          className={`text-center py-4 rounded-md transition-colors duration-300 relative overflow-hidden
            ${measurementState === 'idle' ? 'bg-gray-100 border border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200' : ''}
            ${measurementState === 'connecting' ? 'bg-blue-100 border border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200' : ''}
            ${measurementState === 'measuring' ? 'bg-orange-100 border border-orange-300 text-orange-800 dark:bg-orange-900 dark:border-orange-700 dark:text-orange-200' : ''}
            ${measurementState === 'complete' ? 'bg-green-100 border border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200' : ''}
          `}
        >
          {measurementState === 'idle' && (
            <span className="flex items-center justify-center text-lg font-medium">
              <svg
                className="h-6 w-6 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Pronto para iniciar a medição
            </span>
          )}
          {measurementState === 'connecting' && (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Conectando ao dispositivo...
            </span>
          )}
          {measurementState === 'measuring' && (
            <div className="flex flex-col items-center">
              <span className="flex items-center justify-center mb-2">
                <svg
                  className="animate-pulse h-5 w-5 mr-2 text-orange-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm1 3a1 1 0 100-2 1 1 0 000 2zm3-3a1 1 0 100-2 1 1 0 000 2zm1 3a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Realizando medições...
              </span>
              {/* Gráfico Simulado */}
              <svg
                className="w-full h-20 bg-white dark:bg-gray-800 rounded-md"
                viewBox="0 0 250 100"
              >
                <rect x="0" y="0" width="250" height="100" fill="transparent" />
                <polyline
                  fill="none"
                  stroke="#ef4444" // Cor vermelha para a linha do batimento cardíaco
                  strokeWidth="2"
                  points={graphPoints.map(p => `${p.x},${p.y}`).join(' ')}
                >
                  {/* Anima stroke-dashoffset para efeito de desenho contínuo */}
                  <animate
                    attributeName="stroke-dasharray"
                    from="0 250"
                    to="250 0"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </polyline>
              </svg>
            </div>
          )}
          {measurementState === 'complete' && (
            <span className="flex items-center justify-center">
              <svg
                className="h-5 w-5 mr-2 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Medições concluídas!
            </span>
          )}
        </div>

        {/* Campos de Input */}
        <div className="flex flex-col gap-4">
          {/* Temperatura */}
          <div>
            <label
              htmlFor="temperatura"
              className="block text-gray-800 font-semibold mb-1 dark:text-gray-200"
            >
              Temperatura corporal (°C):
            </label>
            <input
              type="number"
              step="0.1"
              id="temperatura"
              disabled={isFormDisabled}
              {...register('sinaisVitais.temperatura', {
                required: 'Temperatura é obrigatória',
                valueAsNumber: true,
                min: { value: 30, message: 'Temperatura deve ser ≥ 30°C' },
                max: { value: 45, message: 'Temperatura deve ser ≤ 45°C' },
              })}
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${
                errors.sinaisVitais?.temperatura
                  ? 'border-red-500 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-orange'
              } text-black dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              value={
                measurementState === 'measuring'
                  ? displayValues.temperatura == null
                    ? ''
                    : displayValues.temperatura
                  : formatNumberValue(formTemperatura)
              }
              placeholder={
                measurementState === 'measuring'
                  ? displayValues.temperatura == null
                    ? '---'
                    : String(displayValues.temperatura)
                  : 'Ex: 36.5'
              }
            />
            {errors.sinaisVitais?.temperatura && (
              <p className="text-red-500 text-sm mt-1">
                {errors.sinaisVitais.temperatura.message}
              </p>
            )}
          </div>

          {/* Pressão Arterial */}
          <div>
            <label
              htmlFor="pressao"
              className="block text-gray-800 font-semibold mb-1 dark:text-gray-200"
            >
              Pressão arterial (mmHg):
            </label>
            <input
              type="text"
              id="pressao"
              disabled={isFormDisabled}
              {...register('sinaisVitais.pressao', {
                required: 'Pressão arterial é obrigatória',
                pattern: {
                  value: /^\d{2,3}\/\d{2,3}$/,
                  message: 'Formato inválido. Use “120/80”',
                },
              })}
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${
                errors.sinaisVitais?.pressao
                  ? 'border-red-500 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-orange'
              } text-black dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              value={
                measurementState === 'measuring'
                  ? displayValues.pressao == null
                    ? ''
                    : displayValues.pressao
                  : formatStringValue(formPressao)
              }
              placeholder={
                measurementState === 'measuring'
                  ? displayValues.pressao == null
                    ? '---'
                    : displayValues.pressao
                  : 'Ex: 120/80'
              }
            />
            {errors.sinaisVitais?.pressao && (
              <p className="text-red-500 text-sm mt-1">
                {errors.sinaisVitais.pressao.message}
              </p>
            )}
          </div>

          {/* Frequência Cardíaca */}
          <div>
            <label
              htmlFor="frequencia"
              className="block text-gray-800 font-semibold mb-1 dark:text-gray-200"
            >
              Frequência cardíaca (bpm):
            </label>
            <input
              type="number"
              id="frequencia"
              disabled={isFormDisabled}
              {...register('sinaisVitais.frequencia', {
                required: 'Frequência cardíaca é obrigatória',
                valueAsNumber: true,
                min: { value: 30, message: 'Valor mínimo: 30 bpm' },
                max: { value: 200, message: 'Valor máximo: 200 bpm' },
              })}
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${
                errors.sinaisVitais?.frequencia
                  ? 'border-red-500 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-orange'
              } text-black dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              value={
                measurementState === 'measuring'
                  ? displayValues.frequencia == null
                    ? ''
                    : displayValues.frequencia
                  : formatNumberValue(formFrequencia)
              }
              placeholder={
                measurementState === 'measuring'
                  ? displayValues.frequencia == null
                    ? '---'
                    : String(displayValues.frequencia)
                  : 'Ex: 75'
              }
            />
            {errors.sinaisVitais?.frequencia && (
              <p className="text-red-500 text-sm mt-1">
                {errors.sinaisVitais.frequencia.message}
              </p>
            )}
          </div>

          {/* Saturação */}
          <div>
            <label
              htmlFor="saturacao"
              className="block text-gray-800 font-semibold mb-1 dark:text-gray-200"
            >
              Saturação de oxigênio (SpO₂ %):
            </label>
            <input
              type="number"
              id="saturacao"
              disabled={isFormDisabled}
              {...register('sinaisVitais.saturacao', {
                required: 'Saturação é obrigatória',
                valueAsNumber: true,
                min: { value: 50, message: 'Saturação mínima: 50%' },
                max: { value: 100, message: 'Saturação máxima: 100%' },
              })}
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${
                errors.sinaisVitais?.saturacao
                  ? 'border-red-500 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-orange'
              } text-black dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              value={
                measurementState === 'measuring'
                  ? displayValues.saturacao == null
                    ? ''
                    : displayValues.saturacao
                  : formatNumberValue(formSaturacao)
              }
              placeholder={
                measurementState === 'measuring'
                  ? displayValues.saturacao == null
                    ? '---'
                    : String(displayValues.saturacao)
                  : 'Ex: 98'
              }
            />
            {errors.sinaisVitais?.saturacao && (
              <p className="text-red-500 text-sm mt-1">
                {errors.sinaisVitais.saturacao.message}
              </p>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col gap-4 mt-6">
          {showStartButton && (
            <button
              type="button"
              onClick={startMeasurement}
              className="font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition
                         bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400"
            >
              <span className="flex items-center justify-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.752 11.127l-3.328 3.328m0 0l-3.328-3.328m3.328 3.328V3m9.37 9.37a9 9 0 01-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                Iniciar Medição
              </span>
            </button>
          )}

          {measurementState === 'complete' && !isSubmitting && (
            <button
              type="button"
              onClick={handleMeasureAgain}
              className="font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition
                         bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <span className="flex items-center justify-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356-2A8.001 8.001 0 004 12c0 1.582-.582 3.037-1.582 4.293m0 0L4 20h.582"
                  ></path>
                </svg>
                Medir Novamente
              </span>
            </button>
          )}

          <button
            type="submit"
            disabled={isFormDisabled || showStartButton}
            className={`font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${
              isFormDisabled || showStartButton
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                : 'bg-orange text-white hover:bg-orange-600 focus:ring-orange-400'
            }`}
          >
            {isSubmitting ? 'Enviando...' : 'Próximo'}
          </button>
        </div>
      </form>
    </section>
  );
}
