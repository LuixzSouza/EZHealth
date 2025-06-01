import { Heading } from "@/components/typography/Heading"; // Usando o componente Heading refatorado
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary"; // Importando o ButtonPrimary

export function PacientesTab() {
  const patients = [
    { id: 1, name: "Ana Clara Silva", age: 34, status: "Ativo", lastVisit: "2025-05-20" },
    { id: 2, name: "Bruno Costa", age: 52, status: "Ativo", lastVisit: "2025-05-15" },
    { id: 3, name: "Carla Dias", age: 28, status: "Inativo", lastVisit: "2024-11-10" },
    { id: 4, name: "Daniel Rocha", age: 67, status: "Ativo", lastVisit: "2025-05-28" },
    { id: 5, name: "Eduarda Lima", age: 41, status: "Ativo", lastVisit: "2025-05-25" },
  ];

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-white/10 rounded-lg shadow-md"> {/* Ajuste de padding */}
      <Heading
        as="h2"
        text="Meus Pacientes"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-3 text-2xl sm:text-3xl" // Ajuste de tamanho do título para mobile
      />
      <ParagraphBlue className="mb-4 sm:mb-6 text-sm sm:text-base">Lista de pacientes sob seu cuidado.</ParagraphBlue> {/* Ajuste de margem e fonte */}

      <div className="mb-4 sm:mb-6 text-right"> {/* Ajuste de margem */}
        <ButtonPrimary onClick={() => alert("Abrir formulário para adicionar paciente!")}
          className="w-full sm:w-auto" // Botão full width em mobile, automático em telas maiores
        >
          + Adicionar Paciente
        </ButtonPrimary>
      </div>

      {patients.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow"> {/* Adiciona arredondamento e sombra ao scroll container */}
          <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
            <thead className="bg-white dark:bg-themeDark"> {/* Ajuste dark mode para thead */}
              <tr>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"> {/* Ajuste de padding e fonte */}
                  Nome
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Idade
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Última Visita
                </th>
                <th scope="col" className="relative px-3 py-2 sm:px-6 sm:py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-white/10 divide-y divide-gray-200 dark:divide-gray-700">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"> {/* Adiciona hover effect */}
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-DarkBlue dark:text-white"> {/* Ajuste de padding */}
                    {patient.name}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {patient.age}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      patient.status === 'Ativo' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100' // Ajuste dark mode para status badges
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {new Date(patient.lastVisit).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-200">Ver Perfil</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">Nenhum paciente cadastrado.</p> 
      )}
    </div>
  );
}