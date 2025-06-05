// app/painel-medico/pacientes/[id]/page.jsx
import React from 'react';
import Link from 'next/link';

// --- Funções Auxiliares de Fetch de Dados (Server-side) ---

/**
 * Busca uma única triagem pelo seu ID.
 * @param {string} triageId O ID da triagem.
 * @returns {Promise<Object | null>} A triagem encontrada ou null se não for encontrada/erro.
 */
async function getTriageById(triageId) {
  // ... (código existente sem alterações)
  try {
    const res = await fetch(`/api/triagem/${triageId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`[getTriageById] Triagem com ID ${triageId} não encontrada (404).`);
        return null;
      }
      throw new Error(`Erro ao buscar triagem por ID: Status ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`[getTriageById] Falha ao buscar triagem com ID ${triageId}:`, error);
    return null;
  }
}

/**
 * Busca todas as triagens de um paciente específico pelo seu CPF.
 * @param {string} patientCPF O CPF do paciente para buscar.
 * @returns {Promise<Array<Object> | null>} Um array de triagens ou null em caso de erro.
 */
async function getTriagesByPatientCPF(patientCPF) { // RENOMEADA e parâmetro ajustado
  if (!patientCPF) {
    console.warn('[getTriagesByPatientCPF] CPF do Paciente não fornecido.');
    return [];
  }
  try {
    const encodedPatientCPF = encodeURIComponent(patientCPF); // Boa prática para CPFs com caracteres especiais, embora raro.
    // AQUI: A API é chamada com o parâmetro 'cpf'
    const res = await fetch(`/api/triagem?cpf=${encodedPatientCPF}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`[getTriagesByPatientCPF] Nenhuma triagem encontrada para o paciente com CPF ${patientCPF} (404).`);
        return [];
      }
      throw new Error(`Erro ao buscar histórico do paciente por CPF: Status ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`[getTriagesByPatientCPF] Falha ao buscar triagens para o paciente com CPF ${patientCPF}:`, error);
    return null;
  }
}

// --- Componente da Página (Server Component) ---

