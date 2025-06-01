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
    <div className="p-4 sm:p-6 bg-white dark:bg-white/10 rounded-lg shadow-md"> {/* Ajuste de padding */}
      <Heading
        as="h2"
        text="Agenda de Consultas"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-3 text-2xl sm:text-3xl" // Ajuste de tamanho do título para mobile
      />
      <ParagraphBlue className="mb-4 sm:mb-6 text-sm sm:text-base">Seus próximos compromissos.</ParagraphBlue> {/* Ajuste de margem e fonte */}

      {/* Conteúdo da Agenda */}
      {appointments.length > 0 ? (
        <ul className="space-y-3 sm:space-y-4"> {/* Ajuste de espaçamento entre itens */}
          {appointments.map((appointment) => (
            <li key={appointment.id} className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md flex flex-col sm:flex-row justify-between sm:items-center"> {/* Ajuste de padding e flexbox para mobile */}
              <div className="mb-2 sm:mb-0"> {/* Adiciona margem inferior em mobile */}
                <p className="text-base sm:text-lg font-semibold text-DarkBlue dark:text-white leading-tight"> {/* Ajuste de fonte e line-height */}
                  {new Date(appointment.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {appointment.time}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.description}</p> {/* Ajuste de fonte */}
              </div>
              {/* Você pode adicionar botões de Ações aqui, ex: Ver Detalhes, Cancelar */}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">Nenhum compromisso futuro agendado.</p> 
      )}

      <div className="mt-6 sm:mt-8 text-center"> {/* Ajuste de margem superior */}
        <ButtonPrimary onClick={() => alert("Função para adicionar nova consulta!")} variant="primary"
          className="w-full sm:w-auto" // Botão full width em mobile, automático em telas maiores
        >
          + Adicionar Nova Consulta
        </ButtonPrimary>
      </div>
    </div>
  );
}