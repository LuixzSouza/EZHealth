// components/tabs/PacientesTab.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";

export function PacientesTab() {
  const [triagensSummaries, setTriagensSummaries] = useState([]); // Renamed for clarity
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchTriagensAndSummarizePatients() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`https://ezhealthluixz.netlify.app/api/triagem`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Erro ao carregar triagens: Status ${response.status}`);
        }

        const data = await response.json();

        const patientsMap = new Map();
        data.forEach(triagem => {
          const patientName = triagem.dadosPessoalPaciente?.nome || 'Paciente Desconhecido';
          // Use a unique key for the map if possible, e.g., a combination of name and birthday
          // For now, sticking with name as the identifier for the URL, but using _id for internal map key
          // if we want to truly separate individuals with same names in this list.
          // For the purpose of linking to profile page, we'll use the _id of one of their triages.
          const currentTriageDate = triagem.createdAt ? new Date(triagem.createdAt) : null;

          if (!patientsMap.has(patientName)) {
            patientsMap.set(patientName, {
              // We'll pass the _id of the LATEST triage to the profile page
              // This _id will be used to fetch the *initial* triage for full patient details
              linkTriageId: triagem._id,
              name: patientName,
              age: triagem.dadosPessoalPaciente?.idade || 'N/A',
              gender: triagem.dadosPessoalPaciente?.sexo || 'N/A',
              lastTriageDate: currentTriageDate,
              triageCount: 1,
            });
          } else {
            const existingPatient = patientsMap.get(patientName);
            if (currentTriageDate && (!existingPatient.lastTriageDate || currentTriageDate > existingPatient.lastTriageDate)) {
              existingPatient.lastTriageDate = currentTriageDate;
              existingPatient.linkTriageId = triagem._id; // Update to the latest triage's ID
            }
            existingPatient.triageCount++;
            patientsMap.set(patientName, existingPatient);
          }
        });

        const uniquePatients = Array.from(patientsMap.values()).sort((a, b) => {
          if (!a.lastTriageDate && !b.lastTriageDate) return 0;
          if (!a.lastTriageDate) return 1;
          if (!b.lastTriageDate) return -1;
          return b.lastTriageDate.getTime() - a.lastTriageDate.getTime();
        });

        setTriagensSummaries(uniquePatients);
      } catch (err) {
        console.error('Erro ao buscar e resumir triagens:', err);
        setError('Não foi possível carregar a lista de triagens. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchTriagensAndSummarizePatients();
  }, []);

  const handleViewPatientProfile = (triageIdToLink) => {
    // Now we navigate to the patient profile page using the ID of their LATEST triage
    router.push(`/painel-medico/pacientes/${triageIdToLink}`);
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md">
      <Heading
        as="h2"
        text="Pacientes com Histórico de Triagens"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-3 text-2xl sm:text-3xl"
      />
      <ParagraphBlue className="mb-4 sm:mb-6 text-sm sm:text-base">
        Visualize a lista de pacientes que realizaram triagens, com suas últimas interações.
      </ParagraphBlue>

      {loading ? (
        <p className="text-zinc-500 dark:text-zinc-400 text-center py-6 sm:py-8 text-lg" aria-live="polite">
          Carregando histórico de triagens...
        </p>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400 text-center py-6 sm:py-8 text-lg" aria-live="assertive">
          {error}
        </p>
      ) : triagensSummaries.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-zinc-100 dark:bg-zinc-700">
              <tr>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                  Paciente
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                  Idade
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                  Gênero
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                  Última Triagem
                </th>
                 <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                  Nº de Triagens
                </th>
                <th className="relative px-3 py-2 sm:px-6 sm:py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-700">
              {triagensSummaries.map((patientSummary) => (
                <tr
                  key={patientSummary.linkTriageId} // Use a unique ID for the key
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors duration-200 ease-in-out"
                >
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-blue-900 dark:text-white">
                    {patientSummary.name}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">
                    {patientSummary.age}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">
                    {patientSummary.gender}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">
                    {patientSummary.lastTriageDate ? patientSummary.lastTriageDate.toLocaleDateString("pt-BR") : "N/A"}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">
                    {patientSummary.triageCount}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewPatientProfile(patientSummary.linkTriageId)}
                      className="text-orange-600 hover:text-orange-800 dark:text-orange dark:hover:text-orange/80 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
                      aria-label={`Ver histórico de ${patientSummary.name}`}
                    >
                      Ver Histórico
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-zinc-500 dark:text-zinc-400 text-center py-6 sm:py-8 text-lg" aria-live="polite">
          Nenhum paciente com histórico de triagens encontrado.
        </p>
      )}
    </div>
  );
}