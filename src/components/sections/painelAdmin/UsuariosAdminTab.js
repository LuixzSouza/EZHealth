// src/components/sections/painelAdmin/UsuariosAdminTab.js
'use client';

import { useState } from "react";
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";

export function UsuariosAdminTab() {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nome: "Maria Ferreira", email: "maria@ezhealth.com", funcao: "Secretária", status: "Ativo" },
    { id: 2, nome: "Carlos Viana", email: "carlos@ezhealth.com", funcao: "Administrador", status: "Ativo" },
    { id: 3, nome: "Ana Paula", email: "ana@ezhealth.com", funcao: "Atendente", status: "Inativo" },
  ]);

  const handleAddUsuario = () => {
    alert("Abrir formulário para adicionar novo usuário.");
    // Lógica para adicionar usuário
  };

  const handleEditUsuario = (id) => {
    alert(`Editar usuário ID: ${id}`);
    // Lógica para editar usuário
  };

  const handleRemoveUsuario = (id) => {
    if (window.confirm(`Tem certeza que deseja remover o usuário ID: ${id}?`)) {
      setUsuarios(usuarios.filter(user => user.id !== id));
      alert("Usuário removido!");
      // Lógica para remover usuário no backend
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
      <Heading
        as="h2"
        text="Gerenciar Usuários"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-3 text-2xl sm:text-3xl"
      />
      <ParagraphBlue className="mb-4 sm:mb-6 text-sm sm:text-base">
        Adicione ou modifique permissões de acesso de outros usuários do sistema.
      </ParagraphBlue>

      <div className="mb-4 sm:mb-6 text-right">
        <ButtonPrimary onClick={handleAddUsuario} className="w-full sm:w-auto">
          + Adicionar Usuário
        </ButtonPrimary>
      </div>

      {usuarios.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  E-mail
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Função
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
              {usuarios.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-DarkBlue dark:text-white">
                    {user.nome}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {user.funcao}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'Ativo' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' :
                      'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditUsuario(user.id)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 underline mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleRemoveUsuario(user.id)}
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
        <p className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">Nenhum usuário cadastrado.</p>
      )}
    </div>
  );
}