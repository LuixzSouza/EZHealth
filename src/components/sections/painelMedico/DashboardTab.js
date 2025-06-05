// components/DashboardTab.js
'use client';

import { useState, useEffect, useRef } from 'react';
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

// Mapeamento de Cores para o Gráfico de Pizza (já existente)
const PIE_COLORS = {
  'Vermelho': '#ef4444', // Vermelho - Red 500
  'Laranja': '#f97316',  // Laranja - Orange 500
  'Amarelo': '#eab308',  // Amarelo - Yellow 500
  'Verde': '#22c55e',    // Verde - Green 500
  'Azul': '#3b82f6',     // Azul - Blue 500
  'N/A': '#6b7280'       // Cinza - Para casos não definidos
};

// --- Componentes para as Ações Rápidas ---

const OverviewContent = ({ stats, loadingStats, errorStats }) => (
  <div className="bg-white dark:bg-white/10 p-4 sm:p-6 rounded-b-xl shadow mt-4">
    <h5 className="text-lg font-semibold text-blue-900 dark:text-zinc-200 mb-4">
      Visão Geral do Sistema
    </h5>
    {loadingStats ? (
      <p className="text-zinc-500 dark:text-zinc-400 text-center py-3">
        Carregando resumo...
      </p>
    ) : errorStats ? (
      <p className="text-red-500 dark:text-red-400 text-center py-3">
        Não foi possível carregar o resumo: {errorStats}
      </p>
    ) : (
      <>
        <p className="text-zinc-700 dark:text-zinc-300 text-sm sm:text-base">
          Aqui você tem um resumo rápido do status atual do sistema.
        </p>
        <ul className="list-disc list-inside text-zinc-700 dark:text-zinc-300 mt-3 space-y-1">
          <li>Pacientes Ativos: <strong className="text-blue-600 dark:text-blue-400">{stats.pacientesAtivos}</strong></li>
          <li>Consultas Agendadas para Hoje: <strong className="text-blue-600 dark:text-blue-400">{stats.consultasHoje}</strong></li>
          <li>Triagens Pendentes: <strong className="text-orange-600 dark:text-orange-400">{stats.triagensPendentes}</strong></li>
          <li>Alertas Críticos: <strong className="text-red-600 dark:text-red-400">{stats.alertasCriticos}</strong></li>
        </ul>
        <ButtonPrimary className="mt-4 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          Ir para o Dashboard Completo
        </ButtonPrimary>
      </>
    )}
  </div>
);

