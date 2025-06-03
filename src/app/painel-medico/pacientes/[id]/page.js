// app/painel-medico/pacientes/[id]/page.jsx
import React from 'react';
import Link from 'next/link';
import { ObjectId } from 'mongodb'; // Needed if you directly query by _id

// Helper function to fetch a SINGLE triage by its ID
async function getTriageById(triageId) {
  try {
    const res = await fetch(`http://localhost:3000/api/triagem/${triageId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null; // Specific triage not found
      }
      throw new Error(`Erro ao buscar triagem por ID: Status ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Falha ao buscar triagem por ID:', error);
    return null;
  }
}

// Helper function to fetch triages by patient name
async function getTriagesByPatientName(patientName) {
  try {
    const res = await fetch(`http://localhost:3000/api/triagem?patientName=${encodeURIComponent(patientName)}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      // It's possible to get 404 if no triages match the name, return empty array
      if (res.status === 404) return [];
      throw new Error(`Erro ao buscar histórico do paciente por nome: Status ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Falha ao buscar triagens por nome de paciente:', error);
    return null;
  }
}

export default async function PatientProfilePage({ params }) {
  const initialTriageId = params.id; // This is now a triage ID from the URL

  if (!initialTriageId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-6">
        <div className="bg-white dark:bg-zinc-700 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-500 mb-4">ID de Triagem Inválido</h2>
          <p className="text-gray-700 dark:text-zinc-200">
            Por favor, forneça um ID de triagem válido na URL para ver o perfil do paciente.
          </p>
        </div>
      </div>
    );
  }

  // 1. Fetch the initial triage by its ID
  const initialTriage = await getTriageById(initialTriageId);

  if (!initialTriage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-6">
        <div className="bg-white dark:bg-zinc-700 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Triagem Inicial Não Encontrada</h2>
          <p className="text-gray-700 dark:text-zinc-200">
            Não foi possível encontrar a triagem inicial com o ID{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {initialTriageId}
            </span>. Por favor, verifique o ID.
          </p>
        </div>
      </div>
    );
  }

  // Now that we have a valid initial triage, get the patient's name from it
  const patientNameForQuery = initialTriage.dadosPessoalPaciente?.nome;

  if (!patientNameForQuery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-6">
        <div className="bg-white dark:bg-zinc-700 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Dados do Paciente Incompletos</h2>
          <p className="text-gray-700 dark:text-zinc-200">
            A triagem selecionada não possui o nome do paciente, impossibilitando a busca do histórico.
          </p>
        </div>
      </div>
    );
  }

  // 2. Use the patient's name from the initial triage to fetch ALL their triages
  const triagesForThisPatient = await getTriagesByPatientName(patientNameForQuery);

  if (triagesForThisPatient === null) { // Indicates a critical error during second fetch
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-6">
        <div className="bg-white dark:bg-zinc-700 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Erro ao Carregar Histórico Completo</h2>
          <p className="text-gray-700 dark:text-zinc-200">
            Não foi possível carregar o histórico completo de triagens para {patientNameForQuery}.
          </p>
        </div>
      </div>
    );
  }

  // Patient details will now consistently come from the initialTriage
  const patientDisplayName = initialTriage.dadosPessoalPaciente?.nome || 'Paciente Desconhecido';
  const patientAge = initialTriage.dadosPessoalPaciente?.idade || 'N/A';
  const patientGender = initialTriage.dadosPessoalPaciente?.sexo || 'N/A';

  // Mapeamento de cores para a classificação de risco (para estilização direta)
  const riskColorMap = {
    Vermelho: "bg-red-600 text-white",
    Laranja: "bg-orange-600 text-white",
    Amarelo: "bg-yellow-500 text-black",
    Verde: "bg-green-600 text-white",
    Azul: "bg-blue-600 text-white",
    gray: "bg-zinc-400 text-zinc-800",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 pb-8">
      {/* Header de Navegação */}
      <header className="bg-blue-600 dark:bg-blue-900 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/painel-medico" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
            <span className="font-semibold">Voltar ao Painel</span>
          </Link>
          <span className="text-lg font-bold hidden sm:block">Perfil do Paciente</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden mt-8">
        {/* Patient Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 dark:from-blue-700 dark:to-teal-700 text-white p-6 sm:p-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
            Perfil do Paciente: {patientDisplayName}
          </h1>
          <p className="text-lg">
            Idade: {patientAge} | Gênero: {patientGender}
          </p>
        </div>

        {/* Patient History Section */}
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-6 border-b pb-3 border-orange-200 dark:border-orange-700">
            Histórico de Triagens
          </h2>

          {triagesForThisPatient.length > 0 ? (
            <div className="overflow-x-auto rounded-lg shadow-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                <thead className="bg-gray-100 dark:bg-zinc-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-300 uppercase tracking-wider"
                    >
                      Data da Triagem
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-300 uppercase tracking-wider"
                    >
                      Classificação de Risco
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-300 uppercase tracking-wider"
                    >
                      Sintomas Principais
                    </th>
                    <th className="relative px-3 py-2 sm:px-6 sm:py-3">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                  {triagesForThisPatient
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by most recent triage first
                    .map((triage) => {
                      const classification = triage.classificacaoRisco || { label: 'N/A', color: 'gray' };
                      const symptoms = triage.sintomas
                        ? Object.entries(triage.sintomas)
                            .filter(([key, value]) => typeof value === 'boolean' && value === true)
                            .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))
                            .join(', ')
                        : 'N/A';
                      const readableSymptoms = symptoms.length > 50 ? symptoms.substring(0, 47) + '...' : symptoms;

                      const badgeClass = riskColorMap[classification.color] || riskColorMap.gray;

                      return (
                        <tr
                          key={triage._id}
                          className="hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors duration-200 ease-in-out"
                        >
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-blue-900 dark:text-white">
                            {new Date(triage.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}>
                              {classification.label}
                            </span>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 max-w-xs truncate text-sm text-gray-600 dark:text-zinc-300">
                            {readableSymptoms || 'N/A'}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/painel-medico/${triage._id}`} className="text-orange-600 hover:text-orange-800 dark:text-orange dark:hover:text-orange/80 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded">
                                Ver Triagem
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-zinc-400 text-center py-6 sm:py-8 text-lg">
              Nenhuma triagem encontrada para este paciente.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}