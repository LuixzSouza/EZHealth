'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

import { HeadingOrange } from "@/components/theme/HeadingOrange";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { Header } from "@/components/layout/Header";
import { Heading } from "@/components/typography/Heading";
import { DashboardTab } from "@/components/sections/painelMedico/DashboardTab";
import { PacientesTab } from "@/components/sections/painelMedico/PacientesTab";
import { AgendaTab } from "@/components/sections/painelMedico/AgendaTab";
import { TriagensTab } from "@/components/sections/painelMedico/TriagensTab";
import { ConfiguracoesTab } from "@/components/sections/painelMedico/ConfiguracoesTab";
import { RelatoriosTab } from "@/components/sections/painelMedico/RelatoriosTab";

// Importando os ícones que você usaria para abrir/fechar o menu em mobile
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; // Certifique-se de ter @heroicons/react instalado

export default function PainelMedico() {
  const [medico, setMedico] = useState(null);
  // Por padrão, a sidebar pode estar oculta em mobile e visível em desktop
  // Ajustamos a lógica para mobile-first
  const [sidebarOpen, setSidebarOpen] = useState(false); // Começa fechado para mobile
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    document.title = "Painel Médico - EZHealth";
    const medicoLogado = localStorage.getItem("medicoLogado");
    if (!medicoLogado) {
      router.push("/login-medico");
    } else {
      setMedico(JSON.parse(medicoLogado));
    }

    // Lógica para abrir sidebar automaticamente em telas maiores
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Adiciona listener ao carregar e remove ao desmontar
    window.addEventListener('resize', handleResize);
    // Chama uma vez para definir o estado inicial
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!medico) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-themeDark text-DarkBlue dark:text-white">
        <p>Carregando painel...</p>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'pacientes':
        return <PacientesTab />;
      case 'agenda':
        return <AgendaTab />;
      case 'triagens':
        return <TriagensTab />;
      case 'relatorios':
        return <RelatoriosTab />;
      case 'configuracoes':
        return <ConfiguracoesTab />;
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className={`
          bg-white dark:bg-themeDark md:dark:bg-white/10 p-6 space-y-6 shadow-md
          fixed inset-y-0 left-0 z-[51]  // Torna a sidebar fixa e sobreposta em mobile
          w-64                            // Largura padrão para desktop
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} // Esconde/mostra em mobile
          md:relative md:translate-x-0     // Em md e acima, volta a ser relativa e sempre visível
          md:block                         // Assegura que em desktop ela sempre apareça
          md:min-h-screen                  // Garante a altura em desktop
          overflow-y-auto                  // Permite scroll se o conteúdo da sidebar for grande
        `}>
          <div className="flex flex-col items-center">
            <Image
              src={medico.foto || "/icons/medico-avatar.svg"}
              width={80}
              height={80}
              alt="Avatar"
              className="rounded-full"
            />
            <Heading as="h2" text={medico.nome} colorClass="text-DarkBlue dark:text-white" className="mt-4 text-base md:text-lg" /> {/* Ajuste de fonte para mobile */}
            <p className="text-sm text-gray-500 text-center">{medico.especialidade}</p>
          </div>

          <nav className="flex flex-col gap-2">
            {['dashboard','pacientes','agenda','triagens','relatorios','configuracoes'].map(tab => (
              <SidebarLink
                key={tab}
                icon={`/icons/${tab}.svg`}
                title={tab === 'dashboard' ? 'Visão Geral' :
                       tab === 'pacientes' ? 'Meus Pacientes' :
                       tab === 'agenda' ? 'Agenda de Consultas' :
                       tab === 'triagens' ? 'Triagens Pendentes' :
                       tab === 'relatorios' ? 'Relatórios' : 'Configurações'}
                tab={tab}
                activeTab={activeTab}
                onClick={() => {
                  setActiveTab(tab);
                  if (window.innerWidth < 768) { // Fecha a sidebar após clicar em mobile
                    setSidebarOpen(false);
                  }
                }}
              />
            ))}
          </nav>

          <button
            onClick={() => {
              localStorage.removeItem("medicoLogado");
              router.push("/login-medico");
            }}
            className="text-red-600 flex items-center gap-2 mt-6 hover:underline text-sm"
          >
            <Image src="/icons/sair.svg" width={20} height={20} alt="Sair" />
            Sair
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-4 md:hidden bg-blue-100 dark:bg-gray-700 text-blue-900 dark:text-white px-3 py-2 rounded-lg flex items-center gap-2" // Ajuste de padding/arredondamento para mobile
          >
            {sidebarOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            {sidebarOpen ? 'Fechar Menu' : 'Abrir Menu'}
          </button>

        </aside>

        {/* Overlay para fechar sidebar em mobile */}
        {sidebarOpen && window.innerWidth < 768 && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Conteúdo Principal */}
        <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-themeDark"> {/* Ajuste de padding para mobile */}
          {/* Botão de abrir/fechar menu para mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-4 md:hidden bg-blue-100 dark:bg-gray-700 text-blue-900 dark:text-white px-3 py-2 rounded-lg flex items-center gap-2" // Ajuste de padding/arredondamento para mobile
          >
            {sidebarOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            {sidebarOpen ? 'Fechar Menu' : 'Abrir Menu'}
          </button>

          {renderTab()}
        </main>
      </div>
    </>
  );
}

function SidebarLink({ icon, title, tab, activeTab, onClick }) {
  const isActive = activeTab === tab;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-md w-full text-left transition group 
                  ${isActive ? 'bg-orange dark:bg-orange' : 'hover:bg-orange/80 dark:hover:bg-gray-700'} 
                  ${isActive ? 'text-white' : 'text-blue-900 dark:text-white group-hover:text-white'} 
                  text-sm font-medium
                  focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 dark:focus:ring-offset-gray-800 // Acessibilidade
                `}
    >
      <Image src={icon} alt={title} width={20} height={20} className={`filter dark:invert ${isActive ? 'invert' : 'group-hover:invert'}`} />
      <span>{title}</span>
    </button>
  );
}