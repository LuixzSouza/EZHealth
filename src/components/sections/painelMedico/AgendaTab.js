import { ButtonPrimary } from "@/components/theme/ButtonPrimary";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { Heading } from "@/components/typography/Heading";

export function AgendaTab() {
  const appointments = [
    { id: 1, date: "2025-06-10", time: "10:00", description: "Consulta de rotina com Dr. Silva" },
    { id: 2, date: "2025-06-15", time: "14:30", description: "Exames de sangue no laboratório Central" },
    { id: 3, date: "2025-06-20", time: "09:00", description: "Retorno com Dra. Almeida" },
  ];

  return (
    <div className="p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
      <Heading
        as="h2" // Define a tag HTML para o título
        text="Agenda de Consultas"
        colorClass="dark:text-orangeDark text-orange" // Passa a classe de cor
        className="mb-4" // Adiciona margem inferior
      />
      <ParagraphBlue className="mb-6">Seus próximos compromissos.</ParagraphBlue>

      {/* Conteúdo da Agenda */}
      {appointments.length > 0 ? (
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-DarkBlue dark:text-white">
                  {new Date(appointment.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {appointment.time}
                </p>
                <p className="text-gray-600 dark:text-gray-400">{appointment.description}</p>
              </div>
              {/* Você pode adicionar botões de Ações aqui, ex: Ver Detalhes, Cancelar */}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">Nenhum compromisso futuro agendado.</p>
      )}

      <div className="mt-8 text-center">
        <ButtonPrimary onClick={() => alert("Função para adicionar nova consulta!")} variant="primary">
          + Adicionar Nova Consulta
        </ButtonPrimary>
      </div>
    </div>
  );
}