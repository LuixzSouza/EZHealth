'use client';

import { useState, useEffect } from "react";
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";

// --- Sub-componente: Modal de Confirmação ---
function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-600 bg-opacity-50 flex items-center justify-center z-[53] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
        <Heading
          as="h3"
          text={title}
          colorClass="dark:text-orangeDark text-orange"
          className="mb-4 text-xl sm:text-2xl text-center"
        />
        <ParagraphBlue className="mb-6 text-center text-slate-700 dark:text-slate-300">
          {message}
        </ParagraphBlue>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            Cancelar
          </button>
          <ButtonPrimary onClick={onConfirm}>
            Confirmar
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}

// --- Sub-componente: Modal de Alerta/Mensagem ---
function AlertDialog({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-600 bg-opacity-50 flex items-center justify-center z-[54] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
        <Heading
          as="h3"
          text={title}
          colorClass="dark:text-orangeDark text-orange"
          className="mb-4 text-xl sm:text-2xl text-center"
        />
        <ParagraphBlue className="mb-6 text-center text-slate-700 dark:text-slate-300">
          {message}
        </ParagraphBlue>
        <div className="flex justify-center">
          <ButtonPrimary onClick={onClose}>
            Entendido
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}


export function UsuariosAdminTab() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pacienteToEdit, setPacienteToEdit] = useState(null); // State for patient to edit

  // States for custom confirmation/alert modals
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {}); // Function to execute on confirm
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmTitle, setConfirmTitle] = useState('');

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');


  // --- Fetching Patient Data ---
  const fetchPacientes = async () => {
    try {
      setLoading(true);
      setError(null);
      // Using relative path for API calls
      const resp = await fetch("/api/triagem");
      if (!resp.ok) {
        throw new Error(`HTTP Error! status: ${resp.status}`);
      }
      const data = await resp.json();
      // Extract patient data from triage records
      const extractedPatients = data.map(triage => ({
        id: triage._id, // Use _id from triage as patient ID
        nome: triage.dadosPessoalPaciente?.nome || "N/A",
        // Using CPF to simulate an email, or N/A
        email: triage.dadosPessoalPaciente?.cpf ? `${triage.dadosPessoalPaciente.cpf}@ezhealth.com` : "N/A",
        funcao: "Paciente", // Fixed role
        status: triage.atendimentoInfo?.status || "Pendente",
        // Keep original triage data for PUT operation if needed
        originalTriageData: triage
      }));
      setPacientes(extractedPatients);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Não foi possível carregar os pacientes. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  // --- Handlers for CRUD operations ---

  const handleAddPaciente = () => {
    setPacienteToEdit(null); // Ensures no patient data is pre-filled for new entry
    setIsModalOpen(true);
  };

  const handleEditPaciente = (paciente) => {
    setPacienteToEdit(paciente);
    setIsModalOpen(true);
  };

  const handleSavePaciente = async (pacienteData) => {
    try {
      let resp;
      let successMessage = "";

      if (pacienteToEdit) { // Editing an existing patient (triage record)
        resp = await fetch(`/api/triagem`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: pacienteToEdit.id, // Pass the triage ID
            // Only send the fields that can be updated via this interface
            dadosPessoalPaciente: {
              ...pacienteToEdit.originalTriageData.dadosPessoalPaciente, // Preserve existing fields
              nome: pacienteData.nome,
              cpf: pacienteData.email.split('@')[0], // Re-derive CPF from email for backend
            },
            atendimentoInfo: {
              ...pacienteToEdit.originalTriageData.atendimentoInfo, // Preserve existing fields
              status: pacienteData.status,
            }
          }),
        });
        successMessage = "Paciente atualizado com sucesso!";
      } else { // Adding a new patient (creating a new triage record)
        resp = await fetch("/api/triagem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dadosPessoalPaciente: {
              nome: pacienteData.nome,
              dataNascimento: "", // Default/empty for new patients
              idade: "",
              cpf: pacienteData.email.split('@')[0], // Derive CPF from email
              telefone: "",
              sexo: null,
              temConvenio: "nao",
            },
            sinaisVitais: {},
            sintomas: {},
            sintomasDetalhes: {},
            historico: {},
            medicamentos: {},
            classificacaoRisco: {}, // Will be set by backend
            atendimentoInfo: {
                status: pacienteData.status || "Pendente",
            }
          }),
        });
        successMessage = "Paciente adicionado com sucesso!";
      }

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.message || `HTTP Error! Status: ${resp.status}`);
      }

      setAlertTitle("Sucesso!");
      setAlertMessage(successMessage);
      setIsAlertDialogOpen(true);

      fetchPacientes(); // Re-fetch the list to ensure UI is updated
    } catch (err) {
      console.error("Error saving patient:", err);
      setAlertTitle("Erro!");
      setAlertMessage("Não foi possível salvar o paciente: " + err.message);
      setIsAlertDialogOpen(true);
    } finally {
      setIsModalOpen(false); // Close edit/add modal
      setPacienteToEdit(null); // Clear edited patient data
    }
  };

  const handleRemovePaciente = (id) => {
    setConfirmTitle("Confirmar Exclusão");
    setConfirmMessage("Tem certeza que deseja remover este paciente? Esta ação é irreversível.");
    setConfirmAction(() => async () => {
      try {
        const resp = await fetch(`/api/triagem?id=${id}`, {
          method: "DELETE"
        });
        if (!resp.ok) {
          const errorData = await resp.json();
          throw new Error(errorData.message || `Status: ${resp.status}`);
        }

        setAlertTitle("Sucesso!");
        setAlertMessage("Paciente removido com sucesso!");
        setIsAlertDialogOpen(true);

        fetchPacientes(); // Re-fetch the list to update UI
      } catch (err) {
        console.error("Error removing patient:", err);
        setAlertTitle("Erro!");
        setAlertMessage("Não foi possível remover o paciente: " + err.message);
        setIsAlertDialogOpen(true);
      } finally {
        setIsConfirmModalOpen(false); // Close confirmation modal
      }
    });
    setIsConfirmModalOpen(true);
  };

  // --- Modal Component (defined internally) ---
  function PatientFormModal({ isOpen, onClose, onSave, pacienteToEdit }) {
    const [nome, setNome] = useState(pacienteToEdit?.nome || '');
    const [email, setEmail] = useState(pacienteToEdit?.email || ''); // Retained for UX
    const [status, setStatus] = useState(pacienteToEdit?.status || 'Pendente');

    useEffect(() => {
      if (isOpen) {
        setNome(pacienteToEdit?.nome || '');
        setEmail(pacienteToEdit?.email || '');
        setStatus(pacienteToEdit?.status || 'Pendente');
      }
    }, [isOpen, pacienteToEdit]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      // Pass 'email' so backend can potentially derive CPF from it
      await onSave({ nome, status, email });
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-slate-600 bg-opacity-50 flex items-center justify-center z-[52] p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
          <Heading
            as="h3"
            text={pacienteToEdit ? "Editar Paciente" : "Adicionar Novo Paciente"}
            colorClass="dark:text-orangeDark text-orange"
            className="mb-4 text-lg sm:text-lg text-center"
          />
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="nome" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome</label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mail (baseado no CPF)</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                placeholder="Ex: 12345678909@ezhealth.com"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              >
                <option value="Pendente">Pendente</option>
                <option value="Atendido">Atendido</option>
                <option value="Em Atendimento">Em Atendimento</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                Cancelar
              </button>
              <ButtonPrimary type="submit">
                {pacienteToEdit ? "Salvar Alterações" : "Adicionar Paciente"}
              </ButtonPrimary>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- Main Component Rendering ---
  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
      <Heading
        as="h2"
        text="Gerenciar Pacientes"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-3 text-2xl sm:text-3xl"
      />
      <ParagraphBlue className="mb-4 sm:mb-6 text-sm sm:text-base">
        Visualize, adicione, edite ou remova registros de pacientes.
      </ParagraphBlue>

      <div className="mb-4 sm:mb-6 text-right">
        <ButtonPrimary onClick={handleAddPaciente} className="w-full sm:w-auto">
          + Adicionar Paciente
        </ButtonPrimary>
      </div>

      {loading ? (
        <p className="text-slate-500 dark:text-slate-400 text-center py-6 sm:py-8">
          Carregando pacientes...
        </p>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400 text-center py-6 sm:py-8">
          {error}
        </p>
      ) : pacientes.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  E-mail
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Função
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-3 py-2 sm:px-6 sm:py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-white/10 divide-y divide-slate-200 dark:divide-slate-700">
              {pacientes.map((paciente) => (
                <tr key={paciente.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-DarkBlue dark:text-white">
                    {paciente.nome}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                    {paciente.email}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                    {paciente.funcao}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      paciente.status === 'Atendido' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' :
                      paciente.status === 'Em Atendimento' ? 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100' :
                      'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                    }`}>
                      {paciente.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditPaciente(paciente)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 underline mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleRemovePaciente(paciente.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 underline"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-slate-500 dark:text-slate-400 text-center py-6 sm:py-8 text-sm sm:text-base">Nenhum paciente cadastrado.</p>
      )}

      {/* Renderiza o modal de formulário */}
      <PatientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePaciente}
        pacienteToEdit={pacienteToEdit}
      />

      {/* Renderiza o modal de confirmação */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmAction}
        title={confirmTitle}
        message={confirmMessage}
      />

      {/* Renderiza o modal de alerta */}
      <AlertDialog
        isOpen={isAlertDialogOpen}
        onClose={() => setIsAlertDialogOpen(false)}
        title={alertTitle}
        message={alertMessage}
      />
    </div>
  );
}