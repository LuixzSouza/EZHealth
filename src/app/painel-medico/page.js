// ✅ PASSO 2: SUBSTITUA O CONTEÚDO DO SEU ARQUIVO POR ESTE:
// app/painel-medico/page.js

'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth"; // ✅ Importando nosso novo hook

import { Header } from "@/components/layout/Header";
import { DashboardTab } from "@/components/sections/painelMedico/DashboardTab";
import { PacientesTab } from "@/components/sections/painelMedico/PacientesTab";
import { AgendaTab } from "@/components/sections/painelMedico/AgendaTab";
import { TriagensTab } from "@/components/sections/painelMedico/TriagensTab";
import { ConfiguracoesTab } from "@/components/sections/painelMedico/ConfiguracoesTab";
import { RelatoriosTab } from "@/components/sections/painelMedico/RelatoriosTab";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

// --- Sub-componente Sidebar ---
// Agora a Sidebar gerencia seu próprio estado de visibilidade
function Sidebar({ medico, activeTab, setActiveTab, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        // Fecha a sidebar em telas pequenas ao clicar em um item
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    }

    return (
        <>
            {/* Botão de Menu para Mobile */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-20 left-4 z-50 p-2 bg-white/80 dark:bg-zinc-800/80 rounded-full shadow-lg backdrop-blur-sm"
            >
                {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
            
            {/* Overlay para fechar em mobile */}
            {isOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)}></div>}

            <aside className={`
                bg-white dark:bg-themeDark md:dark:bg-white/5 p-6 space-y-6 shadow-lg border-r border-zinc-200 dark:border-zinc-800
                sticky top-0 inset-y-0 left-0 z-50 w-64 min-h-screen
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0 md:flex-shrink-0 flex flex-col
            `}>
                <div className="flex flex-col items-center text-center">
                    <Image src={medico.foto || "/icons/medico-avatar.svg"} width={80} height={80} alt="Avatar" className="rounded-full" />
                    <h2 className="mt-4 text-lg font-semibold text-DarkBlue dark:text-white">{medico.nome}</h2>
                    <p className="text-sm text-gray-500">{medico.especialidade}</p>
                </div>

                <nav className="flex flex-col gap-2 flex-grow">
                    {['dashboard', 'pacientes', 'agenda', 'triagens', 'relatorios', 'configuracoes'].map(tab => (
                        <SidebarLink
                            key={tab}
                            icon={`/icons/${tab}.svg`}
                            title={
                                tab === 'dashboard' ? 'Visão Geral' :
                                tab === 'pacientes' ? 'Pacientes' :
                                tab === 'agenda' ? 'Agenda' :
                                tab === 'triagens' ? 'Triagens' :
                                tab === 'relatorios' ? 'Relatórios' : 'Configurações'
                            }
                            isActive={activeTab === tab}
                            onClick={() => handleTabClick(tab)}
                        />
                    ))}
                </nav>

                <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2 text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/50 w-full text-left">
                    <Image src="/icons/sair.svg" width={20} height={20} alt="Sair" className="filter dark:invert" />
                    <span>Sair</span>
                </button>
            </aside>
        </>
    );
}

function SidebarLink({ icon, title, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-md w-full text-left transition ${isActive ? 'bg-orange text-white' : 'hover:bg-orange/10 text-blue-900 dark:text-white'}`}
    >
      <Image src={icon} alt={title} width={20} height={20} className={`filter dark:invert ${isActive ? 'invert-0' : 'group-hover:invert-0'}`} />
      <span>{title}</span>
    </button>
  );
}


// --- Componente da Página Principal ---
export default function PainelMedico() {
  // ✅ Lógica de autenticação agora está limpa e centralizada no hook
  const { user: medico, loading, logout } = useAuth('medico');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
        logout(); // Chama a função de logout do hook
    }, 1000);
  };
  
  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'pacientes': return <PacientesTab />;
      case 'agenda': return <AgendaTab />;
      case 'triagens': return <TriagensTab />;
      case 'relatorios': return <RelatoriosTab />;
      case 'configuracoes': return <ConfiguracoesTab />;
      default: return null;
    }
  };

  // Enquanto o hook verifica o login, mostra uma tela de carregamento.
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Carregando painel...</div>;
  }
  
  // Se o hook não encontrar o usuário (já terá redirecionado, mas é uma segurança extra)
  if (!medico) {
    return null; 
  }

  // Overlay de Logout
  if (isLoggingOut) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-black">
            <Image src={medico.foto || "/icons/medico-avatar.svg"} width={96} height={96} alt="Avatar" className="rounded-full shadow-lg mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Saindo...</h2>
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-zinc-50 dark:bg-themeDark">
        <Sidebar 
            medico={medico}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {renderTab()}
        </main>
      </div>
    </>
  );
}