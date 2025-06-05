'use client';

import { useState, useEffect } from "react";
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";
import Image from "next/image";

// Avatar padrão caso não haja foto
const AVATAR_DEFAULT = "/icons/medico-avatar.svg";

export function MedicosAdminTab() {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [medicoToEdit, setMedicoToEdit] = useState(null); // Estado para guardar os dados do médico a ser editado

  // --- Funções de gerenciamento de estado e requisições ---

  // Busca a lista de médicos ao montar o componente
  useEffect(() => {
    async function fetchMedicos() {
      try {
        setLoading(true);
        setError(null);
        const resp = await fetch("https://ezhealthluixz.netlify.app/api/medicos");
        if (!resp.ok) {
          throw new Error(`Erro HTTP! status: ${resp.status}`);
        }
        const data = await resp.json();
        setMedicos(data);
      } catch (err) {
        console.error("Erro ao buscar médicos:", err);
        setError("Não foi possível carregar os médicos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }
    fetchMedicos();
  }, []); // O array vazio assegura que o useEffect roda apenas uma vez (ao montar)

  const handleAddMedico = () => {
    setMedicoToEdit(null); // Garante que não há médico para edição ao adicionar um novo
    setIsModalOpen(true);
  };

  const handleEditMedico = (medico) => {
    setMedicoToEdit(medico); // Define o médico a ser editado
    setIsModalOpen(true);
  };

  const handleSaveMedico = async (medicoData) => {
    try {
      let resp;
      if (medicoToEdit) { // Editando um médico existente
        resp = await fetch(`https://ezhealthluixz.netlify.app/api/medicos`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: medicoToEdit.id, ...medicoData }),
        });
      } else { // Adicionando um novo médico
        resp = await fetch("https://ezhealthluixz.netlify.app/api/medicos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(medicoData),
        });
      }

      if (!resp.ok) {
        throw new Error(`Erro HTTP! status: ${resp.status}`);
      }

      // Re-busca a lista completa para garantir que a UI está atualizada
      const updatedMedicosList = await fetch("https://ezhealthluixz.netlify.app/api/medicos").then(res => res.json());
      setMedicos(updatedMedicosList);
      alert(medicoToEdit ? "Médico atualizado com sucesso!" : "Médico adicionado com sucesso!");

    } catch (err) {
      console.error("Erro ao salvar médico:", err);
      alert("Não foi possível salvar o médico.");
    } finally {
      setIsModalOpen(false); // Fecha o modal
      setMedicoToEdit(null); // Limpa o médico que estava sendo editado
    }
  };

  const handleRemoveMedico = async (id) => {
    if (!confirm("Tem certeza que deseja remover este médico?")) return;
    try {
      const resp = await fetch(`https://ezhealthluixz.netlify.app/api/medicos?id=${id}`, {
        method: "DELETE"
      });
      if (!resp.ok) {
        throw new Error(`Status: ${resp.status}`);
      }
      // Remove localmente da tabela
      setMedicos(prev => prev.filter(m => m.id !== id));
      alert("Médico removido com sucesso!");
    } catch (err) {
      console.error("Erro ao remover médico:", err);
      alert("Não foi possível remover o médico.");
    }
  };

  // --- Sub-componente Modal (definido internamente) ---
  // Este componente do modal só será renderizado se `isModalOpen` for true.
  function MedicoFormModal({ isOpen, onClose, onSave, medicoToEdit }) {
    const [nome, setNome] = useState(medicoToEdit?.nome || '');
    const [especialidade, setEspecialidade] = useState(medicoToEdit?.especialidade || '');
    const [email, setEmail] = useState(medicoToEdit?.email || '');
    const [status, setStatus] = useState(medicoToEdit?.status || 'Ativo'); // Status padrão
    const [foto, setFoto] = useState(medicoToEdit?.foto || '');

    // Resetar o estado do formulário quando o modal for aberto para um novo médico ou um diferente para edição
    useEffect(() => {
        if (isOpen) {
          setNome(medicoToEdit?.nome || '');
          setEspecialidade(medicoToEdit?.especialidade || '');
          setEmail(medicoToEdit?.email || '');
          setStatus(medicoToEdit?.status || 'Ativo');
          setFoto(medicoToEdit?.foto || '');
        }
    }, [isOpen, medicoToEdit]); // Dependências do useEffect

    const handleSubmit = async (e) => {
      e.preventDefault();
      const medicoPayload = { nome, especialidade, email, status, foto: foto || null };
      await onSave(medicoPayload);
      // onClose() é chamado dentro de onSave, após o sucesso da requisição
    };

    if (!isOpen) return null; // Não renderiza nada se o modal não estiver aberto

    return (
      <div className="fixed inset-0 bg-slate-600 bg-opacity-50 flex items-center justify-center z-[] p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
          <Heading
            as="h3"
            text={medicoToEdit ? "Editar Médico" : "Adicionar Novo Médico"}
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
              <label htmlFor="especialidade" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Especialidade</label>
              <input
                type="text"
                id="especialidade"
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
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
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="foto" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL da Foto (opcional)</label>
              <input
                type="url"
                id="foto"
                value={foto}
                onChange={(e) => setFoto(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                placeholder="Ex: https://example.com/foto.jpg"
              />
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
                {medicoToEdit ? "Salvar Alterações" : "Adicionar Médico"}
              </ButtonPrimary>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- Renderização do componente principal ---
  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
      <Heading
        as="h2"
        text="Gerenciar Médicos"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-3 text-2xl sm:text-3xl"
      />
      <ParagraphBlue className="mb-4 sm:mb-6 text-sm sm:text-base">
        Visualize, adicione, edite ou remova profissionais médicos da plataforma.
      </ParagraphBlue>

      <div className="mb-4 sm:mb-6 text-right">
        <ButtonPrimary onClick={handleAddMedico} className="w-full sm:w-auto">
          + Adicionar Médico
        </ButtonPrimary>
      </div>

      {loading ? (
        <p className="text-slate-500 dark:text-slate-400 text-center py-6 sm:py-8">
          Carregando médicos...
        </p>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400 text-center py-6 sm:py-8">
          {error}
        </p>
      ) : medicos.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Médico
                </th>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Especialidade
                </th>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="relative px-3 py-2 sm:px-6 sm:py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-white/10 divide-y divide-slate-200 dark:divide-slate-700">
              {medicos.map((med) => (
                <tr
                  key={med.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm flex items-center gap-2">
                    <div className="w-8 h-8 relative">
                      <Image
                        src={med.foto || AVATAR_DEFAULT}
                        alt={med.nome}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-DarkBlue dark:text-white">
                      {med.nome}
                    </span>
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                    {med.especialidade}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                    {med.email}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        med.status === 'Ativo'
                          ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                          : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                      }`}
                    >
                      {med.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditMedico(med)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 underline mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleRemoveMedico(med.id)}
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
        <p className="text-slate-500 dark:text-slate-400 text-center py-6 sm:py-8">
          Nenhum médico cadastrado.
        </p>
      )}

      {/* Renderiza o modal internamente */}
      <MedicoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMedico}
        medicoToEdit={medicoToEdit}
      />
    </div>
  );
}

// O código da API (pages/api/medicos.js) permanece o mesmo,
// pois ele já está preparado para receber as requisições POST e PUT.