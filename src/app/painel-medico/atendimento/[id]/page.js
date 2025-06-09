// ✅ PASSO 1: CRIE ESTE NOVO ARQUIVO NESTE CAMINHO:
// app/painel-medico/atendimento/[id]/page.jsx

import React from 'react';
import Link from 'next/link';
import { ButtonPrimary } from '@/components/theme/ButtonPrimary';

// --- Função para buscar os dados da triagem no servidor ---
async function getAtendimentoById(id) {
  try {
    // Usar uma variável de ambiente é a melhor prática para a URL base da API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/api/triagem/${id}`, { cache: "no-store" });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Falha ao buscar atendimento.");
    }

    const result = await res.json();
    if (!result.success) throw new Error(result.message);
    
    return result.data;
  } catch (error) {
    console.error("Falha ao buscar atendimento:", error);
    return { error: error.message }; // Retorna um objeto de erro
  }
}

// --- Componentes Auxiliares de UI ---
function InfoCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-3 border-b border-zinc-200 dark:border-zinc-700 pb-2">{title}</h3>
      <div className="text-zinc-700 dark:text-zinc-200 text-sm space-y-2">{children}</div>
    </div>
  );
}

function CenteredMessage({ title, message, isError }) {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="bg-white dark:bg-zinc-900 p-10 rounded-xl shadow-lg text-center max-w-md w-full">
                <h2 className={`text-3xl font-bold mb-4 ${isError ? "text-red-600" : "text-zinc-700"}`}>{title}</h2>
                <p className="text-lg mb-6">{message}</p>
                <Link href="/painel-medico" className="inline-block bg-zinc-600 text-white font-semibold py-3 px-6 rounded-lg">Voltar ao Painel</Link>
            </div>
        </div>
    );
}

const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

// --- Componente Principal da Página ---
export default async function AtendimentoPage({ params }) {
  const { id } = params;
  const atendimento = await getAtendimentoById(id);

  if (atendimento?.error) {
    return <CenteredMessage title="Erro ao Carregar" message={atendimento.error} isError={true} />;
  }

  const paciente = atendimento.patientId || {};
  const classificacao = atendimento.classificacao || {};
  const atendimentoInfo = atendimento.atendimentoInfo || {};
  const sinaisVitais = atendimento.sinaisVitais || {};

  const riskColorMap = {
    red: "bg-red-600 text-white", orange: "bg-orange-600 text-white",
    yellow: "bg-yellow-500 text-zinc-950", green: "bg-green-600 text-white",
    blue: "bg-blue-600 text-white",
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="bg-white dark:bg-zinc-900 shadow-sm py-4 px-6 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/painel-medico" className="text-blue-600 hover:underline">← Voltar ao Painel</Link>
          <span className="text-lg font-semibold">Atendimento ao Paciente</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 border">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-extrabold">{paciente.nome || 'Paciente não identificado'}</h1>
                <p className="text-lg text-zinc-600 mt-2">
                  {calculateAge(paciente.dataNascimento)} anos | CPF: {paciente.cpf || 'N/A'}
                </p>
              </div>
              <div className={`text-lg font-bold px-4 py-2 rounded-full whitespace-nowrap ${riskColorMap[classificacao.color] || 'bg-zinc-400'}`}>
                  {classificacao.label}
              </div>
            </div>
            <div className="mt-6 border-t pt-4">
              <p><strong>Queixa Principal:</strong> {atendimento.sintomas?.outros || 'Não especificado'}</p>
              <p><strong>Tempo de Sintomas:</strong> {atendimento.tempoSintomas || 'N/A'}</p>
            </div>
          </section>

          <section className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 border">
             <h2 className="text-2xl font-bold mb-4">Diagnóstico e Prescrição</h2>
             <form className="space-y-4">
                <div>
                    <label htmlFor="diagnostico" className="block text-sm font-medium">Diagnóstico</label>
                    <textarea id="diagnostico" rows="4" className="mt-1 block w-full input-style" placeholder="Descreva o diagnóstico do paciente..."></textarea>
                </div>
                 <div>
                    <label htmlFor="prescricao" className="block text-sm font-medium">Prescrição</label>
                    <textarea id="prescricao" rows="4" className="mt-1 block w-full input-style" placeholder="Liste os medicamentos e dosagens..."></textarea>
                </div>
                <div className="flex justify-end gap-4">
                    <ButtonPrimary>Salvar e Finalizar Atendimento</ButtonPrimary>
                </div>
             </form>
          </section>
        </div>

        <aside className="lg:col-span-1 space-y-6">
            <InfoCard title="Sinais Vitais">
                <p><strong>Temperatura:</strong> {sinaisVitais.temperatura || '-'} °C</p>
                <p><strong>Pressão:</strong> {sinaisVitais.pressao || '-'} mmHg</p>
                <p><strong>Frequência:</strong> {sinaisVitais.frequencia || '-'} bpm</p>
                <p><strong>Saturação:</strong> {sinaisVitais.saturacao || '-'} %</p>
            </InfoCard>
            <InfoCard title="Histórico do Paciente">
                 <Link href={`/painel-medico/pacientes/${paciente._id}`} className="text-blue-500 hover:underline">Ver histórico completo →</Link>
            </InfoCard>
            <InfoCard title="Info do Atendimento">
                <p><strong>Senha:</strong> {atendimentoInfo.senha || '-'}</p>
                <p><strong>Sala:</strong> {atendimentoInfo.sala || '-'}</p>
                <p><strong>Médico:</strong> {atendimentoInfo.medicoId?.nome || 'Você'}</p>
            </InfoCard>
        </aside>
      </main>
    </div>
  );
}