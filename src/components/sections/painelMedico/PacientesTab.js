// components/tabs/PacientesTab.jsx (VERSÃO REATORADA)
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";

// Função para calcular a idade a partir da data de nascimento
const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

export function PacientesTab() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchPatients() {
      try {
        setLoading(true);
        setError(null);

        // ✅ MUDANÇA PRINCIPAL: Buscamos diretamente da API de pacientes.
        // A API agora nos dá uma lista limpa e única de pacientes.
        const response = await fetch('/api/patients');
        
        if (!response.ok) {
          throw new Error(`Erro ao carregar pacientes: Status ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            // A API já retorna os pacientes ordenados, mas podemos reordenar se necessário.
            setPatients(result.data);
        } else {
            throw new Error(result.message || "Falha ao buscar dados dos pacientes.");
        }

      } catch (err) {
        console.error('Erro ao buscar pacientes:', err);
        setError('Não foi possível carregar a lista de pacientes. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, []);

  const handleViewPatientProfile = (patientId) => {
    // ✅ CORREÇÃO: Navegamos usando o _id único do paciente, não mais um ID de triagem.
    router.push(`/painel-medico/pacientes/${patientId}`);
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md">
      <Heading
        as="h2"
        text="Lista de Pacientes"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-3 text-2xl sm:text-3xl"
      />
      <ParagraphBlue className="mb-4 sm:mb-6 text-sm sm:text-base">
        Visualize a lista de todos os pacientes cadastrados no sistema.
      </ParagraphBlue>

      {loading ? (
        <p className="text-zinc-500 dark:text-zinc-400 text-center py-6 sm:py-8 text-lg">
          Carregando lista de pacientes...
        </p>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400 text-center py-6 sm:py-8 text-lg">
          {error}
        </p>
      ) : patients.length > 0 ? (
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
                  Data de Cadastro
                </th>
                <th className="relative px-3 py-2 sm:px-6 sm:py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-700">
              {patients.map((patient) => (
                <tr
                  key={patient._id} // ✅ Usamos o ID único do paciente como chave.
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors duration-200 ease-in-out"
                >
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-blue-900 dark:text-white">
                    {patient.nome}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">
                    {calculateAge(patient.dataNascimento)}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">
                    {patient.sexo || 'N/A'}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">
                    {new Date(patient.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewPatientProfile(patient._id)}
                      className="text-orange-600 hover:text-orange-800 dark:text-orange dark:hover:text-orange/80 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
                      aria-label={`Ver perfil de ${patient.nome}`}
                    >
                      Ver Perfil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-zinc-500 dark:text-zinc-400 text-center py-6 sm:py-8 text-lg">
          Nenhum paciente cadastrado encontrado.
        </p>
      )}
    </div>
  );
}
