'use client';

import { useForm, useWatch } from 'react-hook-form';
import { ParagraphBlue } from '@/components/theme/ParagraphBlue';
import { Heading } from '@/components/typography/Heading';

export function T_08_Medication({ onNext, defaultValues }) {
  const { register, handleSubmit, control } = useForm({ defaultValues });

  const usaMedicamento = useWatch({ control, name: 'medicamentos.usaMedicamento' }) === 'sim';

  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <section className="pt-8 flex items-center justify-center w-full bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/10 shadow-xl rounded-2xl p-8 flex flex-col gap-6 w-full max-w-md"
      >
        <Heading
          as="h2"
          text="Uso de Medicamentos"
          colorClass="dark:text-orangeDark text-orange"
          className="md:text-3xl"
        />

        <ParagraphBlue>
          Você faz uso contínuo de algum medicamento?
        </ParagraphBlue>

        <div className="flex flex-col gap-3">
          {['sim', 'nao'].map((val) => (
            <label
              key={val}
              className="flex items-center gap-3 p-3 border border-gray-300 rounded-md cursor-pointer
                         text-black dark:text-white transition-all hover:border-orange
                         peer-checked:border-orange peer-checked:bg-orange peer-checked:text-white"
            >
              <input
                type="radio"
                value={val}
                {...register('medicamentos.usaMedicamento', { required: true })}
                className="peer hidden"
              />
              <span className="w-6 h-6 flex items-center justify-center border-2 border-black/50 rounded-full
                               peer-checked:border-orange peer-checked:bg-orange"
              >
                {/* círculo preenchido para selecionado */}
                <span className="w-3 h-3 bg-orange rounded-full peer-checked:block hidden"></span>
              </span>
              <span className="text-base capitalize">{val === 'sim' ? 'Sim' : 'Não'}</span>
            </label>
          ))}

          {usaMedicamento && (
            <div className="mt-4">
              <label
                htmlFor="quaisMedicamentos"
                className="block text-gray-800 font-semibold mb-1 text-black dark:text-white"
              >
                Qual(is)?
              </label>
              <input
                type="text"
                id="quaisMedicamentos"
                {...register('medicamentos.quaisMedicamentos')}
                placeholder="Digite os nomes..."
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange text-black dark:text-white bg-white dark:bg-gray-800"
              />
            </div>
          )}
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
