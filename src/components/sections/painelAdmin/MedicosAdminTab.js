// src/components/sections/painelAdmin/MedicosAdminTab.js
'use client';

import { useState } from "react";
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";

export function MedicosAdminTab() {
  const [medicos, setMedicos] = useState([
    { id: 1, nome: "Dr. João Silva", especialidade: "Cardiologista", email: "joao@ezhealth.com", status: "Ativo" },
    { id: 2, nome: "Dra. Maria Oliveira", especialidade: "Pediatra", email: "maria@ezhealth.com", status: "Ativo" },
    { id: 3, nome: "Dr. Pedro Costa", especialidade: "Clínico Geral", email: "pedro@ezhealth.com", status: "Inativo" },
  ]);

  const handleAddMedico = () => {
    alert("Abrir formulário para adicionar novo médico.");
    // Lógica para adicionar médico
  };

  const handleEditMedico = (id) => {
    alert(`Editar médico ID: ${id}`);
    // Lógica para editar médico
  };

  const handleRemoveMedico = (id) => {
    if (window.confirm(`Tem certeza que deseja remover o médico ID: ${id}?`)) {
      setMedicos(medicos.filter(med => med.id !== id));
      alert("Médico removido!");
      // Lógica para remover médico no backend
    }
  };

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

      {medicos.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Especialidade
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-3 py-2 sm:px-6 sm:py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-white/10 divide-y divide-gray-200 dark:divide-gray-700">
              {medicos.map((med) => (
                <tr key={med.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-DarkBlue dark:text-white">
                    {med.nome}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {med.especialidade}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {med.email}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      med.status === 'Ativo' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' :
                      'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                    }`}>
                      {med.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditMedico(med.id)}
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
        <p className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">Nenhum médico cadastrado.</p>
      )}
    </div>
  );
}