export default async function PatientProfilePage({ params }) {
  const initialTriageId = params.id;

  if (!initialTriageId) {
    return (
      <CenteredMessage
        title="ID de Triagem Inválido"
        message="Por favor, forneça um ID de triagem válido na URL para ver o perfil do paciente."
        isError={true}
      />
    );
  }

  const initialTriage = await getTriageById(initialTriageId);

  if (!initialTriage) {
    return (
      <CenteredMessage
        title="Triagem Inicial Não Encontrada"
        message={`Não foi possível encontrar a triagem inicial com o ID: ${initialTriageId}. Por favor, verifique o ID.`}
        isError={true}
      />
    );
  }

  // Usando CPF para buscar o histórico
  const pacienteCPFParaQuery = initialTriage.dadosPessoalPaciente?.cpf || initialTriage.cpf;


  if (!pacienteCPFParaQuery) {
    return (
      <CenteredMessage
        title="Dados do Paciente Incompletos"
        // Mensagem ajustada para refletir o uso do CPF
        message="A triagem selecionada não possui CPF do paciente associado, impossibilitando a busca do histórico completo."
        isError={true}
      />
    );
  }

  // Chamando a função correta
  const triagesForThisPatient = await getTriagesByPatientCPF(pacienteCPFParaQuery);

  if (triagesForThisPatient === null) {
    return (
      <CenteredMessage
        title="Erro ao Carregar Histórico Completo"
        message={`Não foi possível carregar o histórico completo de triagens para o paciente. Tente novamente mais tarde.`}
        isError={true}
      />
    );
  }

  const patientDisplayName = initialTriage.dadosPessoalPaciente?.nome || 'Paciente Desconhecido';
  const patientAge = initialTriage.dadosPessoalPaciente?.idade || 'N/A';
  const patientGender = initialTriage.dadosPessoalPaciente?.sexo || 'N/A';

  const riskColorMap = {
    Vermelho: "bg-red-500 text-white",
    Laranja: "bg-orange-500 text-white",
    Amarelo: "bg-yellow-400 text-zinc-800",
    Verde: "bg-green-500 text-white",
    Azul: "bg-blue-500 text-white",
    'N/A': "bg-blue-300 text-zinc-800",
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="bg-white dark:bg-zinc-900 shadow-sm py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/painel-medico" className="flex items-center text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12"/>
            </svg>
            <span className="font-medium text-sm">Voltar ao Painel</span>
          </Link>
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 hidden sm:block">Detalhes do Paciente</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 mb-8 border border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-1">
                {patientDisplayName}
              </h1>
              <p className="text-lg text-zinc-700 dark:text-zinc-300">
                Idade: <span className="font-semibold">{patientAge}</span> | Gênero: <span className="font-semibold">{patientGender}</span>
                 {pacienteCPFParaQuery && <span className="block text-sm text-zinc-500 dark:text-zinc-400 mt-1">CPF: {pacienteCPFParaQuery}</span>} {/* Mostrando CPF */}
              </p>
            </div>
          </div>
        </section>

        {/* SEÇÃO DA TABELA DE HISTÓRICO (código da tabela que você já tem) */}
        <section className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 border border-zinc-100 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-zinc-700 dark:text-zinc-400 mb-6 border-b pb-4 border-zinc-200 dark:border-zinc-700">
            Histórico de Triagens
          </h2>
          {triagesForThisPatient && triagesForThisPatient.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                <thead className="bg-zinc-50 dark:bg-zinc-800">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Data e Hora</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Risco</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Sintomas Principais</th>
                    <th className="relative px-4 py-3"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-700">
                  {triagesForThisPatient
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((triage) => {
                      const classification = triage.classificacaoRisco || { label: 'N/A', color: 'N/A' };
                      let symptoms = triage.sintomas
                        ? Object.entries(triage.sintomas)
                          .filter(([, value]) => typeof value === 'boolean' && value === true)
                          .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))
                          .join(', ')
                        : '';
                      if (triage.sintomas?.outros && triage.sintomas.outros.trim() !== '') {
                        const separator = symptoms ? ', ' : '';
                        symptoms += `${separator}${triage.sintomas.outros.trim()}`;
                      }
                      const readableSymptoms = symptoms.length > 60 ? symptoms.substring(0, 57) + '...' : (symptoms || 'N/A');
                      const badgeClass = riskColorMap[classification.color] || riskColorMap['N/A'];
                      return (
                        <tr key={triage._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-200">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-100">
                            {new Date(triage.createdAt).toLocaleString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>{classification.label}</span>
                          </td>
                          <td className="px-4 py-4 max-w-sm truncate text-sm text-zinc-700 dark:text-zinc-300">{readableSymptoms}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/painel-medico/pacientes/${triage._id}`} className="text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors duration-200 font-semibold">
                              Detalhes
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-zinc-600 dark:text-zinc-400 text-center py-8 text-base">Nenhuma triagem encontrada para este paciente.</p>
          )}
        </section>
      </main>
    </div>
  );
}

// --- Componente Auxiliar para Mensagens Centrais ---
// Nenhuma alteração necessária neste componente para as solicitações.
function CenteredMessage({ title, message, isError }) {
  const titleClass = isError ? "text-red-600 dark:text-red-400" : "text-zinc-700 dark:text-zinc-400";
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="bg-white dark:bg-zinc-900 p-10 rounded-xl shadow-lg text-center max-w-md w-full border border-zinc-100 dark:border-zinc-800">
        <h2 className={`text-3xl font-bold mb-4 ${titleClass}`}>{title}</h2>
        <p className="text-zinc-800 dark:text-zinc-200 text-lg mb-6">{message}</p>
        <Link href="/painel-medico" className="inline-block bg-zinc-600 hover:bg-zinc-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2">
          Voltar ao Painel
        </Link>
      </div>
    </div>
  );
}