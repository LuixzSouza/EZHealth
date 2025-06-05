'use client'; // Adicione se for um componente de cliente

import { useState, useEffect } from "react";
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";

export function RelatoriosTab() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar os relatórios da API
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://ezhealthluixz.netlify.app/api/reports'); // Chamada para a nova API de listagem de relatórios
      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }
      const data = await response.json();
      setReports(data);
    } catch (err) {
      console.error("Erro ao buscar relatórios:", err);
      setError("Não foi possível carregar os relatórios. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []); // Executa apenas uma vez ao montar o componente

  const handleDownloadReport = (fileUrl) => {
    // Abre a URL do arquivo PDF em uma nova aba, o navegador cuidará do download
    window.open(fileUrl, '_blank');
  };

  const handleGenerateNewReport = () => {
    alert("Abrir modal/formulário para gerar novo relatório! (Isso exigiria um formulário para selecionar a triagem ou paciente)");
    // Em uma aplicação real, você pode ter um modal aqui para o médico selecionar
    // um paciente ou uma triagem específica para gerar um relatório "on demand".
    // Por enquanto, a lista já mostra todas as triagens disponíveis como relatórios.
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
      <Heading
        as="h2"
        text="Relatórios Médicos"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-3 text-2xl sm:text-3xl"
      />
      <ParagraphBlue className="mb-4 sm:mb-6 text-sm sm:text-base">Acesse ou gere relatórios dos pacientes.</ParagraphBlue>

      <div className="mb-4 sm:mb-6 text-right">
        <ButtonPrimary onClick={handleGenerateNewReport} className="w-full sm:w-auto">
          + Gerar Novo Relatório
        </ButtonPrimary>
      </div>

      {loading ? (
        <p className="text-zinc-500 dark:text-zinc-400 text-center py-6 sm:py-8 text-sm sm:text-base">Carregando relatórios...</p>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400 text-center py-6 sm:py-8 text-sm sm:text-base">{error}</p>
      ) : reports.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-zinc-50 dark:bg-zinc-700">
              <tr>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                  Paciente
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="relative px-3 py-2 sm:px-6 sm:py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-white/10 divide-y divide-zinc-200 dark:divide-zinc-700">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-DarkBlue dark:text-white">
                    {report.type}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">
                    {report.patient}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">
                    {new Date(report.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDownloadReport(report.file)}
                      className="underline text-blue-600 hover:text-blue-900 dark:text-orange dark:hover:text-orange/70 focus:outline-none"
                    >
                      Baixar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-zinc-500 dark:text-zinc-400 text-center py-6 sm:py-8 text-sm sm:text-base">Nenhum relatório disponível.</p>
      )}
    </div>
  );
}