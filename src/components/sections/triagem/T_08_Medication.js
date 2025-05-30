'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { ParagraphBlue } from '@/components/theme/ParagraphBlue';
import { Heading } from '@/components/typography/Heading';

export function T_08_Medication({ onNext }) {
  const { register, handleSubmit, watch } = useForm();
  const usaMedicamento = watch('usaMedicamento') === 'sim';

  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <section className="pt-8 flex items-center justify-center w-full bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/10 shadow-xl rounded-2xl p-8 flex flex-col gap-6 w-full max-w-md"
      >
        <Heading as="h2" text="Uso de Medicamentos" colorClass="dark:text-orangeDark text-orange" className='md:text-3xl' />
                
        <ParagraphBlue>
          Você faz uso contínuo de algum medicamento?
        </ParagraphBlue>

        <div className="flex flex-col gap-3">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              value="sim"
              {...register('usaMedicamento', { required: true })}
              className="accent-orange"
            />
            <span className="text-gray-800">Sim</span>
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              value="nao"
              {...register('usaMedicamento', { required: true })}
              className="accent-orange"
            />
            <span className="text-gray-800">Não</span>
          </label>

          {usaMedicamento && (
            <div className="mt-4">
              <label htmlFor="quaisMedicamentos" className="block text-gray-800 font-semibold mb-1">
                Qual(is)?
              </label>
              <input
                type="text"
                id="quaisMedicamentos"
                {...register('quaisMedicamentos')}
                placeholder="Digite os nomes..."
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange"
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
