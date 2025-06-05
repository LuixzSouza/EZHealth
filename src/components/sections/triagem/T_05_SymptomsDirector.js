'use client';

import { ParagraphBlue } from '@/components/theme/ParagraphBlue';
import { Heading } from '@/components/typography/Heading';
import { useForm } from 'react-hook-form';

export function T_05_SymptomsDirector({ onNext, defaultValues }) {

  const { register, handleSubmit } = useForm({ defaultValues });

  const onSubmit = (data) => {
    // Passa todos os dados do formulário para a função onNext
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
    <section className="pt-8 flex items-center justify-center w-full bg-zinc-50 dark:bg-themeDark px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/10 shadow-xl rounded-2xl p-8 flex flex-col gap-6 w-full max-w-md"
      >
        
        <Heading as="h2" text="Queixa Principal" colorClass="dark:text-orangeDark text-orange" className='md:text-4xl' />

        <ParagraphBlue>
          Descreva com suas palavras ou selecione uma ou mais opções abaixo:
        </ParagraphBlue>

        <div className="flex flex-col gap-3">
          {symptomOptions.map((symptom) => (
            <label
              key={symptom.name}
              className="flex items-center gap-3 p-3 border border-zinc-300 rounded-md cursor-pointer transition-all
                        hover:border-orange peer-checked:border-orange peer-checked:bg-orange peer-checked:text-white text-black dark:text-white"
            >
              <input
                type="checkbox"
                {...register(`sintomas.${symptom.name}`)}
                className="peer accent-orange w-5 h-5"
              />
              <span className="text-base">{symptom.label}</span>
            </label>
          ))}

          {/* Campo "Outros" */}
          <div className="mt-4">
            <label htmlFor="sintomas.outros" className="block text-zinc-800 font-semibold mb-1">
              Outros sintomas:
            </label>
            <input
              type="text"
              id="sintomas.outros"
              {...register('sintomas.outros')}
              placeholder="Descreva aqui..."
              className="w-full border border-zinc-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange text-black"
            />
          </div>
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
