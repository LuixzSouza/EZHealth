export function UrgentConfirmationModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-lg">
        <h3 className="text-2xl font-bold mb-4 text-orange">Solicitar Ajuda Imediata?</h3>
        <p className="mb-6">Você realmente precisa de atendimento prioritário?</p>
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-orange text-white hover:bg-orange-dark"
          >
            Sim, preciso!
          </button>
        </div>
      </div>
    </div>
  );
}