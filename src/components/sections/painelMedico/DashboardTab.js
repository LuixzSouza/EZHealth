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
          <div className="bg-white dark:bg-white/10 p-4 sm:p-6 rounded-xl shadow mt-4"> {/* Ajuste de padding */}
            <h5 className="text-lg font-semibold text-blue-900 dark:text-gray-200 mb-4">Agendar Nova Consulta</h5>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base"> {/* Ajuste de fonte */}
              Formulário para agendamento rápido de consultas.
              (Ex: campos para paciente, data, hora, motivo)
            </p>
            <ButtonPrimary className="mt-4 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">Confirmar Agendamento</ButtonPrimary> {/* Botão full width em mobile */}
          </div>
        );
      case 'register-screening':
        return (
          <div className="bg-white dark:bg-white/10 p-4 sm:p-6 rounded-xl shadow mt-4"> {/* Ajuste de padding */}
            <h5 className="text-lg font-semibold text-orange-900 dark:text-gray-200 mb-4">Registrar Nova Triagem</h5>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base"> {/* Ajuste de fonte */}
              Interface para registrar dados de uma nova triagem.
              (Ex: campos para informações do paciente, sintomas, sinais vitais)
            </p>
            <ButtonPrimary className="mt-4 bg-orange hover:bg-orange-dark w-full sm:w-auto">Salvar Triagem</ButtonPrimary> {/* Botão full width em mobile */}
          </div>
        );
      case 'new-report':
        return (
          <div className="bg-white dark:bg-white/10 p-4 sm:p-6 rounded-xl shadow mt-4"> {/* Ajuste de padding */}
            <h5 className="text-lg font-semibold text-green-900 dark:text-gray-200 mb-4">Gerar Novo Relatório</h5>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base"> {/* Ajuste de fonte */}
              Opções para gerar diferentes tipos de relatórios médicos.
              (Ex: seleção de paciente, tipo de relatório, período)
            </p>
            <ButtonPrimary className="mt-4 bg-green-600 hover:bg-green-700 w-full sm:w-auto">Gerar Relatório</ButtonPrimary> {/* Botão full width em mobile */}
          </div>
        );
      default: // Aba "Visão Geral" das ações rápidas
        return (
            <div className="bg-white dark:bg-white/10 p-4 sm:p-6 rounded-xl shadow mt-4"> {/* Ajuste de padding */}
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base"> {/* Ajuste de fonte */}
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
        className="mb-3 text-2xl sm:text-3xl" // Ajuste de tamanho do título para mobile
      />
      <ParagraphBlue className="text-sm sm:text-base"> {/* Ajuste de tamanho do parágrafo */}
        Bem-vindo à sua central de controle médico. Abaixo estão os resumos e ações disponíveis.
      </ParagraphBlue>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-6"> {/* Ajuste de gap para mobile */}
        <StatCard label="Pacientes Ativos" value="28" />
        <StatCard label="Consultas Hoje" value="5" />
        <StatCard label="Triagens Pendentes" value="3" />
        <StatCard label="Alertas Críticos" value="1" />
      </div>

      {/* Gráficos */}
      <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6"> {/* Ajuste de margin-top para mobile */}

        {/* Gráfico de Linha - Consultas por Mês */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow p-4 sm:p-6"> {/* Ajuste de padding */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4"> {/* Ajuste flex-col para mobile */}
            <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-orange flex items-center gap-2"> {/* Ajuste de fonte */}
              📊 Consultas por Mês
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">Últimos 6 meses</span> {/* Ajuste de margin-top */}
          </div>

          {/* w-full h-56 já é bom para mobile, mas pode ajustar h- para telas menores se precisar */}
          <div className="w-full h-56 text-black dark:text-gray-300"> 
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={consultasPorMes}>
                <XAxis dataKey="mes" stroke="#9ca3af" tick={{ fill: 'currentColor', fontSize: 12 }} /> {/* Adiciona fill e fontSize para ticks */}
                <YAxis stroke="#9ca3af" tick={{ fill: 'currentColor', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'rgb(255, 255, 255)', border: 'none', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} /> {/* Estilo do tooltip */}
                <Line type="monotone" dataKey="consultas" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pizza - Urgência das Triagens */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow p-4 sm:p-6"> {/* Ajuste de padding */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4"> {/* Ajuste flex-col para mobile */}
            <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-orange flex items-center gap-2"> {/* Ajuste de fonte */}
              🚨 Urgência das Triagens
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">Dados do mês atual</span> {/* Ajuste de margin-top */}
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
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`} // Exibe porcentagem
                  labelLine={false} // Remove a linha do label para evitar bagunça
                >
                  {urgenciasTriagem.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgb(255, 255, 255)', border: 'none', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} /> {/* Estilo do tooltip */}
                <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop: '10px' }} /> {/* Ajusta posição da legenda */}
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Seção de Ações Rápidas como Abas */}
      <div className="mt-8 sm:mt-10"> {/* Ajuste de margin-top */}
        <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-themeTextDark mb-4">Ações Rápidas</h4>
        {/* Usar flex-wrap para que os botões quebrem a linha em telas pequenas */}
        <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700"> 
            <button
                onClick={() => setActiveQuickActionTab('overview')}
                className={`
                    py-2 px-3 text-sm font-medium focus:outline-none flex-grow sm:flex-grow-0 // flex-grow para ocupar espaço em mobile
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
                    py-2 px-3 text-sm font-medium focus:outline-none flex-grow sm:flex-grow-0
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
                    py-2 px-3 text-sm font-medium focus:outline-none flex-grow sm:flex-grow-0
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
                    py-2 px-3 text-sm font-medium focus:outline-none flex-grow sm:flex-grow-0
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
      <div className="mt-8 sm:mt-10 bg-white dark:bg-white/10 rounded-xl shadow p-4 sm:p-6"> {/* Ajuste de padding */}
        <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-themeTextDark mb-4">Notificações recentes</h4>
        
        <ul className="space-y-3 sm:space-y-4"> {/* Ajuste de espaço entre itens */}
          {[
            { icon: "🔔", text: "Nova triagem pendente de João Silva", color: "text-yellow-600" },
            { icon: "📅", text: "Consulta agendada com Maria Oliveira às 14h", color: "text-blue-600" },
            { icon: "📝", text: "Novo relatório médico solicitado", color: "text-green-600" },
            { icon: "✅", text: "Consulta com Pedro Lima finalizada", color: "text-gray-600" },
            { icon: "📬", text: "Mensagem do paciente Lucas Santos", color: "text-purple-600" },
          ].map((notif, index) => (
            <li key={index} className="flex items-start gap-2 sm:gap-3"> {/* Ajuste de gap */}
              <span className={`text-xl ${notif.color} flex-shrink-0`}>{notif.icon}</span> {/* flex-shrink-0 para evitar encolher o ícone */}
              <span className="text-sm text-blue-900 dark:text-themeTextDark leading-tight">{notif.text}</span> {/* leading-tight para ajuste de linha */}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-blue-100 text-blue-900 dark:bg-white/10 dark:text-themeTextDark rounded-xl p-3 sm:p-4 text-center shadow"> {/* Ajuste de padding */}
      <div className="text-2xl sm:text-3xl font-bold">{value}</div> {/* Ajuste de tamanho da fonte */}
      <div className="text-xs sm:text-sm mt-1">{label}</div> {/* Ajuste de tamanho da fonte */}
    </div>
  );
}