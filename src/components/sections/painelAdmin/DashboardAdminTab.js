// src/components/sections/painelAdmin/DashboardAdminTab.js
'use client';

import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const dadosCadastros = [
  { mes: "Jan", medicos: 5, usuarios: 12 },
  { mes: "Fev", medicos: 8, usuarios: 18 },
  { mes: "Mar", medicos: 7, usuarios: 20 },
  { mes: "Abr", medicos: 10, usuarios: 25 },
  { mes: "Mai", medicos: 9, usuarios: 22 },
];

const dadosAtividade = [
  { dia: "Seg", logins: 150, triagens: 70 },
  { dia: "Ter", logins: 180, triagens: 90 },
  { dia: "Qua", logins: 160, triagens: 80 },
  { dia: "Qui", logins: 200, triagens: 100 },
  { dia: "Sex", logins: 190, triagens: 95 },
];

function StatCard({ label, value, description }) {
  return (
    <div className="bg-blue-100 text-blue-900 dark:bg-white/10 dark:text-themeTextDark rounded-xl p-3 sm:p-4 text-center shadow">
      <div className="text-2xl sm:text-3xl font-bold">{value}</div>
      <div className="text-xs sm:text-sm mt-1">{label}</div>
      {description && <p className="text-zinc-500 text-xs mt-1 hidden sm:block">{description}</p>} {/* Descrição opcional, oculta em mobile */}
    </div>
  );
}

export function DashboardAdminTab() {
  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
      <Heading
        as="h2"
        text="Visão Geral Administrativa"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-3 text-2xl sm:text-3xl"
      />
      <ParagraphBlue className="mb-4 sm:mb-6 text-sm sm:text-base">
        Acompanhe as principais métricas e atividades do sistema EZHealth.
      </ParagraphBlue>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-6">
        <StatCard label="Médicos Ativos" value="58" description="Total de profissionais cadastrados." />
        <StatCard label="Usuários Registrados" value="1.240" description="Pacientes e outros usuários." />
        <StatCard label="Triagens Realizadas (Mês)" value="2.5k" description="Estimativa de triagens neste mês." />
        <StatCard label="Sistemas Integrados" value="7" description="Total de integrações com hospitais/clínicas." />
      </div>

      {/* Gráficos de Atividade e Cadastros */}
      <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Linha - Novos Cadastros (Médicos e Usuários) */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-orange flex items-center gap-2">
              📈 Novos Cadastros por Mês
            </h4>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 sm:mt-0">Últimos 5 meses</span>
          </div>
          <div className="w-full h-56 text-black dark:text-zinc-300">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosCadastros}>
                <XAxis dataKey="mes" stroke="#9ca3af" tick={{ fill: 'currentColor', fontSize: 12 }} />
                <YAxis stroke="#9ca3af" tick={{ fill: 'currentColor', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'rgb(255, 255, 255)', border: 'none', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="medicos" stroke="#2563eb" strokeWidth={2} name="Médicos" />
                <Line type="monotone" dataKey="usuarios" stroke="#f47127" strokeWidth={2} name="Usuários" />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Barras - Atividade Diária */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-orange flex items-center gap-2">
              📊 Atividade Diária
            </h4>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 sm:mt-0">Média de atividades na semana</span>
          </div>
          <div className="w-full h-56 text-black dark:text-zinc-300">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosAtividade}>
                <XAxis dataKey="dia" stroke="#9ca3af" tick={{ fill: 'currentColor', fontSize: 12 }} />
                <YAxis stroke="#9ca3af" tick={{ fill: 'currentColor', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'rgb(255, 255, 255)', border: 'none', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="logins" fill="#002157" name="Logins" />
                <Bar dataKey="triagens" fill="#f47127" name="Triagens" />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Notificações e Alertas Administrativos */}
      <div className="mt-8 sm:mt-10 bg-white dark:bg-white/10 rounded-xl shadow p-4 sm:p-6">
        <h4 className="text-lg sm:text-xl font-semibold text-blue-900 dark:text-themeTextDark mb-4">Alertas e Notificações</h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-2 text-sm text-blue-900 dark:text-themeTextDark">
            ⚠️ <span className="font-semibold text-red-600">Alerta Crítico:</span> Falha na sincronização de dados com um hospital parceiro.
          </li>
          <li className="flex items-start gap-2 text-sm text-blue-900 dark:text-themeTextDark">
            ✅ <span className="font-semibold text-green-600">Sucesso:</span> Nova versão do sistema implantada com sucesso.
          </li>
          <li className="flex items-start gap-2 text-sm text-blue-900 dark:text-themeTextDark">
            🔔 <span className="font-semibold text-yellow-600">Aviso:</span> Uso da API do Dialogflow em 80% da cota.
          </li>
        </ul>
      </div>

    </div>
  );
}