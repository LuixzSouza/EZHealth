'use client';

import { useEffect } from "react";
import Image from "next/image";
import { ContainerGrid } from "@/components/layout/ContainerGrid";
import { HeadingOrange } from "@/components/theme/HeadingOrange";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { Header } from "@/components/layout/Header";

export default function PainelMedico() {
  useEffect(() => {
    document.title = "Painel Médico - EZHealth";
  }, []);

  return (
    <>
      <Header />
      <section className="py-14 min-h-screen bg-gray-50 relative">
        <button className="absolute top-6 right-6 text-sm text-red-600 hover:underline">Sair</button>

        <ContainerGrid>
          <div className="flex items-center gap-4 mt-6">
            <Image src="/icons/medico-avatar.svg" width={50} height={50} alt="Avatar" className="rounded-full" />
            <div>
              <p className="text-blue-900 font-semibold">Dr. Marcos Andrade</p>
              <p className="text-sm text-gray-600">Clínico Geral</p>
            </div>
          </div>

          <HeadingOrange text="Painel do Médico" />
          <ParagraphBlue>
            Bem-vindo ao painel médico da plataforma EZHealth. Aqui você pode acessar suas funções principais.
          </ParagraphBlue>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <StatCard label="Pacientes Ativos" value="28" />
            <StatCard label="Consultas Hoje" value="5" />
            <StatCard label="Triagens Pendentes" value="3" />
            <StatCard label="Alertas Críticos" value="1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            <Card icon="/icons/paciente.svg" title="Meus Pacientes" href="/medico/pacientes" />
            <Card icon="/icons/agenda.svg" title="Agenda de Consultas" href="/medico/agenda" />
            <Card icon="/icons/triagem.svg" title="Triagens Pendentes" href="/medico/triagens" />
            <Card icon="/icons/relatorio.svg" title="Relatórios Médicos" href="/medico/relatorios" />
            <Card icon="/icons/config.svg" title="Configurações" href="/medico/configuracoes" />
          </div>

          <div className="mt-10 flex gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">Nova Consulta</button>
            <button className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition">Registrar Triagem</button>
          </div>

          <div className="mt-12 bg-white rounded-xl shadow p-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-4">Notificações recentes</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>🔔 Nova triagem pendente de João Silva</li>
              <li>📅 Consulta agendada com Maria Oliveira às 14h</li>
              <li>📝 Novo relatório médico solicitado</li>
            </ul>
          </div>
        </ContainerGrid>
      </section>
    </>
  );
}

function Card({ icon, title, href }) {
  return (
    <a
      href={href}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-center justify-center gap-4 hover:scale-105"
    >
      <Image src={icon} alt={title} width={64} height={64} />
      <h3 className="text-xl font-semibold text-center text-blue-900">{title}</h3>
    </a>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-blue-100 text-blue-900 rounded-xl p-4 text-center shadow">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm mt-1">{label}</div>
    </div>
  );
}
