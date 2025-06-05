'use client';

import { ParagraphBlue } from '@/components/theme/ParagraphBlue';
import { Heading } from '@/components/typography/Heading';
import { useForm } from 'react-hook-form';

export function T_07_MedicalHistory({ onNext, defaultValues }) {

  const { register, handleSubmit } = useForm({ defaultValues });

  const onSubmit = (data) => {
    // Passa todos os dados do formulário para a função onNext
    onNext(data);
  };

  const historyOptions = [
    { name: 'hipertensao', label: 'Hipertensão' },
    { name: 'diabetes', label: 'Diabetes' },
    { name: 'cardiaco', label: 'Doenças cardíacas' },
    { name: 'respiratorio', label: 'Doenças respiratórias (asma, bronquite, etc.)' },
    { name: 'alergias', label: 'Alergias importantes' },
    { name: 'gravidez', label: 'Gravidez' },
    { name: 'nenhuma', label: 'Nenhuma das anteriores' },
  ];

  return (
    <section className="pt-8 flex items-center justify-center w-full bg-zinc-50 dark:bg-themeDark px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/10 shadow-xl rounded-2xl p-8 flex flex-col gap-6 w-full max-w-md"
      >
        <Heading
          as="h2"
          text="Histórico Médico"
          colorClass="dark:text-orangeDark text-orange"
          className="md:text-3xl"
        />

        <ParagraphBlue>
          Alguma das condições abaixo se aplica a você?
        </ParagraphBlue>

        <div className="flex flex-col gap-3">
          {historyOptions.map((item) => (
            <label
              key={item.name}
              className="flex items-center gap-3 p-3 border border-zinc-300 rounded-md cursor-pointer transition-all
                        hover:border-orange text-black dark:text-white
                        peer-checked:border-orange peer-checked:bg-orange peer-checked:text-white"
            >
              <input
                type="checkbox"
                {...register(`historico.${item.name}`)}
                className="peer w-6 h-6 accent-orange"
              />
              <span className="text-base">{item.label}</span>
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
