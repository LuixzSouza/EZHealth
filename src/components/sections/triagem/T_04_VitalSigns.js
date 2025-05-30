'use client';

import { ParagraphBlue } from '@/components/theme/ParagraphBlue';
import { Heading } from '@/components/typography/Heading';
import { useForm } from 'react-hook-form';

export function T_04_VitalSigns({ onNext, defaultValues = {} }) {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      temperatura: '',
      pressao: '',
      frequencia: '',
      saturacao: '',
      ...defaultValues
    }
  });

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

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="temperatura" className="block text-gray-800 font-semibold mb-1">
              Temperatura corporal (°C):
            </label>
            <input
              type="number"
              step="0.1"
              id="temperatura"
              {...register('temperatura')}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange text-black"
              placeholder="Ex: 36.5"
              required
            />
          </div>

          <div>
            <label htmlFor="pressao" className="block text-gray-800 font-semibold mb-1">
              Pressão arterial (mmHg):
            </label>
            <input
              type="text"
              id="pressao"
              {...register('pressao')}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange text-black"
              placeholder="Ex: 120/80"
              required
            />
          </div>

          <div>
            <label htmlFor="frequencia" className="block text-gray-800 font-semibold mb-1">
              Frequência cardíaca (bpm):
            </label>
            <input
              type="number"
              id="frequencia"
              {...register('frequencia')}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange text-black"
              placeholder="Ex: 75"
              required
            />
          </div>

          <div>
            <label htmlFor="saturacao" className="block text-gray-800 font-semibold mb-1">
              Saturação de oxigênio (SpO₂ %):
            </label>
            <input
              type="number"
              id="saturacao"
              {...register('saturacao')}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange text-black"
              placeholder="Ex: 98"
              required
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
