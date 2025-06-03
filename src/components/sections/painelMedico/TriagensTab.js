import { useState, useEffect, useRef } from 'react';
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";
import { useRouter } from 'next/navigation';

export function TriagensTab() {
  const [pendingTriagens, setPendingTriagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const router = useRouter();

  const colorClasses = {
    Vermelho: "bg-red-500 text-white",
    Laranja: "bg-orange-500 text-white",
    Amarelo: "bg-yellow-400 text-black",
    Verde: "bg-green-500 text-white",
    Azul: "bg-blue-500 text-white",
    gray: "bg-gray-300 text-gray-800",
  };

  function calculaTempoEspera(createdAtDate) {
    const now = new Date();
    const diffMinutes = Math.floor((now - createdAtDate) / (1000 * 60));
    if (diffMinutes < 0) return "0 min";

    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else {
      const diffHours = Math.floor(diffMinutes / 60);
      const remainingMinutes = diffMinutes % 60;
      return `${diffHours} h ${remainingMinutes} min`;
    }
  }

  useEffect(() => {
    async function fetchTriagens() {
      try {
        const response = await fetch('/api/triagem');
        if (!response.ok) {
          throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        const data = await response.json();

        const formattedTriagens = data.map(triagem => {
          const patientName = triagem.dadosPessoalPaciente?.nome || 'Paciente Desconhecido';

          const urgencyClassification = triagem.classificacaoRisco || {
            label: 'Não Classificado',
            color: 'gray',
            time: ''
          };

          const createdAtDate = new Date(triagem.createdAt);

          return {
            id: triagem._id,
            patient: patientName,
            urgencyLabel: urgencyClassification.label,
            urgencyColor: urgencyClassification.color,
            urgencyTime: urgencyClassification.time,
            createdAt: createdAtDate,
            timeWaiting: calculaTempoEspera(createdAtDate),
            fullTriagemData: triagem
          };
        });

        setPendingTriagens(formattedTriagens);
      } catch (err) {
        console.error('Erro ao buscar triagens:', err);
        setError('Não foi possível carregar as triagens. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchTriagens();
  }, []);

  useEffect(() => {
    if (loading || pendingTriagens.length === 0) return;

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setPendingTriagens(prev =>
          prev.map(item => ({
            ...item,
            timeWaiting: calculaTempoEspera(item.createdAt)
          }))
        );
      }, 60_000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [loading, pendingTriagens]);

  const handleStartTriagem = (triagemId) => {
    router.push(`/painel-medico/${triagemId}`);
  };

  const handleNewTriagem = () => {
    alert("Abrir formulário para adicionar nova triagem manual!");
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
      <Heading
        as="h2"
        text="Triagens Pendentes"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-3 text-2xl sm:text-3xl"
      />
      <ParagraphBlue className="mb-4 sm:mb-6 text-sm sm:text-base">
        Pacientes aguardando triagem.
      </ParagraphBlue>

      <div className="mb-4 sm:mb-6 text-right">
        <ButtonPrimary onClick={handleNewTriagem} className="w-full sm:w-auto">
          + Nova Triagem Manual
        </ButtonPrimary>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">
          Carregando triagens...
        </p>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400 text-center py-6 sm:py-8 text-sm sm:text-base">
          {error}
        </p>
      ) : pendingTriagens.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Urgência
                </th>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tempo de Espera
                </th>
                <th className="relative px-3 py-2 sm:px-6 sm:py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-white/10 divide-y divide-gray-200 dark:divide-gray-700">
              {pendingTriagens.map((triagem) => {
                const badgeClass = colorClasses[triagem.urgencyColor] || colorClasses.gray;

                return (
                  <tr
                    key={triagem.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-DarkBlue dark:text-white">
                      {triagem.patient}
                    </td>

                    <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}
                      >
                        {triagem.urgencyLabel} ({triagem.urgencyTime})
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
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">
          Nenhuma triagem pendente no momento.
        </p>
      )}
    </div>
  );
}
