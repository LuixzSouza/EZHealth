// ✅ SUBSTITUA O CONTEÚDO DO SEU ARQUIVO POR ESTE:
// src/components/sections/painelAdmin/DashboardAdminTab.js

'use client';

import { useState, useEffect } from 'react';
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

// --- Componente de Card de Estatística (sem alterações) ---
function StatCard({ label, value, description }) {
  return (
    <div className="bg-blue-100 text-blue-900 dark:bg-white/10 dark:text-themeTextDark rounded-xl p-4 text-center shadow">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm mt-1">{label}</div>
      {description && <p className="text-zinc-500 text-xs mt-1 hidden sm:block">{description}</p>}
    </div>
  );
}

// --- Componente Principal do Dashboard ---
export function DashboardAdminTab() {
  // Estados para os dados dinâmicos
  const [stats, setStats] = useState(null);
  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dados estáticos para o gráfico de atividade diária (mantido como exemplo)
  const dadosAtividade = [
    { dia: "Seg", logins: 150, triagens: 70 },
    { dia: "Ter", logins: 180, triagens: 90 },
    { dia: "Qua", logins: 160, triagens: 80 },
    { dia: "Qui", logins: 200, triagens: 100 },
    { dia: "Sex", logins: 190, triagens: 95 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Busca os dados dos cards e dos gráficos em paralelo
        const [statsRes, registrationsRes] = await Promise.all([
          fetch('/api/dashboard-stats'),
          fetch('/api/admin-stats/monthly-registrations')
        ]);

        const statsResult = await statsRes.json();
        const registrationsResult = await registrationsRes.json();

        if (!statsResult.success) throw new Error(statsResult.message || "Falha ao buscar estatísticas.");
        if (!registrationsResult.success) throw new Error(registrationsResult.message || "Falha ao buscar cadastros mensais.");
        
        setStats(statsResult.data);
        setMonthlyRegistrations(registrationsResult.data);

      } catch (err) {
        setError("Não foi possível carregar os dados do dashboard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
      <Heading as="h2" text="Visão Geral Administrativa" colorClass="dark:text-orangeDark text-orange" className="mb-3" />
      <ParagraphBlue className="mb-6">Acompanhe as principais métricas e atividades do sistema EZHealth.</ParagraphBlue>

      {/* Cards de Estatísticas Principais (agora dinâmicos) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        {loading ? <p className='col-span-full text-center'>Carregando...</p> : error ? <p className='col-span-full text-center text-red-500'>{error}</p> : (
            <>
                <StatCard label="Médicos Ativos" value={stats?.activeDoctors ?? '0'} description="Total de profissionais na plataforma." />
                <StatCard label="Pacientes Registrados" value={stats?.totalPatients ?? '0'} description="Total de pacientes cadastrados." />
                <StatCard label="Consultas Hoje" value={stats?.appointmentsToday ?? '0'} description="Agendamentos para o dia de hoje." />
                <StatCard label="Triagens Pendentes" value={stats?.triagensPendentes ?? '0'} description="Pacientes aguardando atendimento." />
            </>
        )}
      </div>

      {/* Gráficos de Atividade e Cadastros */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Linha - Novos Cadastros (agora dinâmico) */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow p-6">
          <h4 className="text-lg font-semibold text-blue-900 dark:text-orange">📈 Novos Cadastros por Mês</h4>
          <div className="w-full h-56 mt-4">
            {loading ? <p className='text-center'>Carregando...</p> : 
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRegistrations}>
                    <XAxis dataKey="mes" stroke="#9ca3af" tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <YAxis stroke="#9ca3af" tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none' }} />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="medicos" stroke="#2563eb" name="Médicos" />
                    <Line type="monotone" dataKey="pacientes" stroke="#f47127" name="Pacientes" />
                  </LineChart>
                </ResponsiveContainer>
            }
          </div>
        </div>

        {/* Gráfico de Barras - Atividade Diária (mantido estático) */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow p-6">
          <h4 className="text-lg font-semibold text-blue-900 dark:text-orange">📊 Atividade Diária</h4>
           <div className="w-full h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosAtividade}>
                <XAxis dataKey="dia" stroke="#9ca3af" tick={{ fill: 'currentColor', fontSize: 12 }} />
                <YAxis stroke="#9ca3af" tick={{ fill: 'currentColor', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none' }} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="logins" fill="#002157" name="Logins" />
                <Bar dataKey="triagens" fill="#f47127" name="Triagens" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}