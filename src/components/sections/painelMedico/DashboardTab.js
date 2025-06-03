'use client';

import { useState, useEffect } from 'react';
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { Heading } from "@/components/typography/Heading";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export function DashboardTab() {
  const [activeQuickActionTab, setActiveQuickActionTab] = useState('overview');

  // Estados para estatísticas gerais
  const [stats, setStats] = useState({
    pacientesAtivos: 0,
    consultasHoje: 0,
    triagensPendentes: 0,
    alertasCriticos: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);

  // Estados para gráficos (exemplos, ou faça fetch semelhante)
  const [consultasPorMes, setConsultasPorMes] = useState([]);
  const [urgenciasTriagem, setUrgenciasTriagem] = useState([]);
  const [loadingConsultas, setLoadingConsultas] = useState(true);
  const [loadingUrgencias, setLoadingUrgencias] = useState(true);
  const [errorConsultas, setErrorConsultas] = useState(null);
  const [errorUrgencias, setErrorUrgencias] = useState(null);

  // 1) Fetch das estatísticas gerais
  useEffect(() => {
    async function fetchStats() {
      try {
        setLoadingStats(true);
        setErrorStats(null);

        const resp = await fetch('/api/dashboard-stats');
        if (!resp.ok) {
          throw new Error(`Erro HTTP: ${resp.status}`);
        }
        const data = await resp.json();
        setStats({
          pacientesAtivos: data.pacientesAtivos,
          consultasHoje: data.consultasHoje,
          triagensPendentes: data.triagensPendentes,
          alertasCriticos: data.alertasCriticos,
        });
      } catch (err) {
        console.error('Erro ao buscar estatísticas do dashboard:', err);
        setErrorStats('Não foi possível carregar estatísticas.');
      } finally {
        setLoadingStats(false);
      }
    }
    fetchStats();
  }, []);

  // 2) Fetch de "consultas por mês"
  useEffect(() => {
    async function fetchConsultasMes() {
      try {
        setLoadingConsultas(true);
        setErrorConsultas(null);

        const resp = await fetch('/api/consultas-por-mes');
        if (!resp.ok) {
          throw new Error(`Erro HTTP: ${resp.status}`);
        }
        setConsultasPorMes(await resp.json());
      } catch (err) {
        console.error('Erro ao buscar consultas por mês:', err);
        setErrorConsultas('Não foi possível carregar consultas por mês.');
      } finally {
        setLoadingConsultas(false);
      }
    }
    fetchConsultasMes();
  }, []);

  // 3) Fetch de "urgências de triagem"
  useEffect(() => {
    async function fetchUrgencias() {
      try {
        setLoadingUrgencias(true);
        setErrorUrgencias(null);

        const resp = await fetch('/api/urgencias-triagem');
        if (!resp.ok) {
          throw new Error(`Erro HTTP: ${resp.status}`);
        }
        setUrgenciasTriagem(await resp.json());
      } catch (err) {
        console.error('Erro ao buscar urgências de triagem:', err);
        setErrorUrgencias('Não foi possível carregar urgências de triagem.');
      } finally {
        setLoadingUrgencias(false);
      }
    }
    fetchUrgencias();
  }, []);

  // Conteúdo para cada aba de ação rápida
  const renderQuickActionContent = () => {
    switch (activeQuickActionTab) {
      case 'new-consultation':
        return (
          <div className="bg-white dark:bg-white/10 p-4 sm:p-6 rounded-xl shadow mt-4">
            <h5 className="text-lg font-semibold text-blue-900 dark:text-gray-200 mb-4">
              Agendar Nova Consulta
            </h5>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Formulário para agendamento rápido de consultas. (Ex: campos para paciente, data, hora, motivo)
            </p>
            <ButtonPrimary className="mt-4 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              Confirmar Agendamento
            </ButtonPrimary>
          </div>
        );
      case 'register-screening':
        return (
          <div className="bg-white dark:bg-white/10 p-4 sm:p-6 rounded-xl shadow mt-4">
            <h5 className="text-lg font-semibold text-orange-900 dark:text-gray-200 mb-4">
              Registrar Nova Triagem
            </h5>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Interface para registrar dados de uma nova triagem. (Ex: campos para paciente, sintomas)
            </p>
            <ButtonPrimary className="mt-4 bg-orange hover:bg-orange-dark w-full sm:w-auto">
              Salvar Triagem
            </ButtonPrimary>
          </div>
        );
      case 'new-report':
        return (
          <div className="bg-white dark:bg-white/10 p-4 sm:p-6 rounded-xl shadow mt-4">
            <h5 className="text-lg font-semibold text-green-900 dark:text-gray-200 mb-4">
              Gerar Novo Relatório
            </h5>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Opções para gerar diferentes tipos de relatórios médicos. (Ex: seleção de paciente, tipo, período)
            </p>
            <ButtonPrimary className="mt-4 bg-green-600 hover:bg-green-700 w-full sm:w-auto">
              Gerar Relatório
            </ButtonPrimary>
          </div>
        );
      default:
        return (
          <div className="bg-white dark:bg-white/10 p-4 sm:p-6 rounded-xl shadow mt-4">
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Selecione uma opção acima para uma ação rápida.
            </p>
          </div>
        );
    }
  };

  return (
    <>
      <Heading
        as="h2"
        text="Visão Geral"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-3 text-2xl sm:text-3xl"
      />
      <ParagraphBlue className="text-sm sm:text-base">
        Bem-vindo à sua central de controle médico. Abaixo estão os resumos e ações disponíveis.
      </ParagraphBlue>

      {/* ———————————————— */}
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-6">
        {loadingStats ? (
          <div className="col-span-2 md:col-span-4 text-center py-6 text-gray-500 dark:text-gray-400">
            Carregando estatísticas...
          </div>
        ) : errorStats ? (
          <div className="col-span-2 md:col-span-4 text-center py-6 text-red-500 dark:text-red-400">
            {errorStats}
          </div>
        ) : (
          <>
            <StatCard
              label="Pacientes Ativos"
              value={stats.pacientesAtivos.toString()}
            />
            <StatCard
              label="Consultas Hoje"
              value={stats.consultasHoje.toString()}
            />
            <StatCard
              label="Triagens Pendentes"
              value={stats.triagensPendentes.toString()}
            />
            <StatCard
              label="Alertas Críticos"
              value={stats.alertasCriticos.toString()}
            />
          </>
        )}
      </div>

      {/* ———————————————— */}
      {/* Gráficos */}
      <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1) Consultas por Mês */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-orange flex items-center gap-2">
              📊 Consultas por Mês
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
              Últimos meses
            </span>
          </div>
          {loadingConsultas ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-6">
              Carregando gráfico...
            </p>
          ) : errorConsultas ? (
            <p className="text-red-500 dark:text-red-400 text-center py-6">
              {errorConsultas}
            </p>
          ) : (
            <div className="w-full h-56 text-black dark:text-gray-300">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={consultasPorMes}>
                  <XAxis
                    dataKey="mes"
                    stroke="#9ca3af"
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                  />
                  <YAxis stroke="#9ca3af" tick={{ fill: 'currentColor', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(255, 255, 255)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line type="monotone" dataKey="consultas" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 2) Urgência das Triagens */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-orange flex items-center gap-2">
              🚨 Urgência das Triagens
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
              Dados de triagens
            </span>
          </div>
          {loadingUrgencias ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-6">
              Carregando gráfico...
            </p>
          ) : errorUrgencias ? (
            <p className="text-red-500 dark:text-red-400 text-center py-6">
              {errorUrgencias}
            </p>
          ) : (
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={urgenciasTriagem}
                    dataKey="valor"
                    nameKey="tipo"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {urgenciasTriagem.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={['#ef4444', '#f59e0b', '#10b981'][index % 3]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(255, 255, 255)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* ———————————————— */}
      {/* Ações Rápidas */}
      <div className="mt-8 sm:mt-10">
        <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-themeTextDark mb-4">
          Ações Rápidas
        </h4>
        <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveQuickActionTab('overview')}
            className={`
              py-2 px-3 text-sm font-medium focus:outline-none flex-grow sm:flex-grow-0
              ${activeQuickActionTab === 'overview'
                ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}
              transition-colors duration-200
            `}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveQuickActionTab('new-consultation')}
            className={`
              py-2 px-3 text-sm font-medium focus:outline-none flex-grow sm:flex-grow-0
              ${activeQuickActionTab === 'new-consultation'
                ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}
              transition-colors duration-200
            `}
          >
            Nova Consulta
          </button>
          <button
            onClick={() => setActiveQuickActionTab('register-screening')}
            className={`
              py-2 px-3 text-sm font-medium focus:outline-none flex-grow sm:flex-grow-0
              ${activeQuickActionTab === 'register-screening'
                ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}
              transition-colors duration-200
            `}
          >
            Registrar Triagem
          </button>
          <button
            onClick={() => setActiveQuickActionTab('new-report')}
            className={`
              py-2 px-3 text-sm font-medium focus:outline-none flex-grow sm:flex-grow-0
              ${activeQuickActionTab === 'new-report'
                ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}
              transition-colors duration-200
            `}
          >
            Novo Relatório
          </button>
        </div>
        {renderQuickActionContent()}
      </div>

      {/* ———————————————— */}
      {/* Notificações Recentes */}
      <div className="mt-8 sm:mt-10 bg-white dark:bg-white/10 rounded-xl shadow p-4 sm:p-6">
        <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-themeTextDark mb-4">
          Notificações recentes
        </h4>
        <ul className="space-y-3 sm:space-y-4">
          {[
            { icon: "🔔", text: "Nova triagem pendente de João Silva", color: "text-yellow-600" },
            { icon: "📅", text: "Consulta agendada com Maria Oliveira às 14h", color: "text-blue-600" },
            { icon: "📝", text: "Novo relatório médico solicitado", color: "text-green-600" },
            { icon: "✅", text: "Consulta com Pedro Lima finalizada", color: "text-gray-600" },
            { icon: "📬", text: "Mensagem do paciente Lucas Santos", color: "text-purple-600" },
          ].map((notif, index) => (
            <li key={index} className="flex items-start gap-2 sm:gap-3">
              <span className={`text-xl ${notif.color} flex-shrink-0`}>{notif.icon}</span>
              <span className="text-sm text-blue-900 dark:text-themeTextDark leading-tight">
                {notif.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-blue-100 text-blue-900 dark:bg-white/10 dark:text-themeTextDark rounded-xl p-3 sm:p-4 text-center shadow">
      <div className="text-2xl sm:text-3xl font-bold">{value}</div>
      <div className="text-xs sm:text-sm mt-1">{label}</div>
    </div>
  );
}
