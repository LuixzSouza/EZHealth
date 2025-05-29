'use client';

import { useForm } from 'react-hook-form';

export function T_07_MedicalHistory({ onNext }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
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
    <section className="pt-8 flex items-center justify-center w-full bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/10 shadow-xl rounded-2xl p-8 flex flex-col gap-6 w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-orange text-center mb-4">
          Histórico Médico
        </h2>

        <p className="text-blue-800 dark:text-white text-sm text-center mb-2">
          Alguma das condições abaixo se aplica a você?
        </p>

        <div className="flex flex-col gap-2">
          {historyOptions.map((item) => (
            <label key={item.name} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                {...register(`historico.${item.name}`)}
                className="accent-orange"
              />
              <span className="text-gray-800">{item.label}</span>
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
