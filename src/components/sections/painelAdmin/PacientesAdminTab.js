// components/tabs/PacientesAdminTab.jsx (VERSÃO REATORADA)
'use client';

import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";

// --- Sub-componentes de Modal (reutilizados) ---
function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-600 bg-opacity-50 flex items-center justify-center z-[51] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
        <h3 className="text-xl font-bold mb-4 text-orange-500">{title}</h3>
        <p className="mb-6 text-slate-700 dark:text-slate-300">{message}</p>
        <div className="flex justify-center gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancelar</button>
          <ButtonPrimary onClick={onConfirm}>Confirmar</ButtonPrimary>
        </div>
      </div>
    </div>
  );
}

function AlertDialog({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-600 bg-opacity-50 flex items-center justify-center z-[51] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
        <h3 className="text-xl font-bold mb-4 text-orange-500">{title}</h3>
        <p className="mb-6 text-slate-700 dark:text-slate-300">{message}</p>
        <div className="flex justify-center">
          <ButtonPrimary onClick={onClose}>Entendido</ButtonPrimary>
        </div>
      </div>
    </div>
  );
}

// --- Sub-componente Modal com Formulário de Paciente ---
function PatientFormModal({ isOpen, onClose, onSave, pacienteToEdit }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  useEffect(() => {
    if (isOpen) {
        // Se estiver editando, pré-preenche o formulário. Senão, reseta para valores padrão.
        if (pacienteToEdit) {
            reset({
                ...pacienteToEdit,
                // Formata a data para o input type="date"
                dataNascimento: pacienteToEdit.dataNascimento ? new Date(pacienteToEdit.dataNascimento).toISOString().split('T')[0] : ''
            });
        } else {
            reset({ nome: '', cpf: '', dataNascimento: '', telefone: '', sexo: '', temConvenio: false });
        }
    }
  }, [isOpen, pacienteToEdit, reset]);

  const onSubmit = (data) => {
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-orange-500 text-center">{pacienteToEdit ? "Editar Paciente" : "Adicionar Novo Paciente"}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Campos do formulário */}
            <div>
                <label htmlFor="nome" className="block text-sm font-medium">Nome Completo</label>
                <input id="nome" type="text" {...register("nome", { required: "Nome é obrigatório" })} className="mt-1 block w-full input-style p-1 text-black" />
                {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
            </div>
            <div>
                <label htmlFor="cpf" className="block text-sm font-medium">CPF</label>
                <input id="cpf" type="text" {...register("cpf", { required: "CPF é obrigatório" })} className="mt-1 block w-full input-style p-1 text-black" />
                {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf.message}</p>}
            </div>
            <div>
                <label htmlFor="dataNascimento" className="block text-sm font-medium">Data de Nascimento</label>
                <input id="dataNascimento" type="date" {...register("dataNascimento")} className="mt-1 block w-full input-style p-1 text-black" />
            </div>
            {/* Botões de ação */}
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancelar</button>
                <ButtonPrimary type="submit">{pacienteToEdit ? "Salvar Alterações" : "Adicionar Paciente"}</ButtonPrimary>
            </div>
        </form>
      </div>
    </div>
  );
}


// --- Componente Principal ---
export function PacientesAdminTab() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pacienteToEdit, setPacienteToEdit] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmTitle, setConfirmTitle] = useState('');

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');

  const fetchPacientes = async () => {
    try {
      setLoading(true);
      // ✅ MUDANÇA: Buscando da API de pacientes
      const resp = await fetch("/api/patients");
      const result = await resp.json();
      if (!result.success) throw new Error(result.message);
      setPacientes(result.data);
    } catch (err) {
      setError("Não foi possível carregar os pacientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleSavePaciente = async (pacienteData) => {
    try {
      const isEditing = !!pacienteToEdit;
      const url = isEditing ? `/api/patients?id=${pacienteToEdit._id}` : '/api/patients';
      const method = isEditing ? 'PUT' : 'POST';

      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pacienteData),
      });

      const result = await resp.json();
      if (!resp.ok || !result.success) throw new Error(result.message || "Erro desconhecido.");

      setAlertTitle("Sucesso!");
      setAlertMessage(`Paciente ${isEditing ? 'atualizado' : 'adicionado'} com sucesso!`);
      setIsAlertDialogOpen(true);
      fetchPacientes(); // Re-busca a lista para garantir consistência
    } catch (err) {
      setAlertTitle("Erro!");
      setAlertMessage("Não foi possível salvar o paciente: " + err.message);
      setIsAlertDialogOpen(true);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleRemovePaciente = (id) => {
    setConfirmTitle("Confirmar Exclusão");
    setConfirmMessage("Tem certeza que deseja remover este paciente? Esta ação não pode ser desfeita.");
    setConfirmAction(() => async () => {
      try {
        const resp = await fetch(`/api/patients?id=${id}`, { method: "DELETE" });
        const result = await resp.json();
        if (!resp.ok || !result.success) throw new Error(result.message);
        setAlertTitle("Sucesso!");
        setAlertMessage("Paciente removido com sucesso!");
        setIsAlertDialogOpen(true);
        fetchPacientes();
      } catch (err) {
        setAlertTitle("Erro!");
        setAlertMessage("Não foi possível remover o paciente: " + err.message);
        setIsAlertDialogOpen(true);
      } finally {
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };
  
  return (
    <div className="p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
      <Heading as="h2" text="Gerenciar Pacientes" colorClass="dark:text-orangeDark text-orange" className="mb-3" />
      <ParagraphBlue className="mb-6">Adicione, edite ou remova os registros de pacientes do sistema.</ParagraphBlue>

      <div className="mb-6 text-right">
        <ButtonPrimary onClick={() => { setPacienteToEdit(null); setIsModalOpen(true); }}>+ Adicionar Paciente</ButtonPrimary>
      </div>

      {loading ? <p className="text-center py-8">Carregando...</p> : 
       error ? <p className="text-center py-8 text-red-500">{error}</p> : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">CPF</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Data de Cadastro</th>
                <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-white/10 divide-y divide-slate-200 dark:divide-slate-700">
              {pacientes.map((paciente) => (
                <tr key={paciente._id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{paciente.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{paciente.cpf}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{new Date(paciente.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => { setPacienteToEdit(paciente); setIsModalOpen(true); }} className="text-blue-600 hover:underline mr-4">Editar</button>
                    <button onClick={() => handleRemovePaciente(paciente._id)} className="text-red-600 hover:underline">Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Renderização dos Modais */}
      <PatientFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSavePaciente} pacienteToEdit={pacienteToEdit} />
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={confirmAction} title={confirmTitle} message={confirmMessage} />
      <AlertDialog isOpen={isAlertDialogOpen} onClose={() => setIsAlertDialogOpen(false)} title={alertTitle} message={alertMessage} />
    </div>
  );
}
