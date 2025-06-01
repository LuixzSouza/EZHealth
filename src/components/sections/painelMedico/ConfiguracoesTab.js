'use client';

import { useState } from "react";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { Heading } from "@/components/typography/Heading";
import { DarkTheme } from "@/components/theme/DarkTheme"; // Seu componente DarkTheme para o toggle
import { useRouter } from "next/navigation"; // Para navegação, se necessário

export function ConfiguracoesTab() {
  const router = useRouter(); // Inicializa o useRouter

  // Estados para as configurações
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Inicializa o estado do dark mode lendo do localStorage ou sistema
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      return storedTheme === 'dark' || (storedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [receiveAppNotifications, setReceiveAppNotifications] = useState(true);
  const [receiveEmailNotifications, setReceiveEmailNotifications] = useState(true); // Nova config
  const [receiveSmsNotifications, setReceiveSmsNotifications] = useState(false); // Nova config
  const [language, setLanguage] = useState('pt-BR');
  const [anonymizeUsageData, setAnonymizeUsageData] = useState(false); // Nova config
  const [highContrastMode, setHighContrastMode] = useState(false); // Nova config


  // Funções de exemplo para manipular as configurações
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (typeof window !== 'undefined') {
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  };

  const toggleAppNotifications = () => {
    setReceiveAppNotifications(prev => !prev);
  };
  const toggleEmailNotifications = () => {
    setReceiveEmailNotifications(prev => !prev);
  };
  const toggleSmsNotifications = () => {
    setReceiveSmsNotifications(prev => !prev);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const toggleAnonymizeUsageData = () => {
    setAnonymizeUsageData(prev => !prev);
  };

  const toggleHighContrastMode = () => {
    setHighContrastMode(prev => !prev);
    // Adicionar/remover classe 'high-contrast' ao body/html para estilização via CSS/Tailwind
    document.documentElement.classList.toggle('high-contrast-mode');
  };

  const handleClearChatbotHistory = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico do chatbot? Esta ação não pode ser desfeita.')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ezhealth_chat_messages');
        localStorage.removeItem('ezhealth_session_id');
        alert('Histórico do chatbot limpo com sucesso!');
        // Opcional: recarregar a página ou o componente do chatbot para refletir a mudança
      }
    }
  };

  const handleChangePassword = () => {
    alert('Redirecionar para tela de alteração de senha.');
    // router.push('/alterar-senha'); // Exemplo de navegação real
  };

  const handleEditProfile = () => {
    alert('Redirecionar para tela de edição de perfil.');
    // router.push('/perfil-medico/editar'); // Exemplo de navegação real
  };


  const handleSaveSettings = () => {
    // Simulando o salvamento das configurações
    const settings = {
      isDarkMode,
      receiveAppNotifications,
      receiveEmailNotifications,
      receiveSmsNotifications,
      language,
      anonymizeUsageData,
      highContrastMode,
    };
    console.log("Configurações a serem salvas:", settings);
    alert("Configurações salvas com sucesso!");
    // Aqui você enviaria as configurações para um backend ou as salvaria localmente
  };

  // Helper para o toggle switch (repetido para notificação)
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
        className="relative w-14 h-8 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600 cursor-pointer"
      ></div>
    </>
  );


  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-white/10 rounded-lg shadow-md"> {/* Ajuste de padding */}
      <Heading
        as="h2"
        text="Configurações"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-3 text-2xl sm:text-3xl" // Ajuste de tamanho do título para mobile
      />
      <ParagraphBlue className="mb-4 sm:mb-6 text-sm sm:text-base">Personalize seu painel e preferências.</ParagraphBlue> {/* Ajuste de margem e fonte */}

      <div className="space-y-6 sm:space-y-8"> {/* Ajuste de espaçamento entre seções */}

        {/* Seção de Aparência */}
        <section>
          <h3 className="text-lg sm:text-xl font-semibold text-blue-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Aparência</h3>
          <div className="space-y-4">
            {/* Configuração de Tema */}
            <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <label htmlFor="darkModeToggle" className="text-sm sm:text-base font-medium text-DarkBlue dark:text-white">Modo Escuro</label>
              <DarkTheme /> {/* Reutiliza seu componente DarkTheme */}
            </div>

            {/* Configuração de Alto Contraste */}
            <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <label htmlFor="highContrastToggle" className="text-sm sm:text-base font-medium text-DarkBlue dark:text-white">Modo de Alto Contraste</label>
              <CustomToggleSwitch id="highContrastToggle" checked={highContrastMode} onChange={toggleHighContrastMode} />
            </div>
          </div>
        </section>

        {/* Seção de Notificações */}
        <section>
          <h3 className="text-lg sm:text-xl font-semibold text-blue-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Notificações</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <label htmlFor="appNotificationsToggle" className="text-sm sm:text-base font-medium text-DarkBlue dark:text-white">Notificações no Aplicativo</label>
              <CustomToggleSwitch id="appNotificationsToggle" checked={receiveAppNotifications} onChange={toggleAppNotifications} />
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <label htmlFor="emailNotificationsToggle" className="text-sm sm:text-base font-medium text-DarkBlue dark:text-white">Receber Notificações por Email</label>
              <CustomToggleSwitch id="emailNotificationsToggle" checked={receiveEmailNotifications} onChange={toggleEmailNotifications} />
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <label htmlFor="smsNotificationsToggle" className="text-sm sm:text-base font-medium text-DarkBlue dark:text-white">Receber Notificações por SMS</label>
              <CustomToggleSwitch id="smsNotificationsToggle" checked={receiveSmsNotifications} onChange={toggleSmsNotifications} />
            </div>
          </div>
        </section>

        {/* Seção de Preferências Gerais */}
        <section>
          <h3 className="text-lg sm:text-xl font-semibold text-blue-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Preferências Gerais</h3>
          <div className="space-y-4">
            {/* Configuração de Idioma */}
            <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <label htmlFor="languageSelect" className="block text-sm sm:text-base font-medium mb-2 text-DarkBlue dark:text-white">Idioma</label>
              <select
                id="languageSelect"
                value={language}
                onChange={handleLanguageChange}
                className="w-full p-2 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-DarkBlue dark:text-gray-100 focus:outline-none focus:border-orange-500 text-sm sm:text-base" // Ajuste de fonte
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español (ES)</option>
              </select>
            </div>

            {/* Anonimizar Dados de Uso */}
            <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <label htmlFor="anonymizeDataToggle" className="text-sm sm:text-base font-medium text-DarkBlue dark:text-white">Anonimizar Dados de Uso</label>
              <CustomToggleSwitch id="anonymizeDataToggle" checked={anonymizeUsageData} onChange={toggleAnonymizeUsageData} />
            </div>

            {/* Reiniciar Chatbot */}
            <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <label className="text-sm sm:text-base font-medium text-DarkBlue dark:text-white">Histórico do Chatbot</label>
              <ButtonPrimary onClick={handleClearChatbotHistory} className="text-xs sm:text-sm px-3 py-1 bg-red-600 hover:bg-red-700 w-auto">
                Limpar Histórico
              </ButtonPrimary>
            </div>
          </div>
        </section>

        {/* Seção de Conta e Segurança */}
        <section>
          <h3 className="text-lg sm:text-xl font-semibold text-blue-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Conta e Segurança</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <label className="text-sm sm:text-base font-medium text-DarkBlue dark:text-white">Gerenciar Perfil</label>
              <ButtonPrimary onClick={handleEditProfile} className="text-xs sm:text-sm px-3 py-1 w-auto">
                Editar Perfil
              </ButtonPrimary>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <label className="text-sm sm:text-base font-medium text-DarkBlue dark:text-white">Segurança</label>
              <ButtonPrimary onClick={handleChangePassword} className="text-xs sm:text-sm px-3 py-1 w-auto">
                Alterar Senha
              </ButtonPrimary>
            </div>
          </div>
        </section>

      </div>

      <div className="mt-8 sm:mt-10 text-center"> {/* Ajuste de margem superior */}
        <ButtonPrimary onClick={handleSaveSettings} className="w-full sm:w-auto"> {/* Botão full width em mobile */}
          Salvar Configurações
        </ButtonPrimary>
      </div>
    </div>
  );
}