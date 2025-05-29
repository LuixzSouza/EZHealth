'use client';

import { useForm } from 'react-hook-form';

export function T_05_SymptomsDirector({ onNext }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (vals) => {
    onNext(vals);
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
    <section className="pt-8 flex items-center justify-center w-full bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/10 shadow-xl rounded-2xl p-8 flex flex-col gap-6 w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-orange text-center mb-4">
          Queixa Principal
        </h2>

        <p className="text-blue-800 dark:text-white text-sm text-center">
          Descreva com suas palavras ou selecione uma ou mais opções abaixo:
        </p>

        <div className="flex flex-col gap-2">
          {symptomOptions.map((symptom) => (
            <label key={symptom.name} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                {...register(`sintomas.${symptom.name}`)}
                className="accent-orange"
              />
              <span className="text-gray-800">{symptom.label}</span>
            </label>
          ))}

          {/* Campo "Outros" */}
          <div className="mt-4">
            <label htmlFor="sintomas.outros" className="block text-gray-800 font-semibold mb-1">
              Outros sintomas:
            </label>
            <input
              type="text"
              id="sintomas.outros"
              {...register('sintomas.outros')}
              placeholder="Descreva aqui..."
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange text-black"
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
