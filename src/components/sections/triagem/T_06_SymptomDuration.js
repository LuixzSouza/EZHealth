'use client';

import { useForm } from 'react-hook-form';

export function T_06_SymptomDuration({ onNext }) {
  const { register, handleSubmit } = useForm();

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
    <section className="pt-8 flex items-center justify-center w-full bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/10 shadow-xl rounded-2xl p-8 flex flex-col gap-6 w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-orange text-center mb-4">
          Tempo dos Sintomas
        </h2>

        <p className="text-blue-800 dark:text-white text-sm text-center mb-2">
          Há quanto tempo os sintomas começaram?
        </p>

        <div className="flex flex-col gap-3">
          {durationOptions.map((option) => (
            <label key={option.value} className="inline-flex items-center gap-2">
              <input
                type="radio"
                value={option.value}
                {...register('tempoSintomas', { required: true })}
                className="accent-orange"
              />
              <span className="text-gray-800">{option.label}</span>
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
