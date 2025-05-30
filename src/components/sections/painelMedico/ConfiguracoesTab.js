import { ButtonPrimary } from "@/components/theme/ButtonPrimary";
import { DarkTheme } from "@/components/theme/DarkTheme";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { Heading } from "@/components/typography/Heading";
import { useState } from "react";


export function ConfiguracoesTab() {
  // Exemplo de estado para uma configuração de tema
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  const [language, setLanguage] = useState('pt-BR');

  // Funções de exemplo para manipular as configurações
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    // Aqui você adicionaria a lógica real para mudar o tema na sua aplicação (ex: adicionar/remover classe 'dark' no <html>)
    document.documentElement.classList.toggle('dark');
  };

  const toggleNotifications = () => {
    setReceiveNotifications(prev => !prev);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleSaveSettings = () => {
    alert("Configurações salvas! (Modo Escuro: " + isDarkMode + ", Notificações: " + receiveNotifications + ", Idioma: " + language + ")");
    // Aqui você enviaria as configurações para um backend ou as salvaria localmente
  };

  return (
    <div className="p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
      <Heading
        as="h2" // Define a tag HTML para o título
        text="Configurações"
        colorClass="dark:text-orangeDark text-orange" // Passa a classe de cor
        className="mb-4" // Adiciona margem inferior
      />
      <ParagraphBlue className="mb-6">Personalize seu painel.</ParagraphBlue>

      <div className="space-y-6">
        {/* Configuração de Tema */}
        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-md">
          <label htmlFor="darkModeToggle" className="text-lg font-medium text-DarkBlue dark:text-white">Modo Escuro</label>
          <input
            type="checkbox"
            id="darkModeToggle"
            checked={isDarkMode}
            onChange={toggleDarkMode}
            className="sr-only peer" // Esconde o checkbox original
          />
          {/* Estilização de toggle switch customizado com Tailwind */}
          <DarkTheme/>
        </div>

        {/* Configuração de Notificações */}
        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-md">
          <label htmlFor="notificationsToggle" className="text-lg font-medium text-DarkBlue dark:text-white">Receber Notificações</label>
          <input
            type="checkbox"
            id="notificationsToggle"
            checked={receiveNotifications}
            onChange={toggleNotifications}
            className="sr-only peer"
          />
          <div
            onClick={toggleNotifications}
            className="relative w-14 h-8 bg-themeTextDark dark:bg-themeTextDark peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600 cursor-pointer"
          ></div>
        </div>

        {/* Configuração de Idioma */}
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
          <label htmlFor="languageSelect" className="block text-lg font-medium mb-2 text-DarkBlue dark:text-white">Idioma</label>
          <select
            id="languageSelect"
            value={language}
            onChange={handleLanguageChange}
            className="w-full p-2 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-DarkBlue dark:text-gray-100 focus:outline-none focus:border-orange-500"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español (ES)</option>
          </select>
        </div>
      </div>

      <div className="mt-8 text-center">
        <ButtonPrimary onClick={handleSaveSettings}>
          Salvar Configurações
        </ButtonPrimary>
      </div>
    </div>
  );
}