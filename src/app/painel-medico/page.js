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

export default function PainelMedico() {
  const [medico, setMedico] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
  }, []);

  if (!medico) {
    return (
      <div className="h-screen flex items-center justify-center">
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
        <aside className={`bg-white dark:bg-white/10 w-64 p-6 space-y-6 shadow-md ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
          <div className="flex flex-col items-center">
            <Image
              src={medico.foto || "/icons/medico-avatar.svg"}
              width={80}
              height={80}
              alt="Avatar"
              className="rounded-full"
            />
            <Heading as="h2" text={medico.nome} colorClass="text-DarkBlue dark:text-white" className="mt-4 md:text-lg" />
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
                onClick={setActiveTab}
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
        </aside>

        <main className="flex-1 p-6 bg-gray-50 dark:bg-themeDark">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-4 md:hidden bg-blue-100 dark:bg-gray-700 text-blue-900 dark:text-white px-3 py-1 rounded"
          >
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
      onClick={() => onClick(tab)}
      className={`flex items-center gap-3 px-3 py-2 rounded-md w-full text-left transition group ${isActive ? 'bg-orange dark:bg-orange' : 'hover:bg-orange/80 dark:hover:bg-gray/40'}`}
    >
      <Image src={icon} alt={title} width={20} height={20} className={`filter dark:invert ${isActive ? 'invert' : 'group-hover:invert'}`} />
      <span className={`${isActive ? 'text-white' : 'text-blue-900 dark:text-white group-hover:text-white'} text-sm font-medium`}>{title}</span>
    </button>
  );
}
