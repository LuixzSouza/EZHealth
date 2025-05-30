import { Heading } from "@/components/typography/Heading"; // Usando o componente Heading refatorado
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary"; // Importando o ButtonPrimary

export function RelatoriosTab() {
  const reports = [
    { id: 1, type: "Consulta Geral", patient: "Ana Clara Silva", date: "2025-05-20", file: "relatorio_ana_05-2025.pdf" },
    { id: 2, type: "Exames Laboratoriais", patient: "Bruno Costa", date: "2025-05-15", file: "exames_bruno_05-2025.pdf" },
    { id: 3, type: "Evolução do Tratamento", patient: "Daniel Rocha", date: "2025-05-28", file: "evolucao_daniel_05-2025.pdf" },
    { id: 4, type: "Avaliação Pós-Cirúrgica", patient: "Maria Oliveira", date: "2025-04-10", file: "pos_cirurgico_maria_04-2025.pdf" },
  ];

  const handleDownloadReport = (fileName) => {
    alert(`Simulando download do arquivo: ${fileName}`);
    // Na vida real, aqui você faria uma chamada de API para baixar o arquivo
  };

  const handleGenerateNewReport = () => {
    alert("Abrir modal/formulário para gerar novo relatório!");
    // Aqui você abriria um modal ou navegaria para uma página de geração de relatório
  };

  return (
    <div className="p-6 bg-white dark:bg-themeDark rounded-lg shadow-md">
      <Heading
        as="h2"
        text="Relatórios Médicos"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-4"
      />
      <ParagraphBlue className="mb-6">Acesse ou gere relatórios dos pacientes.</ParagraphBlue>

      <div className="mb-6 text-right">
        <ButtonPrimary onClick={handleGenerateNewReport}>
          + Gerar Novo Relatório
        </ButtonPrimary>
      </div>

      {reports.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Paciente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-white/10 divide-y divide-gray-200 dark:divide-gray-700">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-DarkBlue dark:text-white">
                    {report.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {report.patient}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {new Date(report.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">Nenhum relatório disponível.</p>
      )}
    </div>
  );
}