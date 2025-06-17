'use client';

import { ParagraphBlue } from '@/components/theme/ParagraphBlue';
import { Heading } from '@/components/typography/Heading';
import { useForm } from 'react-hook-form';

export function T_06_SymptomDuration({ onNext, defaultValues }) {

  // ✅ MELHORIA: Extraindo 'errors' do formState para exibir mensagens de validação
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues,
    mode: 'onBlur' // Mantém o modo de validação
  });

  const onSubmit = (data) => {
    onNext(data);
  };

  const durationOptions = [
    { value: 'menos24h', label: 'Menos de 24 horas' },
    { value: '1a3dias', label: '1 a 3 dias' },
    { value: '4a7dias', label: '4 a 7 dias' },
    { value: 'maisSemana', label: 'Mais de uma semana' },
  ];

  return (
    <section className="py-16 flex items-center justify-center w-full bg-zinc-50 dark:bg-themeDark px-4">
      {/* ✅ MELHORIA: Estilo do container alinhado com os outros formulários */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 flex flex-col gap-8 w-full max-w-lg"
      >
        <div className="text-center">
            <Heading
              as="h2"
              text="Tempo dos Sintomas"
              colorClass="dark:text-orange text-orange"
            />
            <ParagraphBlue className="mt-2">
              Há quanto tempo os sintomas começaram?
            </ParagraphBlue>
        </div>

        <div className="flex flex-col gap-4">
          {durationOptions.map((option) => (
            <label
              key={option.value}
              // ✅ MELHORIA: Estilo de seleção mais moderno e claro com `has-[:checked]`
              className="flex items-center gap-4 p-4 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer transition-all has-[:checked]:border-orange has-[:checked]:bg-orange/10 dark:text-white"
            >
              <input
                type="radio"
                value={option.value}
                id={option.value} // Boa prática de acessibilidade
                // ✅ MELHORIA: Mensagem de erro personalizada na validação
                {...register('sintomasDetalhes.tempoSintomas', { required: 'Por favor, selecione uma opção.' })}
                className="w-5 h-5 accent-orange"
              />
              <span className="text-base text-zinc-800 dark:text-zinc-200">{option.label}</span>
            </label>
          ))}
          
          {/* ✅ MELHORIA: Exibição da mensagem de erro */}
          {errors.sintomasDetalhes?.tempoSintomas && (
            <p className="text-red-500 text-sm text-center -mt-2">
              {errors.sintomasDetalhes.tempoSintomas.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          // ✅ MELHORIA: Estilo do botão alinhado com os outros formulários
          className="mt-4 bg-orange text-white font-bold py-3 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition text-lg"
        >
          Próximo
        </button>
      </form>
    </section>
  );
}