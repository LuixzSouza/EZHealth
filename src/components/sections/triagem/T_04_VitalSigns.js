'use client';

import { useState, useEffect } from 'react';
import { ParagraphBlue } from '@/components/theme/ParagraphBlue';
import { Heading } from '@/components/typography/Heading';
import { useForm } from 'react-hook-form';

export function T_04_VitalSigns({ onNext, defaultValues }) {
  // estado para simular conexão com a máquina de sinais vitais
  const [isConnecting, setIsConnecting] = useState(true);

  // Inicializa o useForm com defaultValues (caso existam)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  // Simulação de fetch dos dados dos sensores (via “máquina”)
  useEffect(() => {
    // Em um caso real, aqui você chamaria uma API ou WebSocket que retorna os sinais vitais
    const timer = setTimeout(() => {
      const dadosDaMaquina = {
        sinaisVitais: {
          temperatura: 36.7,
          pressao: '120/80',
          frequencia: 78,
          saturacao: 97,
        },
      };

      // Preenche o formulário com valores retornados pela “máquina”
      setValue('sinaisVitais.temperatura', dadosDaMaquina.sinaisVitais.temperatura);
      setValue('sinaisVitais.pressao', dadosDaMaquina.sinaisVitais.pressao);
      setValue('sinaisVitais.frequencia', dadosDaMaquina.sinaisVitais.frequencia);
      setValue('sinaisVitais.saturacao', dadosDaMaquina.sinaisVitais.saturacao);

      setIsConnecting(false);
    }, 1500); // simula 1.5s de “conexão”

    return () => clearTimeout(timer);
  }, [setValue]);

  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <section className="pt-8 flex items-center justify-center w-full bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/10 shadow-xl rounded-2xl p-8 flex flex-col gap-6 w-full max-w-md"
      >
        <Heading as="h2" text="Sinais Vitais" colorClass="dark:text-orangeDark text-orange" />

        <ParagraphBlue>
          Esses dados são capturados automaticamente pelos sensores do totem. Verifique se estão corretos.
        </ParagraphBlue>

        {isConnecting && (
          <div className="text-center py-2 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-800">
            Conectando ao dispositivo de sinais vitais...
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Temperatura */}
          <div>
            <label htmlFor="temperatura" className="block text-gray-800 font-semibold mb-1">
              Temperatura corporal (°C):
            </label>
            <input
              type="number"
              step="0.1"
              id="temperatura"
              disabled={isConnecting || isSubmitting}
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
              } text-black`}
              placeholder="Ex: 36.5"
            />
            {errors.sinaisVitais?.temperatura && (
              <p className="text-red-500 text-sm mt-1">
                {errors.sinaisVitais.temperatura.message}
              </p>
            )}
          </div>

          {/* Pressão Arterial */}
          <div>
            <label htmlFor="pressao" className="block text-gray-800 font-semibold mb-1">
              Pressão arterial (mmHg):
            </label>
            <input
              type="text"
              id="pressao"
              disabled={isConnecting || isSubmitting}
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
              } text-black`}
              placeholder="Ex: 120/80"
            />
            {errors.sinaisVitais?.pressao && (
              <p className="text-red-500 text-sm mt-1">
                {errors.sinaisVitais.pressao.message}
              </p>
            )}
          </div>

          {/* Frequência Cardíaca */}
          <div>
            <label htmlFor="frequencia" className="block text-gray-800 font-semibold mb-1">
              Frequência cardíaca (bpm):
            </label>
            <input
              type="number"
              id="frequencia"
              disabled={isConnecting || isSubmitting}
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
              } text-black`}
              placeholder="Ex: 75"
            />
            {errors.sinaisVitais?.frequencia && (
              <p className="text-red-500 text-sm mt-1">
                {errors.sinaisVitais.frequencia.message}
              </p>
            )}
          </div>

          {/* Saturação */}
          <div>
            <label htmlFor="saturacao" className="block text-gray-800 font-semibold mb-1">
              Saturação de oxigênio (SpO₂ %):
            </label>
            <input
              type="number"
              id="saturacao"
              disabled={isConnecting || isSubmitting}
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
              } text-black`}
              placeholder="Ex: 98"
            />
            {errors.sinaisVitais?.saturacao && (
              <p className="text-red-500 text-sm mt-1">
                {errors.sinaisVitais.saturacao.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isConnecting || isSubmitting}
          className={`mt-6 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${
            isConnecting || isSubmitting
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-orange text-white hover:bg-orange-600 focus:ring-orange-400'
          }`}
        >
          {isConnecting ? 'Aguardando conexão...' : isSubmitting ? 'Enviando...' : 'Próximo'}
        </button>
      </form>
    </section>
  );
}
