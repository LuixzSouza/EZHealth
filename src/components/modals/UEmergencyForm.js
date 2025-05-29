import { useForm } from "react-hook-form";
import { UrgentConfirmationModal } from "./UrgentConfirmationModal";
import { useState } from "react";

export function UEmergencyForm({ onNext }) {
  const { register, handleSubmit, watch } = useForm();
  const [showModal, setShowModal] = useState(false);

  const urgentWatch = watch('urgencia', {});

  const onSubmit = (data) => {
    const selecionouUrgencia = Object.entries(data.urgencia || {}).some(
      ([key, value]) => value && key !== 'nenhuma'
    );

    if (selecionouUrgencia) {
      setShowModal(true);
    } else {
      onNext(data); // seguir normalmente
    }
  };

  const handleConfirmUrgencia = () => {
    setShowModal(false);
    onNext({ urgencia: urgentWatch });
  };

  const handleCancelUrgencia = () => {
    setShowModal(false);
  };

  const urgencias = [
    { name: 'respirar', label: 'Dificuldade para respirar' },
    { name: 'dor_peito', label: 'Dor intensa no peito' },
    { name: 'desmaio', label: 'Desmaios ou convulsões' },
    { name: 'sangramento', label: 'Hemorragia' },
    { name: 'consciencia', label: 'Alteração de consciência' },
    { name: 'nenhuma', label: 'Nenhuma das anteriores' },
  ];

  return (
    <section className="pt-8 flex items-center justify-center w-full bg-gray-50 px-4 relative">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/10 shadow-xl rounded-2xl p-8 flex flex-col gap-6 w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-orange text-center mb-4">
          Triagem de Urgência
        </h2>

        <p className="text-blue-800 dark:text-white text-sm text-center mb-2">
          Alguma das situações abaixo está ocorrendo agora?
        </p>

        <div className="flex flex-col gap-2">
          {urgencias.map((item) => (
            <label key={item.name} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                {...register(`urgencia.${item.name}`)}
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

      {showModal && (
        <UrgentConfirmationModal
          onConfirm={handleConfirmUrgencia}
          onCancel={handleCancelUrgencia}
        />
      )}
    </section>
  );
}
