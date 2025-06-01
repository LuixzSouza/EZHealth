import { Heading } from "@/components/typography/Heading"; // Usando o componente Heading refatorado
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary"; // Importando o ButtonPrimary

export function TriagensTab() {
  const pendingTriagens = [
    { id: 1, patient: "Fernando Souza", urgency: "Alta", timeWaiting: "15 min" },
    { id: 2, patient: "Juliana Santos", urgency: "Média", timeWaiting: "30 min" },
    { id: 3, patient: "Ricardo Pereira", urgency: "Baixa", timeWaiting: "45 min" },
  ];

  const handleStartTriagem = (triagemId) => {
    alert(`Iniciando triagem para o ID: ${triagemId}`);
    // Aqui você navegaria para a tela de triagem ou abriria um modal
  };

  const handleNewTriagem = () => {
    alert("Abrir formulário para adicionar nova triagem manual!");
    // Aqui você abriria um modal ou navegaria para uma página de criação de triagem
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-white/10 rounded-lg shadow-md"> {/* Ajuste de padding */}
      <Heading
        as="h2"
        text="Triagens Pendentes"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-3 text-2xl sm:text-3xl" // Ajuste de tamanho do título para mobile
      />
      <ParagraphBlue className="mb-4 sm:mb-6 text-sm sm:text-base">Pacientes aguardando triagem.</ParagraphBlue> {/* Ajuste de margem e fonte */}

      <div className="mb-4 sm:mb-6 text-right"> {/* Ajuste de margem */}
        <ButtonPrimary onClick={handleNewTriagem}
          className="w-full sm:w-auto" // Botão full width em mobile, automático em telas maiores
        >
          + Nova Triagem Manual
        </ButtonPrimary>
      </div>

      {pendingTriagens.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow"> {/* Adiciona arredondamento e sombra ao scroll container */}
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700"> {/* Ajuste dark mode para thead */}
              <tr>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"> {/* Ajuste de padding e fonte */}
                  Paciente
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Urgência
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tempo de Espera
                </th>
                <th scope="col" className="relative px-3 py-2 sm:px-6 sm:py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-white/10 divide-y divide-gray-200 dark:divide-gray-700">
              {pendingTriagens.map((triagem) => (
                <tr key={triagem.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"> {/* Adiciona hover effect */}
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-DarkBlue dark:text-white"> {/* Ajuste de padding */}
                    {triagem.patient}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      triagem.urgency === 'Alta' ? 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100' : // Ajuste dark mode para badges
                      triagem.urgency === 'Média' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' :
                      'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                    }`}>
                      {triagem.urgency}
                    </span>
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {triagem.timeWaiting}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleStartTriagem(triagem.id)}
                      className="underline text-orange-600 hover:text-orange-900 dark:text-orange dark:hover:text-orange/80 focus:outline-none"
                    >
                      Iniciar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">Nenhuma triagem pendente no momento.</p>
      )}
    </div>
  );
}