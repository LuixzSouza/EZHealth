'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

import { Header } from "@/components/layout/Header";
import { Heading } from "@/components/typography/Heading";
import { DashboardTab } from "@/components/sections/painelMedico/DashboardTab";
import { PacientesTab } from "@/components/sections/painelMedico/PacientesTab";
import { AgendaTab } from "@/components/sections/painelMedico/AgendaTab";
import { TriagensTab } from "@/components/sections/painelMedico/TriagensTab";
import { ConfiguracoesTab } from "@/components/sections/painelMedico/ConfiguracoesTab";
import { RelatoriosTab } from "@/components/sections/painelMedico/RelatoriosTab";

// Ícones para menu mobile
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function PainelMedico() {
  const [medico, setMedico] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loggingOut, setLoggingOut] = useState(false); // controla overlay de logout
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
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [router]);

  if (!medico && !loggingOut) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-themeDark text-DarkBlue dark:text-white">
        <p>Carregando painel...</p>
      </div>
    );
  }

  const handleLogout = () => {
    setLoggingOut(true);
    // Após 1 segundo (ou o tempo que quiser para a animação), limpa e redireciona
    setTimeout(() => {
      localStorage.removeItem("medicoLogado");
      router.push("/login-medico");
    }, 1000);
  };

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
      {/* Se estiver saindo, exibe overlay full-screen antes de renderizar o resto */}
      {loggingOut && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-black transition-opacity">
          {/* Foto do médico */}
          <Image
            src={medico.foto || "/icons/medico-avatar.svg"}
            width={96}
            height={96}
            alt="Avatar do Médico"
            className="rounded-full shadow-lg mb-4"
          />
          <h2 className="text-2xl font-semibold text-blue-900 dark:text-white mb-2">
            Saindo...
          </h2>
          {/* Spinner em CSS/Tailwind */}
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Conteúdo padrão do painel só é clicável se não estiver no modo de logout */}
      <div className={`${loggingOut ? "pointer-events-none opacity-50" : ""}`}>
        <Header />
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className={`
            bg-white dark:bg-themeDark md:dark:bg-white/10 p-6 space-y-6 shadow-md
            fixed inset-y-0 left-0 z-[51]
            w-64
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:relative md:translate-x-0
            md:block
            md:min-h-screen
            overflow-y-auto
          `}>
            <div className="flex flex-col items-center">
              <Image
                src={medico.foto || "/icons/medico-avatar.svg"}
                width={80}
                height={80}
                alt="Avatar"
                className="rounded-full"
              />
              <Heading
                as="h2"
                text={medico.nome}
                colorClass="text-DarkBlue dark:text-white"
                className="mt-4 text-base md:text-lg"
              />
              <p className="text-sm text-gray-500 text-center">{medico.especialidade}</p>
            </div>

            <nav className="flex flex-col gap-2">
              {['dashboard','pacientes','agenda','triagens','relatorios','configuracoes'].map(tab => (
                <SidebarLink
                  key={tab}
                  icon={`/icons/${tab}.svg`}
                  title={
                    tab === 'dashboard' ? 'Visão Geral' :
                    tab === 'pacientes' ? 'Meus Pacientes' :
                    tab === 'agenda' ? 'Agenda de Consultas' :
                    tab === 'triagens' ? 'Triagens Pendentes' :
                    tab === 'relatorios' ? 'Relatórios' :
                    'Configurações'
                  }
                  tab={tab}
                  activeTab={activeTab}
                  onClick={() => {
                    setActiveTab(tab);
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                />
              ))}
            </nav>

            <button
              onClick={handleLogout}
              className="text-red-600 flex items-center gap-2 mt-6 hover:underline text-sm"
            >
              <Image src="/icons/sair.svg" width={20} height={20} alt="Sair" />
              Sair
            </button>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mb-4 md:hidden bg-blue-100 dark:bg-gray-700 text-blue-900 dark:text-white px-3 py-2 rounded-lg flex items-center gap-2"
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
          <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-themeDark">
            {/* Botão de abrir/fechar menu para mobile */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mb-4 md:hidden bg-blue-100 dark:bg-gray-700 text-blue-900 dark:text-white px-3 py-2 rounded-lg flex items-center gap-2"
            >
              {sidebarOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
              {sidebarOpen ? 'Fechar Menu' : 'Abrir Menu'}
            </button>

            {renderTab()}
          </main>
        </div>
      </div>
    </>
  );
}

function SidebarLink({ icon, title, tab, activeTab, onClick }) {
  const isActive = activeTab === tab;
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-md w-full text-left transition group 
        ${isActive
          ? 'bg-orange dark:bg-orange text-white'
          : 'hover:bg-orange/80 dark:hover:bg-gray-700 text-blue-900 dark:text-white group-hover:text-white'}
        text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 dark:focus:ring-offset-gray-800
      `}
    >
      <Image
        src={icon}
        alt={title}
        width={20}
        height={20}
        className={`filter dark:invert ${isActive ? 'invert' : 'group-hover:invert'}`}
      />
      <span>{title}</span>
    </button>
  );
}
