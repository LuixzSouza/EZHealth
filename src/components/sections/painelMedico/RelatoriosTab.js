// components/tabs/RelatoriosTab.jsx (VERSÃO REATORADA)
'use client';

import { useState, useEffect } from "react";
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";

export function RelatoriosTab() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ MUDANÇA 1: Usando a URL relativa para a API.
        const response = await fetch('/api/reports');
        if (!response.ok) {
          throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // ✅ MUDANÇA 2: Tratando a resposta no formato { success, data }.
        if (result.success) {
            setReports(result.data);
        } else {
            throw new Error(result.message || "Falha ao carregar relatórios.");
        }

      } catch (err) {
        console.error("Erro ao buscar relatórios:", err);
        setError("Não foi possível carregar os relatórios. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownloadReport = (fileUrl) => {
    // A URL do arquivo já vem correta da API, então só abrimos.
    window.open(fileUrl, '_blank');
  };

  const handleGenerateNewReport = () => {
    // Futuramente, isso pode abrir um modal para selecionar filtros para um novo relatório.
    alert("Funcionalidade para gerar relatórios customizados em breve!");
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
      <Heading
        as="h2"
        text="Relatórios Médicos"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-3 text-2xl sm:text-3xl"
      />
      <ParagraphBlue className="mb-6">Acesse ou gere relatórios dos pacientes.</ParagraphBlue>

      <div className="mb-6 text-right">
        <ButtonPrimary onClick={handleGenerateNewReport} className="w-full sm:w-auto">
          + Gerar Novo Relatório
        </ButtonPrimary>
      </div>

      {loading ? (
        <p className="text-zinc-500 text-center py-8">Carregando relatórios...</p>
      ) : error ? (
        <p className="text-red-500 text-center py-8">{error}</p>
      ) : reports.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-zinc-50 dark:bg-zinc-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Data</th>
                <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-white/10 divide-y divide-zinc-200 dark:divide-zinc-700">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-DarkBlue dark:text-white">{report.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">{report.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">
                    {/* Adicionado fallback para o caso de a data ser inválida */}
                    {report.date !== 'N/A' ? new Date(report.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDownloadReport(report.file)}
                      className="underline text-blue-600 hover:text-blue-900 dark:text-orange"
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
        <p className="text-zinc-500 text-center py-8">Nenhum relatório disponível.</p>
      )}
    </div>
  );
}
