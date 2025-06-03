// src/components/sections/painelAdmin/UsuariosAdminTab.js
'use client';

import { useState, useEffect } from "react";
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";

export function UsuariosAdminTab() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pacienteToEdit, setPacienteToEdit] = useState(null); // State for patient to edit

  // --- Fetching Patient Data ---
  useEffect(() => {
    async function fetchPacientes() {
      try {
        setLoading(true);
        setError(null);
        // Assuming your API for triage data is at /api/triagem
        const resp = await fetch("http://localhost:3000/api/triagem");
        if (!resp.ok) {
          throw new Error(`HTTP Error! status: ${resp.status}`);
        }
        const data = await resp.json();
        // Extract patient data from triage records based on your provided structure
        const extractedPatients = data.map(triage => ({
          id: triage._id, // Use _id from triage as patient ID
          nome: triage.dadosPessoalPaciente?.nome || "N/A", // Corrected: using 'nome' field
          // No 'email' field in your provided data, defaulting to 'N/A'
          email: triage.dadosPessoalPaciente?.cpf ? `${triage.dadosPessoalPaciente.cpf}@ezhealth.com` : "N/A", // Using CPF to simulate an email, or N/A
          // The role 'Paciente' is a fixed value as it's not in your triage data
          funcao: "Paciente",
          status: triage.atendimentoInfo?.status || "Pendente", // Assuming a status from atendimentoInfo
        }));
        setPacientes(extractedPatients);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Could not load patients. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchPacientes();
  }, []);

  // --- Handlers for CRUD operations ---

  const handleAddPaciente = () => {
    setPacienteToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditPaciente = (paciente) => {
    setPacienteToEdit(paciente);
    setIsModalOpen(true);
  };

  const handleSavePaciente = async (pacienteData) => {
    try {
      let resp;
      // For editing, you might need a specific API endpoint that accepts triage ID
      // This logic assumes you're updating the original triage record
      if (pacienteToEdit) {
        resp = await fetch(`http://localhost:3000/api/triagem`, { // Assuming your PUT endpoint takes ID in body or as query param
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: pacienteToEdit.id, // Pass the triage ID
            // Update fields within dadosPessoalPaciente and atendimentoInfo
            dadosPessoalPaciente: {
              ...pacienteToEdit.dadosPessoalPaciente, // Keep existing fields
              nome: pacienteData.nome,
              // email: pacienteData.email, // No direct email in your structure, adjust if needed
            },
            atendimentoInfo: {
              ...pacienteToEdit.atendimentoInfo, // Keep existing fields
              status: pacienteData.status,
            }
          }),
        });
      } else {
        // For adding a new patient, you're essentially creating a new triage record
        resp = await fetch("http://localhost:3000/api/triagem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Structure this to match what your POST /api/triagem expects for a new triage
            dadosPessoalPaciente: {
              nome: pacienteData.nome,
              // If you want an email, you'll need to decide where it fits in your backend
              // email: pacienteData.email,
              dataNascimento: "", // Add default values for required fields
              idade: "",
              cpf: pacienteData.email.split('@')[0], // Using part of email as CPF placeholder
              telefone: "",
              sexo: null,
              temConvenio: "nao",
            },
            sinaisVitais: {},
            sintomas: {},
            sintomasDetalhes: {},
            historico: {},
            medicamentos: {},
            classificacaoRisco: {},
            atendimentoInfo: {
                status: pacienteData.status || "Pendente",
                // createdAt will be handled by the backend
            }
          }),
        });
      }

      if (!resp.ok) {
        throw new Error(`HTTP Error! status: ${resp.status}`);
      }

      // Re-fetch the list to ensure UI is updated
      const updatedData = await fetch("http://localhost:3000/api/triagem").then(res => res.json());
      const updatedPatientsList = updatedData.map(triage => ({
        id: triage._id,
        nome: triage.dadosPessoalPaciente?.nome || "N/A",
        email: triage.dadosPessoalPaciente?.cpf ? `${triage.dadosPessoalPaciente.cpf}@ezhealth.com` : "N/A", // Re-derive email
        funcao: "Paciente",
        status: triage.atendimentoInfo?.status || "Pendente",
      }));
      setPacientes(updatedPatientsList);
      alert(pacienteToEdit ? "Patient updated successfully!" : "Patient added successfully!");

    } catch (err) {
      console.error("Error saving patient:", err);
      alert("Could not save patient.");
    } finally {
      setIsModalOpen(false);
      setPacienteToEdit(null);
    }
  };

  const handleRemovePaciente = async (id) => {
    if (!confirm("Are you sure you want to remove this patient?")) return;
    try {
      // Assuming your DELETE endpoint takes ID as a query parameter
      const resp = await fetch(`http://localhost:3000/api/triagem?id=${id}`, {
        method: "DELETE"
      });
      if (!resp.ok) {
        throw new Error(`Status: ${resp.status}`);
      }
      setPacientes(prev => prev.filter(p => p.id !== id));
      alert("Patient removed successfully!");
    } catch (err) {
      console.error("Error removing patient:", err);
      alert("Could not remove patient.");
    }
  };

  // --- Modal Component (defined internally) ---
  function PatientFormModal({ isOpen, onClose, onSave, pacienteToEdit }) {
    const [nome, setNome] = useState(pacienteToEdit?.nome || '');
    const [email, setEmail] = useState(pacienteToEdit?.email || ''); // Retained for UX, but actual saving might ignore it
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
      // Only passing 'nome' and 'status' directly to onSave,
      // as 'email' isn't a direct field in your data structure.
      const pacientePayload = { nome, status, email }; // Pass email for backend to parse if needed
      await onSave(pacientePayload);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-slate-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
          <Heading
            as="h3"
            text={pacienteToEdit ? "Editar Paciente" : "Adicionar Novo Paciente"}
            colorClass="dark:text-orangeDark text-orange"
            className="mb-4 text-xl sm:text-2xl"
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

      <PatientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePaciente}
        pacienteToEdit={pacienteToEdit}
      />
    </div>
  );
}