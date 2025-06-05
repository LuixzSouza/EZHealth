// pages/painel-admin.js (ou app/painel-admin/page.js)
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Header } from "@/components/layout/Header";
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

// Importar os componentes das abas administrativas
import { DashboardAdminTab } from "@/components/sections/painelAdmin/DashboardAdminTab";
import { MedicosAdminTab } from "@/components/sections/painelAdmin/MedicosAdminTab";
import { UsuariosAdminTab } from "@/components/sections/painelAdmin/UsuariosAdminTab";
import { SalasAdminTab } from "@/components/sections/painelAdmin/SalasAdminTab"; // Importar a nova aba
import { ConfiguracoesAdminTab } from "@/components/sections/painelAdmin/ConfiguracoesAdminTab";
import { SidebarLink } from "@/components/sections/painelAdmin/SidebarLink";


export default function PainelAdmin() {
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.title = "Painel Admin - EZHealth";
    const adminLogado = localStorage.getItem("adminLogado");
    if (!adminLogado) {
      if (!isLoggingOut) {
        router.push("/login-medico");
      }
    } else {
      setAdmin(JSON.parse(adminLogado));
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Define o estado inicial

    return () => window.removeEventListener('resize', handleResize);
  }, [isLoggingOut, router]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem("adminLogado");

    setTimeout(() => {
      router.push("/login-medico");
    }, 1500);
  };

  if (!admin) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-themeDark text-DarkBlue dark:text-white">
        <p>Carregando painel do administrador...</p>
      </div>
    );
  }

  // Função auxiliar para renderizar a aba ativa
  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardAdminTab />;
      case 'medicos':
        return <MedicosAdminTab />;
      case 'usuarios':
        return <UsuariosAdminTab />;
      case 'salas': // Novo case para a aba de salas
        return <SalasAdminTab />;
      case 'configuracoes':
        return <ConfiguracoesAdminTab />;
      default:
        return null;
    }
  };

  return (
    <>
      <Header />

      {isLoggingOut ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-themeDark z-[60] transition-opacity duration-500 opacity-100">
          <Image
            src="/icons/admin-avatar.png"
            width={100}
            height={100}
            alt="Admin"
            className="rounded-full animate-pulse"
          />
          <Heading
            as="h2"
            text={`Até logo, ${admin?.nome || 'Administrador'}!`}
            colorClass="text-DarkBlue dark:text-white"
            className="mt-6 text-xl sm:text-2xl"
          />
          <ParagraphBlue className="mt-2 text-sm sm:text-base text-center">
            Saindo do painel de controle...
          </ParagraphBlue>
          <svg className="animate-spin h-8 w-8 text-orange-500 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="flex min-h-screen">
          <aside className={`
            bg-white dark:bg-themeDark p-6 space-y-6 shadow-md
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
                src="/icons/admin-avatar.png"
                width={80}
                height={80}
                alt="Admin"
                className="rounded-full"
              />
              <Heading as="h2" text={admin.nome || 'Administrador'} colorClass="text-DarkBlue dark:text-white" className="mt-4 text-base md:text-lg" />
              <p className="text-sm text-gray-500 text-center">Admin do Sistema</p>
            </div>

            <nav className="flex flex-col gap-2 mt-6">
              {['dashboard', 'medicos', 'usuarios', 'salas', 'configuracoes'].map(tab => ( // Adicione 'salas' aqui
                <SidebarLink
                  key={tab}
                  icon={`/icons/${tab}.svg`}
                  title={tab === 'dashboard' ? 'Dashboard' :
                         tab === 'medicos' ? 'Médicos' :
                         tab === 'usuarios' ? 'Usuários' :
                         tab === 'salas' ? 'Salas' : // Novo título para 'salas'
                         'Configurações'}
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
          </aside>

          {sidebarOpen && window.innerWidth < 768 && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-themeDark">
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
      )}
    </>
  );
}