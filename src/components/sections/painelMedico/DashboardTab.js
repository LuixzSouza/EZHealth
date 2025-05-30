'use client'; // Necessário para usar useState

import { useState } from 'react'; // Importar useState
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { Heading } from "@/components/typography/Heading";

// Grafico
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
const consultasPorMes = [
  { mes: "Jan", consultas: 20 },
  { mes: "Fev", consultas: 35 },
  { mes: "Mar", consultas: 28 },
  { mes: "Abr", consultas: 40 },
  { mes: "Mai", consultas: 33 },
  { mes: "Jun", consultas: 45 },
];

const urgenciasTriagem = [
  { tipo: "Alta", valor: 10 },
  { tipo: "Média", valor: 15 },
  { tipo: "Baixa", valor: 5 },
];

const cores = ["#ef4444", "#f59e0b", "#10b981"]; // Vermelho, Amarelo, Verde


export function DashboardTab() {
  const [activeQuickActionTab, setActiveQuickActionTab] = useState('overview'); // Estado para controlar a aba de ações rápidas

  // Conteúdo para cada aba de ação rápida (simulado)
  const renderQuickActionContent = () => {
    switch (activeQuickActionTab) {
      case 'new-consultation':
        return (
          <div className="bg-white dark:bg-white/10 p-6 rounded-xl shadow mt-4">
            <h5 className="text-lg font-semibold text-blue-900 dark:text-gray-200 mb-4">Agendar Nova Consulta</h5>
            <p className="text-gray-700 dark:text-gray-300">
              Formulário para agendamento rápido de consultas.
              (Ex: campos para paciente, data, hora, motivo)
            </p>
            <ButtonPrimary className="mt-4 bg-blue-600 hover:bg-blue-700">Confirmar Agendamento</ButtonPrimary>
          </div>
        );
      case 'register-screening':
        return (
          <div className="bg-white dark:bg-white/10 p-6 rounded-xl shadow mt-4">
            <h5 className="text-lg font-semibold text-orange-900 dark:text-gray-200 mb-4">Registrar Nova Triagem</h5>
            <p className="text-gray-700 dark:text-gray-300">
              Interface para registrar dados de uma nova triagem.
              (Ex: campos para informações do paciente, sintomas, sinais vitais)
            </p>
            <ButtonPrimary className="mt-4 bg-orange hover:bg-orange-dark">Salvar Triagem</ButtonPrimary>
          </div>
        );
      case 'new-report':
        return (
          <div className="bg-white dark:bg-white/10 p-6 rounded-xl shadow mt-4">
            <h5 className="text-lg font-semibold text-green-900 dark:text-gray-200 mb-4">Gerar Novo Relatório</h5>
            <p className="text-gray-700 dark:text-gray-300">
              Opções para gerar diferentes tipos de relatórios médicos.
              (Ex: seleção de paciente, tipo de relatório, período)
            </p>
            <ButtonPrimary className="mt-4 bg-green-600 hover:bg-green-700">Gerar Relatório</ButtonPrimary>
          </div>
        );
      default: // Aba "Visão Geral" das ações rápidas (pode ser vazia ou ter um texto introdutório)
        return (
            <div className="bg-white dark:bg-white/10 p-6 rounded-xl shadow mt-4">
                <p className="text-gray-700 dark:text-gray-300">
                    Selecione uma das opções acima para realizar uma ação rápida.
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
        className="mb-4"
      />
      <ParagraphBlue>
        Bem-vindo à sua central de controle médico. Abaixo estão os resumos e ações disponíveis.
      </ParagraphBlue>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        <StatCard label="Pacientes Ativos" value="28" />
        <StatCard label="Consultas Hoje" value="5" />
        <StatCard label="Triagens Pendentes" value="3" />
        <StatCard label="Alertas Críticos" value="1" />
      </div>

      {/* Gráficos */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Gráfico de Linha - Consultas por Mês */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-blue-900 dark:text-orange flex items-center gap-2">
              📊 Consultas por Mês
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">Últimos 6 meses</span>
          </div>

          <div className="w-full h-56 text-black">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={consultasPorMes}>
                <XAxis dataKey="mes" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="consultas" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pizza - Urgência das Triagens */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-blue-900 dark:text-orange flex items-center gap-2">
              🚨 Urgência das Triagens
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">Dados do mês atual</span>
          </div>

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
                  label
                >
                  {urgenciasTriagem.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Seção de Ações Rápidas como Abas */}
      <div className="mt-10">
        <h4 className="text-lg font-semibold text-blue-900 dark:text-themeTextDark mb-4">Ações Rápidas</h4>
        <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setActiveQuickActionTab('overview')}
                className={`
                    py-2 px-4 text-sm font-medium focus:outline-none
                    ${activeQuickActionTab === 'overview'
                        ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }
                    transition-colors duration-200
                `}
            >
                Visão Geral
            </button>
            <button
                onClick={() => setActiveQuickActionTab('new-consultation')}
                className={`
                    py-2 px-4 text-sm font-medium focus:outline-none
                    ${activeQuickActionTab === 'new-consultation'
                        ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }
                    transition-colors duration-200
                `}
            >
                Nova Consulta
            </button>
            <button
                onClick={() => setActiveQuickActionTab('register-screening')}
                className={`
                    py-2 px-4 text-sm font-medium focus:outline-none
                    ${activeQuickActionTab === 'register-screening'
                        ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }
                    transition-colors duration-200
                `}
            >
                Registrar Triagem
            </button>
            <button
                onClick={() => setActiveQuickActionTab('new-report')}
                className={`
                    py-2 px-4 text-sm font-medium focus:outline-none
                    ${activeQuickActionTab === 'new-report'
                        ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }
                    transition-colors duration-200
                `}
            >
                Novo Relatório
            </button>
        </div>
        {renderQuickActionContent()} {/* Conteúdo da aba ativa */}
      </div>

      {/* Notificações Recentes */}
      <div className="mt-10 bg-white dark:bg-white/10 rounded-xl shadow p-6">
        <h4 className="text-lg font-semibold text-blue-900 dark:text-themeTextDark mb-4">Notificações recentes</h4>
        
        <ul className="space-y-4">
          {[
            { icon: "🔔", text: "Nova triagem pendente de João Silva", color: "text-yellow-600" },
            { icon: "📅", text: "Consulta agendada com Maria Oliveira às 14h", color: "text-blue-600" },
            { icon: "📝", text: "Novo relatório médico solicitado", color: "text-green-600" },
            { icon: "✅", text: "Consulta com Pedro Lima finalizada", color: "text-gray-600" },
            { icon: "📬", text: "Mensagem do paciente Lucas Santos", color: "text-purple-600" },
          ].map((notif, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className={`text-xl ${notif.color}`}>{notif.icon}</span>
              <span className="text-sm text-blue-900 dark:text-themeTextDark">{notif.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-blue-100 text-blue-900 dark:bg-white/10 dark:text-themeTextDark rounded-xl p-4 text-center shadow">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm mt-1">{label}</div>
    </div>
  );
}