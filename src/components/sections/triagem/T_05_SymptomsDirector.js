'use client';

import { useState, useEffect } from "react"; // ✅ IMPORTADO
import { ParagraphBlue } from '@/components/theme/ParagraphBlue';
import { useForm } from 'react-hook-form';
import { Heading } from '@/components/typography/Heading';
import { useSpeechToForm } from "@/hooks/useSpeechToForm"; // ✅ IMPORTADO
import { XCircleIcon } from "@heroicons/react/24/solid"; // ✅ IMPORTADO

// Ícone de microfone definido localmente para conveniência
const MicrophoneIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5a6 6 0 0 0-12 0v1.5a6 6 0 0 0 6 6Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5" />
  </svg>
);


export function T_05_SymptomsDirector({ onNext, defaultValues }) {

  // ✅ ADICIONADO setValue e watch
  const { register, handleSubmit, setValue, watch } = useForm({ defaultValues });

  // ✅ HOOKS PARA A NOVA FUNCIONALIDADE
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true) }, []);
  const { activeField, startListening, hasRecognitionSupport } = useSpeechToForm({ setValue });
  const outrosValue = watch('sintomas.outros');


  const onSubmit = (data) => {
    onNext(data);
  };

  const symptomOptions = [
    { name: 'febre', label: 'Febre' },
    { name: 'dorCabeca', label: 'Dor de cabeça' },
    { name: 'dorPeito', label: 'Dor no peito' },
    { name: 'faltaAr', label: 'Falta de ar' },
    { name: 'tontura', label: 'Tontura' },
    { name: 'nauseaVomito', label: 'Náusea/vômito' },
    { name: 'tosse', label: 'Tosse' }
  ];

  return (
    <section className="py-16 flex items-center justify-center w-full bg-zinc-50 dark:bg-themeDark px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 flex flex-col gap-8 w-full max-w-lg"
      >
        
        <div className="text-center">
          <Heading as="h2" text="Queixa Principal" colorClass="dark:text-orange text-orange" />
          <ParagraphBlue className="mt-2">
            Descreva com suas palavras ou selecione uma ou mais opções abaixo:
          </ParagraphBlue>
        </div>

        {/* Checkboxes (sem alterações) */}
        <div className="flex flex-col gap-3">
          {symptomOptions.map((symptom) => (
            <label
              key={symptom.name}
              className="flex items-center gap-4 p-4 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer transition-all has-[:checked]:border-orange has-[:checked]:bg-orange/10 dark:text-white"
            >
              <input
                type="checkbox"
                {...register(`sintomas.${symptom.name}`)}
                className="accent-orange w-5 h-5"
              />
              <span className="text-base text-zinc-800 dark:text-zinc-200">{symptom.label}</span>
            </label>
          ))}

          {/* ✅ CAMPO "OUTROS" MODIFICADO */}
          <div className="mt-4">
            <label htmlFor="sintomas.outros" className="block text-zinc-800 dark:text-zinc-200 font-semibold mb-2">
              Outros sintomas (opcional):
            </label>
            <div className="relative w-full">
              <input
                type="text"
                id="sintomas.outros"
                {...register('sintomas.outros')}
                placeholder="Descreva aqui..."
                // Adicionado padding à direita para os ícones
                className="w-full border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800 rounded-md p-3 pr-20 focus:outline-none focus:ring-2 focus:ring-orange text-black dark:text-white"
              />
              {/* Div para agrupar os ícones à direita */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                
                {/* Botão de Limpar */}
                {outrosValue && !activeField && (
                  <button type="button" onClick={() => setValue('sintomas.outros', '', { shouldFocus: true })} title="Limpar campo">
                    <XCircleIcon className="w-6 h-6 text-zinc-400 hover:text-red-500 transition-colors" />
                  </button>
                )}

                {/* Botão de Microfone */}
                {isClient && hasRecognitionSupport && (
                  <button
                      type="button"
                      // Atenção ao nome aninhado do campo
                      onClick={() => startListening('sintomas.outros')}
                      disabled={!!activeField}
                      title="Falar os sintomas"
                      className={`p-1 rounded-full transition-colors ${activeField === 'sintomas.outros' ? 'bg-red-500 text-white animate-pulse' : 'text-zinc-500 hover:text-orange'}`}
                  >
                      <MicrophoneIcon className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-orange text-white font-bold py-3 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition text-lg"
        >
          Próximo
        </button>
      </form>
    </section>
  );
}