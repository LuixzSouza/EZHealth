// components/DashboardTab.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { Heading } from "@/components/typography/Heading";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

// --- (HELPER) Hook customizado para buscar dados ---
// Este hook simplifica a lógica de fetch, evitando repetição de código.
function useFetchData(apiUrl) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      // Usamos URLs relativas, que funcionam tanto em dev quanto em prod.
      const resp = await fetch(apiUrl);
      if (!resp.ok) {
        throw new Error(`Erro HTTP: ${resp.status}`);
      }
      const result = await resp.json();
      
      // ANTES: O frontend esperava os dados diretamente.
      // DEPOIS: A nova API retorna { success, data }. Verificamos o sucesso
      // e pegamos os dados de dentro do objeto `data`.
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.message || 'A API retornou um erro.');
      }
    } catch (err) {
      console.error(`Erro ao buscar dados de ${apiUrl}:`, err);
      setError('Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiUrl]);

  return { data, loading, error, refetch: fetchData }; // Retornamos uma função `refetch` para atualizações
}


// --- Componentes para as Ações Rápidas (Agora mais inteligentes) ---

const OverviewContent = ({ stats, loading, error }) => (
  <div className="bg-white dark:bg-white/10 p-4 sm:p-6 rounded-b-xl shadow mt-4">
    <h5 className="text-lg font-semibold text-blue-900 dark:text-zinc-200 mb-4">
      Visão Geral do Sistema
    </h5>
    {loading ? (
      <p className="text-zinc-500 dark:text-zinc-400 text-center py-3">Carregando resumo...</p>
    ) : error ? (
      <p className="text-red-500 dark:text-red-400 text-center py-3">{error}</p>
    ) : (
      <>
        <p className="text-zinc-700 dark:text-zinc-300 text-sm sm:text-base">
          Resumo rápido do status atual do sistema.
        </p>
        <ul className="list-disc list-inside text-zinc-700 dark:text-zinc-300 mt-3 space-y-1">
          <li>Pacientes Ativos: <strong className="text-blue-600 dark:text-blue-400">{stats?.pacientesAtivos}</strong></li>
          <li>Consultas Hoje: <strong className="text-blue-600 dark:text-blue-400">{stats?.consultasHoje}</strong></li>
          <li>Triagens Pendentes: <strong className="text-orange-600 dark:text-orange-400">{stats?.triagensPendentes}</strong></li>
          <li>Alertas Críticos: <strong className="text-red-600 dark:text-red-400">{stats?.alertasCriticos}</strong></li>
        </ul>
        <ButtonPrimary className="mt-4 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          Ir para o Dashboard Completo
        </ButtonPrimary>
      </>
    )}
  </div>
);

// Formulário de Nova Consulta agora é funcional!
const NewConsultationContent = ({ onAppointmentCreated }) => {
  // Busca pacientes e médicos para preencher os <select>
  const { data: patients, loading: loadingPatients } = useFetchData('/api/patients');
  const { data: doctors, loading: loadingDoctors } = useFetchData('/api/medicos?status=Ativo');

  // Estados do formulário
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [consultationDate, setConsultationDate] = useState('');
  const [consultationTime, setConsultationTime] = useState('');
  const [description, setDescription] = useState('');
  
  // Estado para feedback ao usuário
  const [submitStatus, setSubmitStatus] = useState({ message: '', error: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ message: 'Agendando...', error: false });

    // Combina data e hora para criar um objeto Date completo
    const fullDate = new Date(`${consultationDate}T${consultationTime}`);
    
    const payload = {
      patientId,
      doctorId,
      date: fullDate.toISOString(),
      description,
      status: 'Agendado'
    };

    try {
      const resp = await fetch('/api/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await resp.json();
      if (!result.success) throw new Error(result.message);

      setSubmitStatus({ message: 'Consulta agendada com sucesso!', error: false });
      // Limpa o formulário
      setPatientId(''); setDoctorId(''); setConsultationDate(''); setConsultationTime(''); setDescription('');
      
      // Avisa o componente pai que uma nova consulta foi criada (para atualizar a lista, se necessário)
      if (onAppointmentCreated) onAppointmentCreated();

    } catch (err) {
      setSubmitStatus({ message: `Erro: ${err.message}`, error: true });
    }
  };

  return (
    <div className="bg-white dark:bg-white/10 p-4 sm:p-6 rounded-b-xl shadow mt-4">
      <h5 className="text-lg font-semibold text-blue-900 dark:text-zinc-200 mb-4">Agendar Nova Consulta</h5>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select de Pacientes */}
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Paciente</label>
          <select id="patientId" value={patientId} onChange={(e) => setPatientId(e.target.value)} required className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white">
            <option value="">{loadingPatients ? 'Carregando...' : 'Selecione um paciente'}</option>
            {patients?.map(p => <option key={p._id} value={p._id}>{p.nome}</option>)}
          </select>
        </div>
        {/* Select de Médicos */}
        <div>
          <label htmlFor="doctorId" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Médico</label>
          <select id="doctorId" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white">
            <option value="">{loadingDoctors ? 'Carregando...' : 'Selecione um médico'}</option>
            {doctors?.map(d => <option key={d._id} value={d._id}>{d.nome} - {d.especialidade}</option>)}
          </select>
        </div>

        {/* Inputs de Data e Hora */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="consultationDate" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Data</label>
            <input type="date" id="consultationDate" value={consultationDate} onChange={(e) => setConsultationDate(e.target.value)} required className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white" />
          </div>
          <div>
            <label htmlFor="consultationTime" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Hora</label>
            <input type="time" id="consultationTime" value={consultationTime} onChange={(e) => setConsultationTime(e.target.value)} required className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white" />
          </div>
        </div>

        {/* Motivo da Consulta */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Motivo (Descrição)</label>
          <textarea id="description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full border border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white" placeholder="Descreva o motivo da consulta"></textarea>
        </div>

        <ButtonPrimary type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">Confirmar Agendamento</ButtonPrimary>
        
        {submitStatus.message && (
          <p className={`text-sm mt-2 ${submitStatus.error ? 'text-red-500' : 'text-green-500'}`}>{submitStatus.message}</p>
        )}
      </form>
    </div>
  );
};


// Componentes RegisterScreeningContent e NewReportContent podem ser implementados de forma similar
const RegisterScreeningContent = () => { /* ... implementação futura ... */ return <p className="p-6 text-center text-zinc-500">Formulário de nova triagem em breve.</p>};
const NewReportContent = () => { /* ... implementação futura ... */ return <p className="p-6 text-center text-zinc-500">Formulário de gerar relatório em breve.</p>};

// Mapeamento de Cores para o Gráfico de Pizza
const PIE_COLORS = { 'Vermelho': '#ef4444', 'Laranja': '#f97316', 'Amarelo': '#eab308', 'Verde': '#22c55e', 'Azul': '#3b82f6', 'N/A': '#6b7280' };

// Componente Principal
export function DashboardTab() {
  const [activeQuickActionTab, setActiveQuickActionTab] = useState('overview');

  // --- BUSCA DE DADOS COM O HOOK CUSTOMIZADO ---
  const { data: stats, loading: loadingStats, error: errorStats, refetch: refetchStats } = useFetchData('/api/dashboard-stats');
  const { data: consultasPorMes, loading: loadingConsultas, error: errorConsultas } = useFetchData('/api/consultas-por-mes');
  const { data: urgenciasTriagem, loading: loadingUrgencias, error: errorUrgencias } = useFetchData('/api/urgencias-triagem');
  const { data: recentNotifications, loading: loadingNotifications, error: errorNotifications, refetch: refetchNotifications } = useFetchData('/api/notifications');

  // Atualiza as notificações e as estatísticas a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
        refetchNotifications();
        refetchStats();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetchNotifications, refetchStats]);

  const renderQuickActionContent = () => {
    switch (activeQuickActionTab) {
      case 'overview':
        return <OverviewContent stats={stats} loading={loadingStats} error={errorStats} />;
      case 'new-consultation':
        // Passamos uma função para que o formulário possa "avisar" o dashboard para atualizar os dados
        return <NewConsultationContent onAppointmentCreated={() => refetchStats()} />;
      case 'register-screening':
        return <RegisterScreeningContent />;
      case 'new-report':
        return <NewReportContent />;
      default:
        return <OverviewContent stats={stats} loading={loadingStats} error={errorStats} />;
    }
  };

  const formatNotificationTimestamp = (timestamp) => {
    // ... (lógica de formatação de data mantida)
    const date = new Date(timestamp);
    const now = new Date();
    if(date.toDateString() === now.toDateString()) return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    return date.toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'});
  };

  return (
    <>
      <Heading as="h2" text="Visão Geral" colorClass="dark:text-orangeDark text-orange" className="mb-3 text-2xl sm:text-3xl" />
      <ParagraphBlue className="text-sm sm:text-base">Bem-vindo à sua central de controle médico.</ParagraphBlue>
      
      {/* --- Cards de Estatísticas --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-6">
        {loadingStats ? <p className="col-span-full text-center py-6">Carregando...</p> : (
            <>
              <StatCard label="Pacientes Ativos" value={stats?.pacientesAtivos?.toString() ?? '...'} />
              <StatCard label="Consultas Hoje" value={stats?.consultasHoje?.toString() ?? '...'} />
              <StatCard label="Triagens Pendentes" value={stats?.triagensPendentes?.toString() ?? '...'} />
              <StatCard label="Alertas Críticos" value={stats?.alertasCriticos?.toString() ?? '...'} />
            </>
        )}
      </div>

      {/* --- Gráficos --- */}
      <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Linha */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow p-4 sm:p-6">
          <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-orange">📊 Consultas por Mês</h4>
          {loadingConsultas ? <p className="text-center py-6">Carregando gráfico...</p> : 
            <div className="w-full h-56 text-black dark:text-zinc-300">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={consultasPorMes}><XAxis dataKey="mes" stroke="#9ca3af" tick={{ fill: 'currentColor', fontSize: 12 }} /><YAxis stroke="#9ca3af" tick={{ fill: 'currentColor', fontSize: 12 }} /><Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none' }} /><Line type="monotone" dataKey="consultas" stroke="#2563eb" strokeWidth={3} /></LineChart>
              </ResponsiveContainer>
            </div>
          }
        </div>
        {/* Gráfico de Pizza */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow p-4 sm:p-6">
            <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-orange">🚨 Urgência das Triagens</h4>
            {loadingUrgencias ? <p className="text-center py-6">Carregando gráfico...</p> :
                <div className="w-full h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={urgenciasTriagem} dataKey="valor" nameKey="tipo" cx="50%" cy="50%" outerRadius={70} label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                {urgenciasTriagem.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.tipo] || '#6b7280'} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none' }} />
                            <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop: '10px' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            }
        </div>
      </div>
      
      {/* --- Ações Rápidas --- */}
      <div className="mt-8 sm:mt-10">
        <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-themeTextDark mb-4">Ações Rápidas</h4>
        <div className="flex flex-wrap border-b border-zinc-200 dark:border-zinc-700">
            {['overview', 'new-consultation', 'register-screening', 'new-report'].map((tab, index) => (
                <button key={tab} onClick={() => setActiveQuickActionTab(tab)} className={`py-2 px-3 text-sm font-medium focus:outline-none flex-grow sm:flex-grow-0 transition-colors duration-200 ${activeQuickActionTab === tab ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>
                    {['Visão Geral', 'Nova Consulta', 'Registrar Triagem', 'Novo Relatório'][index]}
                </button>
            ))}
        </div>
        {renderQuickActionContent()}
      </div>

      {/* --- Notificações --- */}
      <div className="mt-8 sm:mt-10 bg-white dark:bg-white/10 rounded-xl shadow p-4 sm:p-6">
        <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-themeTextDark mb-4">Notificações recentes</h4>
        {loadingNotifications ? <p className="text-center py-3">Carregando...</p> : 
          (recentNotifications?.length > 0 ? (
            <ul className="space-y-3 sm:space-y-4">
              {recentNotifications.map((notif) => (
                <li key={notif.id} className="flex items-start gap-2 sm:gap-3">
                  <span className={`text-xl ${notif.color} flex-shrink-0`}>{notif.icon}</span>
                  <span className="text-sm text-blue-900 dark:text-themeTextDark leading-tight">
                    {notif.text}
                    {notif.timestamp && <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">({formatNotificationTimestamp(notif.timestamp)})</span>}
                    {notif.link && <a href={notif.link} className="ml-2 text-blue-600 hover:underline dark:text-blue-400 text-xs">Ver</a>}
                  </span>
                </li>
              ))}
            </ul>
          ) : <p className="text-zinc-500 dark:text-zinc-400 text-center py-3">Nenhuma notificação recente.</p>)
        }
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