const NewConsultationContent = () => {
  const [patientName, setPatientName] = useState('');
  const [consultationDate, setConsultationDate] = useState('');
  const [consultationTime, setConsultationTime] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você faria a lógica para enviar os dados da nova consulta para o backend
    alert(`Consulta agendada para ${patientName} em ${consultationDate} às ${consultationTime}`);
    // Resetar formulário
    setPatientName('');
    setConsultationDate('');
    setConsultationTime('');
    setMotivo('');
  };

  return (
    <div className="bg-white dark:bg-white/10 p-4 sm:p-6 rounded-b-xl shadow mt-4">
      <h5 className="text-lg font-semibold text-blue-900 dark:text-zinc-200 mb-4">
        Agendar Nova Consulta
      </h5>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="patientName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Nome do Paciente
          </label>
          <input
            type="text"
            id="patientName"
            className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
            placeholder="Nome completo do paciente"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="consultationDate" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Data da Consulta
            </label>
            <input
              type="date"
              id="consultationDate"
              className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
              value={consultationDate}
              onChange={(e) => setConsultationDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="consultationTime" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Hora da Consulta
            </label>
            <input
              type="time"
              id="consultationTime"
              className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
              value={consultationTime}
              onChange={(e) => setConsultationTime(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="motivo" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Motivo da Consulta
          </label>
          <textarea
            id="motivo"
            rows="3"
            className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
            placeholder="Descreva o motivo da consulta"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          ></textarea>
        </div>
        <ButtonPrimary type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          Confirmar Agendamento
        </ButtonPrimary>
      </form>
    </div>
  );
};

const RegisterScreeningContent = () => {
  const [patientName, setPatientName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [riskClassification, setRiskClassification] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar os dados da triagem para o backend
    alert(`Triagem registrada para ${patientName} com risco: ${riskClassification}`);
    // Resetar formulário
    setPatientName('');
    setSymptoms('');
    setRiskClassification('');
  };

  return (
    <div className="bg-white dark:bg-white/10 p-4 sm:p-6 rounded-b-xl shadow mt-4">
      <h5 className="text-lg font-semibold text-orange-900 dark:text-zinc-200 mb-4">
        Registrar Nova Triagem
      </h5>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="triagePatientName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Nome do Paciente
          </label>
          <input
            type="text"
            id="triagePatientName"
            className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
            placeholder="Nome do paciente para triagem"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="symptoms" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Sintomas Principais
          </label>
          <textarea
            id="symptoms"
            rows="3"
            className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
            placeholder="Descreva os sintomas do paciente"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="riskClassification" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Classificação de Risco
          </label>
          <select
            id="riskClassification"
            className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
            value={riskClassification}
            onChange={(e) => setRiskClassification(e.target.value)}
            required
          >
            <option value="">Selecione a classificação</option>
            <option value="Vermelho">Vermelho (Emergência)</option>
            <option value="Laranja">Laranja (Muito Urgente)</option>
            <option value="Amarelo">Amarelo (Urgente)</option>
            <option value="Verde">Verde (Pouco Urgente)</option>
            <option value="Azul">Azul (Não Urgente)</option>
          </select>
        </div>
        <ButtonPrimary type="submit" className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto">
          Salvar Triagem
        </ButtonPrimary>
      </form>
    </div>
  );
};

const NewReportContent = () => {
  const [reportType, setReportType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para gerar o relatório (normalmente abriria uma nova aba ou baixaria um arquivo)
    alert(`Gerando relatório de ${reportType} de ${startDate} a ${endDate}`);
    // Resetar formulário (opcional)
    setReportType('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="bg-white dark:bg-white/10 p-4 sm:p-6 rounded-b-xl shadow mt-4">
      <h5 className="text-lg font-semibold text-green-900 dark:text-zinc-200 mb-4">
        Gerar Novo Relatório
      </h5>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reportType" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Tipo de Relatório
          </label>
          <select
            id="reportType"
            className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            required
          >
            <option value="">Selecione um tipo</option>
            <option value="pacientes">Pacientes</option>
            <option value="consultas">Consultas</option>
            <option value="triagens">Triagens</option>
            <option value="financeiro">Financeiro</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Data de Início
            </label>
            <input
              type="date"
              id="startDate"
              className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Data de Fim
            </label>
            <input
              type="date"
              id="endDate"
              className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        <ButtonPrimary type="submit" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
          Gerar Relatório
        </ButtonPrimary>
      </form>
    </div>
  );
};


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

  // Estados para gráficos
  const [consultasPorMes, setConsultasPorMes] = useState([]);
  const [urgenciasTriagem, setUrgenciasTriagem] = useState([]);
  const [loadingConsultas, setLoadingConsultas] = useState(true);
  const [loadingUrgencias, setLoadingUrgencias] = useState(true);
  const [errorConsultas, setErrorConsultas] = useState(null);
  const [errorUrgencias, setErrorUrgencias] = useState(null);

  // NOVO ESTADO PARA NOTIFICAÇÕES
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [errorNotifications, setErrorNotifications] = useState(null);
  const notificationsIntervalRef = useRef(null); // Ref para o intervalo de notificações

  // --- Funções de Fetch Existentes ---
  // 1) Fetch das estatísticas gerais (mantido)
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

  // 2) Fetch de "consultas por mês" (mantido)
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

  // 3) Fetch de "urgências de triagem" (mantido)
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

  // --- NOVO useEffect para Notificações ---
  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoadingNotifications(true);
        setErrorNotifications(null);
        const resp = await fetch('/api/notifications'); // Novo endpoint
        if (!resp.ok) {
          throw new Error(`Erro HTTP: ${resp.status}`);
        }
        const data = await resp.json();
        setRecentNotifications(data);
      } catch (err) {
        console.error('Erro ao buscar notificações:', err);
        setErrorNotifications('Não foi possível carregar as notificações.');
      } finally {
        setLoadingNotifications(false);
      }
    }

    // Busca inicialmente
    fetchNotifications();

    // Configura o intervalo para buscar notificações a cada 30 segundos (ajuste conforme necessidade)
    notificationsIntervalRef.current = setInterval(fetchNotifications, 30000); // 30 segundos

    // Limpa o intervalo quando o componente é desmontado
    return () => {
      if (notificationsIntervalRef.current) {
        clearInterval(notificationsIntervalRef.current);
        notificationsIntervalRef.current = null;
      }
    };
  }, []); // Executa apenas uma vez na montagem do componente


  // Conteúdo para cada aba de ação rápida (atualizado)
  const renderQuickActionContent = () => {
    switch (activeQuickActionTab) {
      case 'overview':
        return <OverviewContent stats={stats} loadingStats={loadingStats} errorStats={errorStats} />;
      case 'new-consultation':
        return <NewConsultationContent />;
      case 'register-screening':
        return <RegisterScreeningContent />;
      case 'new-report':
        return <NewReportContent />;
      default:
        // Fallback para o caso de um tab inválido (embora os botões previnam isso)
        return <OverviewContent stats={stats} loadingStats={loadingStats} errorStats={errorStats} />;
    }
  };

  // Função auxiliar para formatar o timestamp
  const formatNotificationTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return `Hoje, às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isYesterday) {
      return `Ontem, às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
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

      {/* --- Cards de Estatísticas --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-6">
        {loadingStats ? (
          <div className="col-span-2 md:col-span-4 text-center py-6 text-zinc-500 dark:text-zinc-400">
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

      {/* --- Gráficos --- */}
      <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1) Consultas por Mês */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-orange flex items-center gap-2">
              📊 Consultas por Mês
            </h4>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 sm:mt-0">
              Últimos meses
            </span>
          </div>
          {loadingConsultas ? (
            <p className="text-zinc-500 dark:text-zinc-400 text-center py-6">
              Carregando gráfico...
            </p>
          ) : errorConsultas ? (
            <p className="text-red-500 dark:text-red-400 text-center py-6">
              {errorConsultas}
            </p>
          ) : (
            <div className="w-full h-56 text-black dark:text-zinc-300">
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
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 sm:mt-0">
              Dados de triagens
            </span>
          </div>
          {loadingUrgencias ? (
            <p className="text-zinc-500 dark:text-zinc-400 text-center py-6">
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
                        key={`cell-${entry.tipo}-${index}`}
                        fill={PIE_COLORS[entry.tipo] || PIE_COLORS['N/A']}
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

      {/* --- Ações Rápidas --- */}
      <div className="mt-8 sm:mt-10">
        <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-themeTextDark mb-4">
          Ações Rápidas
        </h4>
        <div className="flex flex-wrap border-b border-zinc-200 dark:border-zinc-700">
          <button
            onClick={() => setActiveQuickActionTab('overview')}
            className={`
              py-2 px-3 text-sm font-medium focus:outline-none flex-grow sm:flex-grow-0
              ${activeQuickActionTab === 'overview'
                ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}
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
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}
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
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}
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
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}
              transition-colors duration-200
            `}
          >
            Novo Relatório
          </button>
        </div>
        {renderQuickActionContent()}
      </div>

      {/* --- Notificações Recentes --- */}
      <div className="mt-8 sm:mt-10 bg-white dark:bg-white/10 rounded-xl shadow p-4 sm:p-6">
        <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-themeTextDark mb-4">
          Notificações recentes
        </h4>
        {loadingNotifications ? (
          <p className="text-zinc-500 dark:text-zinc-400 text-center py-3">
            Carregando notificações...
          </p>
        ) : errorNotifications ? (
          <p className="text-red-500 dark:text-red-400 text-center py-3">
            {errorNotifications}
          </p>
        ) : recentNotifications.length > 0 ? (
          <ul className="space-y-3 sm:space-y-4">
            {recentNotifications.map((notif) => (
              <li key={notif.id} className="flex items-start gap-2 sm:gap-3">
                <span className={`text-xl ${notif.color} flex-shrink-0`}>{notif.icon}</span>
                <span className="text-sm text-blue-900 dark:text-themeTextDark leading-tight">
                  {notif.text}
                  {/* Exibindo a data e hora formatadas da notificação */}
                  {notif.timestamp && (
                    <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
                      ({formatNotificationTimestamp(notif.timestamp)})
                    </span>
                  )}
                  {/* Opcional: link para a notificação */}
                  {notif.link && (
                    <a href={notif.link} className="ml-2 text-blue-600 hover:underline dark:text-blue-400 text-xs">
                      Ver
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400 text-center py-3">
            Nenhuma notificação recente.
          </p>
        )}
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