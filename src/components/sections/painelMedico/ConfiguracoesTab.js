'use client';

import { useState, useEffect } from "react";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { Heading } from "@/components/typography/Heading";
import { DarkTheme } from "@/components/theme/DarkTheme"; // Seu componente DarkTheme para o toggle
import { useRouter } from "next/navigation"; // Para navegação, se necessário
import { EditProfileForm } from "./configuracoes/EditProfileForm";
import { ChangePasswordForm } from "./configuracoes/ChangePasswordForm";

// Importe os novos componentes que você criou

export function ConfiguracoesTab() {
  const router = useRouter(); // Inicializa o useRouter

  // NOVO ESTADO para gerenciar a visualização das seções de Conta e Segurança
  // Pode ser 'main' (configurações principais), 'edit-profile' ou 'change-password'
  const [activeSecurityAction, setActiveSecurityAction] = useState('main');

  // Estados para as configurações gerais (mantidos do seu código)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      return storedTheme === 'dark' || (storedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [receiveAppNotifications, setReceiveAppNotifications] = useState(true);
  const [receiveEmailNotifications, setReceiveEmailNotifications] = useState(true);
  const [receiveSmsNotifications, setReceiveSmsNotifications] = useState(false);
  const [language, setLanguage] = useState('pt-BR');
  const [anonymizeUsageData, setAnonymizeUsageData] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);

  // Efeito para aplicar ou remover a classe 'high-contrast-mode' ao <html>
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (highContrastMode) {
        document.documentElement.classList.add('high-contrast-mode');
      } else {
        document.documentElement.classList.remove('high-contrast-mode');
      }
    }
  }, [highContrastMode]);

  // Funções de exemplo para manipular as configurações (mantidas)
  const toggleAppNotifications = () => { setReceiveAppNotifications(prev => !prev); };
  const toggleEmailNotifications = () => { setReceiveEmailNotifications(prev => !prev); };
  const toggleSmsNotifications = () => { setReceiveSmsNotifications(prev => !prev); };
  const handleLanguageChange = (e) => { setLanguage(e.target.value); };
  const toggleAnonymizeUsageData = () => { setAnonymizeUsageData(prev => !prev); };
  const toggleHighContrastMode = () => { setHighContrastMode(prev => !prev); };

  const handleClearChatbotHistory = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico do chatbot? Esta ação não pode ser desfeita.')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ezhealth_chat_messages');
        localStorage.removeItem('ezhealth_session_id');
        alert('Histórico do chatbot limpo com sucesso!');
      }
    }
  };

  // Funções para mudar o estado e exibir o formulário correto
  const handleEditProfileClick = () => {
    setActiveSecurityAction('edit-profile');
  };

  const handleChangePasswordClick = () => {
    setActiveSecurityAction('change-password');
  };

  // Função para retornar à tela principal de configurações
  const handleBackToMainSettings = () => {
    setActiveSecurityAction('main');
  };

  const handleSaveSettings = async () => {
    const settingsToSave = {
      isDarkMode,
      receiveAppNotifications,
      receiveEmailNotifications,
      receiveSmsNotifications,
      language,
      anonymizeUsageData,
      highContrastMode,
    };

    try {
      const response = await fetch('/api/user-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsToSave),
      });

      if (response.ok) {
        alert("Configurações salvas com sucesso no backend!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar configurações no backend.');
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      alert(`Erro ao salvar configurações: ${error.message}`);
    }
  };

  // Helper para o toggle switch (mantido)
  const CustomToggleSwitch = ({ id, checked, onChange }) => (
    <>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div
        onClick={onChange}
        className="relative w-14 h-8 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-neutral-300 after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-neutral-600 peer-checked:bg-orange-600 cursor-pointer"
      ></div>
    </>
  );

  // --- Renderização Condicional ---
  // Se activeSecurityAction for 'edit-profile', renderiza EditProfileForm
  if (activeSecurityAction === 'edit-profile') {
    return <EditProfileForm onBack={handleBackToMainSettings} />;
  }

  // Se activeSecurityAction for 'change-password', renderiza ChangePasswordForm
  if (activeSecurityAction === 'change-password') {
    return <ChangePasswordForm onBack={handleBackToMainSettings} />;
  }

  // Por padrão, ou se activeSecurityAction for 'main', renderiza a tela principal de configurações
  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
      <Heading
        as="h2"
        text="Configurações"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-3 text-2xl sm:text-3xl"
      />
      <ParagraphBlue className="mb-4 sm:mb-6 text-sm sm:text-base">Personalize seu painel e preferências.</ParagraphBlue>

      <div className="space-y-6 sm:space-y-8">

        {/* Seção de Aparência */}
        <section>
          <h3 className="text-lg sm:text-xl font-semibold text-blue-900 dark:text-white mb-4 border-b pb-2 border-neutral-200 dark:border-neutral-700">Aparência</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 border border-neutral-200 dark:border-neutral-700 rounded-md">
              <label htmlFor="darkModeToggle" className="text-sm sm:text-base font-medium text-blue-800 dark:text-white">Modo Escuro</label>
              <DarkTheme />
            </div>

            <div className="flex items-center justify-between p-3 sm:p-4 border border-neutral-200 dark:border-neutral-700 rounded-md">
              <label htmlFor="highContrastToggle" className="text-sm sm:text-base font-medium text-blue-800 dark:text-white">Modo de Alto Contraste</label>
              <CustomToggleSwitch id="highContrastToggle" checked={highContrastMode} onChange={toggleHighContrastMode} />
            </div>
          </div>
        </section>

        {/* Seção de Notificações */}
        <section>
          <h3 className="text-lg sm:text-xl font-semibold text-blue-900 dark:text-white mb-4 border-b pb-2 border-neutral-200 dark:border-neutral-700">Notificações</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 border border-neutral-200 dark:border-neutral-700 rounded-md">
              <label htmlFor="appNotificationsToggle" className="text-sm sm:text-base font-medium text-blue-800 dark:text-white">Notificações no Aplicativo</label>
              <CustomToggleSwitch id="appNotificationsToggle" checked={receiveAppNotifications} onChange={toggleAppNotifications} />
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 border border-neutral-200 dark:border-neutral-700 rounded-md">
              <label htmlFor="emailNotificationsToggle" className="text-sm sm:text-base font-medium text-blue-800 dark:text-white">Receber Notificações por Email</label>
              <CustomToggleSwitch id="emailNotificationsToggle" checked={receiveEmailNotifications} onChange={toggleEmailNotifications} />
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 border border-neutral-200 dark:border-neutral-700 rounded-md">
              <label htmlFor="smsNotificationsToggle" className="text-sm sm:text-base font-medium text-blue-800 dark:text-white">Receber Notificações por SMS</label>
              <CustomToggleSwitch id="smsNotificationsToggle" checked={receiveSmsNotifications} onChange={toggleSmsNotifications} />
            </div>
          </div>
        </section>

        {/* Seção de Preferências Gerais */}
        <section>
          <h3 className="text-lg sm:text-xl font-semibold text-blue-900 dark:text-white mb-4 border-b pb-2 border-neutral-200 dark:border-neutral-700">Preferências Gerais</h3>
          <div className="space-y-4">
            <div className="p-3 sm:p-4 border border-neutral-200 dark:border-neutral-700 rounded-md">
              <label htmlFor="languageSelect" className="block text-sm sm:text-base font-medium mb-2 text-blue-800 dark:text-white">Idioma</label>
              <select
                id="languageSelect"
                value={language}
                onChange={handleLanguageChange}
                className="w-full p-2 rounded-md border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-blue-900 dark:text-neutral-100 focus:outline-none focus:border-orange-500 text-sm sm:text-base"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español (ES)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 sm:p-4 border border-neutral-200 dark:border-neutral-700 rounded-md">
              <label htmlFor="anonymizeDataToggle" className="text-sm sm:text-base font-medium text-blue-800 dark:text-white">Anonimizar Dados de Uso</label>
              <CustomToggleSwitch id="anonymizeDataToggle" checked={anonymizeUsageData} onChange={toggleAnonymizeUsageData} />
            </div>

            <div className="flex items-center justify-between p-3 sm:p-4 border border-neutral-200 dark:border-neutral-700 rounded-md">
              <label className="text-sm sm:text-base font-medium text-blue-800 dark:text-white">Histórico do Chatbot</label>
              <ButtonPrimary onClick={handleClearChatbotHistory} className="text-xs sm:text-sm px-3 py-1 bg-red-600 hover:bg-red-700 w-auto">
                Limpar Histórico
              </ButtonPrimary>
            </div>
          </div>
        </section>

        {/* Seção de Conta e Segurança */}
        <section>
          <h3 className="text-lg sm:text-xl font-semibold text-blue-900 dark:text-white mb-4 border-b pb-2 border-neutral-200 dark:border-neutral-700">Conta e Segurança</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 border border-neutral-200 dark:border-neutral-700 rounded-md">
              <label className="text-sm sm:text-base font-medium text-blue-800 dark:text-white">Gerenciar Perfil</label>
              <ButtonPrimary onClick={handleEditProfileClick} className="text-xs sm:text-sm px-3 py-1 w-auto">
                Editar Perfil
              </ButtonPrimary>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 border border-neutral-200 dark:border-neutral-700 rounded-md">
              <label className="text-sm sm:text-base font-medium text-blue-800 dark:text-white">Segurança</label>
              <ButtonPrimary onClick={handleChangePasswordClick} className="text-xs sm:text-sm px-3 py-1 w-auto">
                Alterar Senha
              </ButtonPrimary>
            </div>
          </div>
        </section>

      </div>

      <div className="mt-8 sm:mt-10 text-center">
        <ButtonPrimary onClick={handleSaveSettings} className="w-full sm:w-auto">
          Salvar Configurações
        </ButtonPrimary>
      </div>
    </div>
  );
}

// O componente StatCard não é usado aqui, mas foi mantido do seu código anterior.
// Se não for usado em outro lugar, pode ser removido.
function StatCard({ label, value }) {
  return (
    <div className="bg-blue-100 text-blue-900 dark:bg-white/10 dark:text-themeTextDark rounded-xl p-3 sm:p-4 text-center shadow">
      <div className="text-2xl sm:text-3xl font-bold">{value}</div>
      <div className="text-xs sm:text-sm mt-1">{label}</div>
    </div>
  );
}