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
    <div className="p-6 bg-white dark:bg-themeDark rounded-lg shadow-md">
      <Heading
        as="h2"
        text="Meus Pacientes"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-4"
      />
      <ParagraphBlue className="mb-6">Lista de pacientes sob seu cuidado.</ParagraphBlue>

      <div className="mb-6 text-right">
        <ButtonPrimary onClick={() => alert("Abrir formulário para adicionar paciente!")}>
          + Adicionar Paciente
        </ButtonPrimary>
      </div>

      {patients.length > 0 ? (
        <div className="overflow-x-auto"> {/* Adiciona scroll horizontal para tabelas grandes */}
          <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
            <thead className="bg-gray-50 dark:divide-white/10">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Idade
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Última Visita
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-white/10 divide-y divide-gray-200 dark:divide-gray-700">
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-DarkBlue dark:text-white">
                    {patient.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {patient.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      patient.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {new Date(patient.lastVisit).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-200">Ver Perfil</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">Nenhum paciente cadastrado.</p>
      )}
    </div>
  );
}