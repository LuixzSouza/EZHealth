'use client';

import { ParagraphBlue } from '@/components/theme/ParagraphBlue';
import { Heading } from '@/components/typography/Heading';
import { useForm } from 'react-hook-form';

export function T_06_SymptomDuration({ onNext, defaultValues }) {

  const { register, handleSubmit } = useForm({ defaultValues });

  const onSubmit = (data) => {
    // Passa todos os dados do formulário para a função onNext
    onNext(data);
  };

  const durationOptions = [
    { value: 'menos24h', label: 'Menos de 24 horas' },
    { value: '1a3dias', label: '1 a 3 dias' },
    { value: '4a7dias', label: '4 a 7 dias' },
    { value: 'maisSemana', label: 'Mais de uma semana' },
  ];

  return (
    <section className="pt-8 flex items-center justify-center w-full bg-zinc-50 dark:bg-themeDark px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/10 shadow-xl rounded-2xl p-8 flex flex-col gap-6 w-full max-w-md"
      >
        <Heading
          as="h2"
          text="Tempo dos Sintomas"
          colorClass="dark:text-orangeDark text-orange"
          className="md:text-3xl"
        />

        <ParagraphBlue>
          Há quanto tempo os sintomas começaram?
        </ParagraphBlue>

        <div className="flex flex-col gap-3">
          {durationOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 p-3 border border-zinc-300 rounded-md cursor-pointer transition-all
                        hover:border-orange text-black dark:text-white
                        peer-checked:border-orange peer-checked:bg-orange peer-checked:text-white"
            >
              <input
                type="radio"
                value={option.value}
                {...register('sintomasDetalhes.tempoSintomas', { required: true })}
                className="peer w-6 h-6 accent-orange"
              />
              <span className="text-base">{option.label}</span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 bg-orange text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition"
        >
          Próximo
        </button>
      </form>
    </section>
  );
}
