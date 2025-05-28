'use client';

import { useForm } from 'react-hook-form';

export function TSymptomsForm({ onNext }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (vals) => {
    onNext(vals);
  };

  const symptoms = [
    { name: 'febre', label: 'Está com febre?' },
    { name: 'doresCorpo', label: 'Dores no corpo?' },
    { name: 'indisposicao', label: 'Está com indisposição?' },
    { name: 'azia', label: 'Está com azia?' },
    { name: 'apetite', label: 'Perda de apetite?' }
  ];

  return (
    <section className="pt-32 flex items-center justify-center w-full min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-6 w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-orange text-center mb-4">
          Perguntas Rápidas
        </h2>

        {symptoms.map((symptom) => (
          <div key={symptom.name} className="flex flex-col">
            <label htmlFor={symptom.name} className="font-semibold text-gray-700 mb-1">
              {symptom.label}
            </label>
            <select
              id={symptom.name}
              {...register(symptom.name)}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange"
              defaultValue=""
              required
            >
              <option value="" disabled>Escolha...</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>
        ))}

        <button
          type="submit"
          className="mt-4 bg-orange text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition"
        >
          Próximo
        </button>
      </form>
    </section>
  );
}
