// src/components/sections/painelAdmin/ConfiguracoesAdminTab.js
'use client';

import { useState } from "react";
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";

export function ConfiguracoesAdminTab() {
  const [clinicName, setClinicName] = useState("EZHealth Clínica Inteligente");
  const [supportEmail, setSupportEmail] = useState("suporte@ezhealth.com");
  const [systemVersion, setSystemVersion] = useState("1.0.2");
  const [apiKeysStatus, setApiKeysStatus] = useState("Ativas"); // Ex: Ativas, Expiradas, Necessitam Renovação

  const handleSaveSystemSettings = () => {
    alert("Configurações do sistema salvas! (Nome: " + clinicName + ", Email Suporte: " + supportEmail + ")");
    // Lógica para salvar no backend
  };

  const handleUpdateSystemVersion = () => {
    alert("Iniciando atualização de sistema para v" + systemVersion + ". (Simulado)");
    // Lógica real de atualização
  };

  const handleManageApiKeys = () => {
    alert("Redirecionar para gerenciamento de chaves de API.");
    // Lógica para gerenciar chaves
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
      <Heading
        as="h2"
        text="Configurações do Sistema"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-3 text-2xl sm:text-3xl"
      />
      <ParagraphBlue className="mb-4 sm:mb-6 text-sm sm:text-base">
        Atualize informações gerais da plataforma e configure aspectos do sistema.
      </ParagraphBlue>

      <div className="space-y-6 sm:space-y-8">
        {/* Informações Gerais */}
        <section>
          <h3 className="text-lg sm:text-xl font-semibold text-blue-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Informações Gerais</h3>
          <form className="space-y-4">
            <div>
              <label htmlFor="clinicName" className="block text-sm sm:text-base font-medium text-DarkBlue dark:text-white mb-1">Nome da Clínica/Plataforma</label>
              <input
                type="text"
                id="clinicName"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 text-DarkBlue dark:text-white focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="supportEmail" className="block text-sm sm:text-base font-medium text-DarkBlue dark:text-white mb-1">E-mail de Suporte</label>
              <input
                type="email"
                id="supportEmail"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 text-DarkBlue dark:text-white focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
              />
            </div>
            <ButtonPrimary type="submit" onClick={handleSaveSystemSettings} className="w-full sm:w-auto">
              Salvar Informações Gerais
            </ButtonPrimary>
          </form>
        </section>

        {/* Gerenciamento de Versão do Sistema */}
        <section>
          <h3 className="text-lg sm:text-xl font-semibold text-blue-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Gerenciamento de Versão</h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <div className="mb-2 sm:mb-0">
                <p className="text-sm sm:text-base font-medium text-DarkBlue dark:text-white">Versão Atual do Sistema: <span className="font-bold">{systemVersion}</span></p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Verifique se há atualizações disponíveis.</p>
              </div>
              <ButtonPrimary onClick={handleUpdateSystemVersion} className="text-xs sm:text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                Verificar e Atualizar
              </ButtonPrimary>
            </div>
          </div>
        </section>

        {/* Configurações de API e Integrações */}
        <section>
          <h3 className="text-lg sm:text-xl font-semibold text-blue-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">APIs e Integrações</h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <div className="mb-2 sm:mb-0">
                <p className="text-sm sm:text-base font-medium text-DarkBlue dark:text-white">Status das Chaves de API: <span className={`font-bold ${apiKeysStatus === 'Ativas' ? 'text-green-600' : 'text-red-600'}`}>{apiKeysStatus}</span></p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Gerencie chaves para serviços como Dialogflow, SMS, etc.</p>
              </div>
              <ButtonPrimary onClick={handleManageApiKeys} className="text-xs sm:text-sm px-3 py-1 w-full sm:w-auto">
                Gerenciar Chaves
              </ButtonPrimary>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}