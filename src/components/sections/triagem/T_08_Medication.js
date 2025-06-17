'use client';

import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ParagraphBlue } from '@/components/theme/ParagraphBlue';
import { Heading } from '@/components/typography/Heading';
import { useSpeechToForm } from "@/hooks/useSpeechToForm"; // ✅ PADRÃO
import { XCircleIcon } from "@heroicons/react/24/solid"; // ✅ PADRÃO

// Ícone de microfone definido localmente para conveniência
const MicrophoneIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5a6 6 0 0 0-12 0v1.5a6 6 0 0 0 6 6Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5" />
  </svg>
);

export function T_08_Medication({ onNext, defaultValues }) {
  // ✅ PADRÃO: Extraindo tudo o que é necessário do useForm
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    defaultValues,
    mode: 'onBlur',
  });

  // ✅ PADRÃO: Hooks para funcionalidades avançadas
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true) }, []);
  const { activeField, startListening, hasRecognitionSupport } = useSpeechToForm({ setValue });

  // Observa a resposta para mostrar/ocultar o campo de texto
  const usaMedicamento = useWatch({ control, name: 'medicamentos.usaMedicamento' }) === 'sim';
  // Observa o valor do campo de texto para mostrar/ocultar o botão de limpar
  const quaisMedicamentosValue = useWatch({ control, name: 'medicamentos.quaisMedicamentos' });

  const onSubmit = (data) => {
    onNext(data);
  };

  const medicationOptions = [
    { value: 'sim', label: 'Sim' },
    { value: 'nao', label: 'Não' }
  ];

  return (
    <section className="py-16 flex items-center justify-center w-full bg-zinc-50 dark:bg-themeDark px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        // ✅ PADRÃO: Estilo de container consistente
        className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 flex flex-col gap-8 w-full max-w-lg"
      >
        <div className="text-center">
          <Heading as="h2" text="Uso de Medicamentos" colorClass="dark:text-orange text-orange" />
          <ParagraphBlue className="mt-2">
            Você faz uso contínuo de algum medicamento?
          </ParagraphBlue>
        </div>

        <div className="flex flex-col gap-4">
          {medicationOptions.map((option) => (
            <label
              key={option.value}
              // ✅ PADRÃO: Estilo de seleção moderno e claro com `has-[:checked]`
              className="flex items-center gap-4 p-4 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer transition-all has-[:checked]:border-orange has-[:checked]:bg-orange/10 dark:text-white"
            >
              <input
                type="radio"
                value={option.value}
                id={option.value}
                // ✅ PADRÃO: Mensagem de erro personalizada
                {...register('medicamentos.usaMedicamento', { required: 'Por favor, selecione "Sim" ou "Não".' })}
                className="w-5 h-5 accent-orange"
              />
              <span className="text-base text-zinc-800 dark:text-zinc-200">{option.label}</span>
            </label>
          ))}
          
          {/* ✅ PADRÃO: Exibição da mensagem de erro */}
          {errors.medicamentos?.usaMedicamento && (
            <p className="text-red-500 text-sm text-center -mt-2">
              {errors.medicamentos.usaMedicamento.message}
            </p>
          )}

          {/* ✅ PADRÃO: Campo condicional com animação e funcionalidades avançadas */}
          {usaMedicamento && (
            <div className="mt-4 animate-fade-in">
              <label
                htmlFor="quaisMedicamentos"
                className="block text-zinc-800 dark:text-zinc-200 font-semibold mb-2"
              >
                Qual(is) medicamento(s) você utiliza?
              </label>
              <div className="relative w-full">
                <textarea
                  id="quaisMedicamentos"
                  rows={3}
                  // ✅ PADRÃO: Validação condicional
                  {...register('medicamentos.quaisMedicamentos', { 
                    required: usaMedicamento ? 'Por favor, liste seus medicamentos.' : false 
                  })}
                  placeholder="Ex: Losartana, Metformina, etc."
                  className="w-full border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800 rounded-md p-3 pr-20 focus:outline-none focus:ring-2 focus:ring-orange text-black dark:text-white"
                />
                 {/* ✅ PADRÃO: Ícones de Limpar e Voz */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {quaisMedicamentosValue && !activeField && (
                    <button type="button" onClick={() => setValue('medicamentos.quaisMedicamentos', '', { shouldFocus: true })} title="Limpar campo">
                      <XCircleIcon className="w-6 h-6 text-zinc-400 hover:text-red-500 transition-colors" />
                    </button>
                  )}
                  {isClient && hasRecognitionSupport && (
                    <button
                        type="button"
                        onClick={() => startListening('medicamentos.quaisMedicamentos')}
                        disabled={!!activeField}
                        title="Falar os medicamentos"
                        className={`p-1 rounded-full transition-colors ${activeField === 'medicamentos.quaisMedicamentos' ? 'bg-red-500 text-white animate-pulse' : 'text-zinc-500 hover:text-orange'}`}
                    >
                        <MicrophoneIcon className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>
              {errors.medicamentos?.quaisMedicamentos && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.medicamentos.quaisMedicamentos.message}
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          // ✅ PADRÃO: Estilo de botão consistente
          className="mt-4 bg-orange text-white font-bold py-3 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition text-lg"
        >
          Próximo
        </button>
      </form>
    </section>
  );
}