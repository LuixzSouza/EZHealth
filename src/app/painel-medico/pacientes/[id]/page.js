// ✅ SUBSTITUA O CONTEÚDO DO SEU ARQUIVO POR ESTE:
// app/painel-medico/pacientes/[id]/page.jsx

import React from 'react';
import Link from 'next/link';

// --- Função Auxiliar de Fetch de Dados (sem alterações) ---
async function getPatientProfileData(patientId) {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const [patientRes, triagesRes, appointmentsRes] = await Promise.all([
      fetch(`${apiBaseUrl}/api/patients/${patientId}`, { cache: 'no-store' }),
      fetch(`${apiBaseUrl}/api/triages?patientId=${patientId}`, { cache: 'no-store' }),
      fetch(`${apiBaseUrl}/api/agenda?patientId=${patientId}`, { cache: 'no-store' })
    ]);

    if (!patientRes.ok) {
      if (patientRes.status === 404) return { error: `Paciente com ID ${patientId} não foi encontrado.` };
      throw new Error(`Falha ao buscar dados do paciente (status: ${patientRes.status})`);
    }
    if (!triagesRes.ok) throw new Error(`Falha ao buscar histórico de triagens (status: ${triagesRes.status})`);
    if (!appointmentsRes.ok) throw new Error(`Falha ao buscar agendamentos (status: ${appointmentsRes.status})`);
    
    const patientResult = await patientRes.json();
    const triagesResult = await triagesRes.json();
    const appointmentsResult = await appointmentsRes.json();
    
    if (!patientResult.success) throw new Error(patientResult.message || 'API de pacientes retornou um erro.');

    return {
      patient: patientResult.data,
      triages: triagesResult.success ? triagesResult.data : [],
      appointments: appointmentsResult.success ? appointmentsResult.data : []
    };
  } catch (error) {
    return { error: error.message || 'Ocorreu um erro desconhecido.' };
  }
}

// --- Componente da Página (Server Component) ---

// ✅ MUDANÇA PRINCIPAL AQUI:
// Em vez de ({ params }), usamos ({ params: { id } }) para pegar o ID diretamente.
export default async function PatientProfilePage({ params: { id } }) {
  // Agora usamos a variável 'id' que já foi extraída.
  const { patient, triages, appointments, error } = await getPatientProfileData(id);

  if (error) {
    return <CenteredMessage title="Erro ao Carregar" message={error} isError={true} />;
  }

  const riskColorMap = {
    red: "bg-red-600", orange: "bg-orange-600", yellow: "bg-yellow-500", green: "bg-green-600", blue: "bg-blue-600",
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950">
      <header className="bg-white dark:bg-zinc-900 shadow-sm py-4 px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/painel-medico" className="text-blue-600 hover:underline">← Voltar para a Lista</Link>
          <h1 className="text-xl font-bold">Perfil do Paciente</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <section className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-4xl font-extrabold">{patient.nome}</h2>
          <p className="text-lg text-zinc-600 mt-2">CPF: {patient.cpf}</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <h3 className="text-2xl font-bold mb-4">Histórico de Triagens</h3>
            <div className="space-y-4">
              {triages.length > 0 ? triages.map(triage => (
                <div key={triage._id} className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow">
                  <p>{new Date(triage.createdAt).toLocaleString('pt-BR')}</p>
                  <span className={`inline-block px-3 py-1 mt-2 text-sm text-white rounded-full ${riskColorMap[triage.classificacao.color]}`}>
                    {triage.classificacao.label}
                  </span>
                </div>
              )) : <p className="text-center py-8">Nenhuma triagem encontrada.</p>}
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4">Consultas</h3>
            <div className="space-y-4">
              {appointments.length > 0 ? appointments.map(app => (
                <div key={app._id} className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow">
                  <p className="font-semibold">{new Date(app.date).toLocaleString('pt-BR')}</p>
                  <p>Com: Dr(a). {app.doctorId?.nome}</p>
                  <p>Status: {app.status}</p>
                </div>
              )) : <p className="text-center py-8">Nenhuma consulta encontrada.</p>}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// --- Componentes Auxiliares (sem alterações) ---
function CenteredMessage({ title, message, isError }) {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md w-full">
                <h2 className={`text-3xl font-bold mb-4 ${isError ? "text-red-600" : "text-zinc-700"}`}>{title}</h2>
                <p className="text-lg mb-6">{message}</p>
                <Link href="/painel-medico" className="inline-block bg-zinc-600 text-white font-semibold py-3 px-6 rounded-lg">Voltar ao Painel</Link>
            </div>
        </div>
    );
}
