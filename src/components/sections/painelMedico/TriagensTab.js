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
    gray: "bg-zinc-300 text-zinc-800",
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
        const response = await fetch('https://ezhealthluixz.netlify.app/api/triagem');
        if (!response.ok) {
          throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        const data = await response.json();

        const formattedTriagens = data.map(triagem => {
          // Usar optional chaining ao acessar dadosPessoalPaciente
          const patientName = triagem.dadosPessoalPaciente?.nome || 'Paciente Desconhecido';

          const urgencyClassification = triagem.classificacaoRisco || {
            label: 'Não Classificado',
            color: 'gray',
            time: ''
          };

          // Garante que createdAt é um Date válido
          const createdAtDate = triagem.createdAt ? new Date(triagem.createdAt) : new Date(); // Fallback para new Date() se createdAt estiver faltando

          return {
            id: triagem._id,
            patient: patientName,
            urgencyLabel: urgencyClassification.label,
            urgencyColor: urgencyClassification.color,
            urgencyTime: urgencyClassification.time,
            createdAt: createdAtDate,
            timeWaiting: calculaTempoEspera(createdAtDate),
            fullTriagemData: triagem // Guarda o objeto original completo se necessário
          };
        })
        // Filtra triagens que já possuem atendimentoInfo.status === 'Finalizado' ou similar, se desejar mostrar apenas 'pendentes'
        // Por exemplo, se 'triagensPendentes' significa "não atribuídas" ou "não finalizadas":
        .filter(triagem => triagem.fullTriagemData.atendimentoInfo?.status !== 'Finalizado' && triagem.fullTriagemData.atendimentoInfo?.status !== 'Em Atendimento');

        setPendingTriagens(formattedTriagens);
      } catch (err) {
        console.error('Erro ao buscar triagens:', err);
        setError('Não foi possível carregar as triagens. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchTriagens();

    // Limpar o intervalo ao desmontar o componente
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Vazio para executar apenas uma vez na montagem

  useEffect(() => {
    // Só inicia o intervalo se o carregamento terminou e há triagens
    if (loading || pendingTriagens.length === 0) {
      if (intervalRef.current) { // Limpa se as condições não forem mais atendidas
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Inicia o intervalo se ainda não estiver ativo
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setPendingTriagens(prev =>
          prev.map(item => ({
            ...item,
            timeWaiting: calculaTempoEspera(item.createdAt)
          }))
        );
      }, 60_000); // Atualiza a cada 1 minuto (60 segundos)
    }

    // Limpeza ao desmontar ou quando as dependências mudam
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [loading, pendingTriagens.length]); // Depende de loading e do número de triagens

  const handleStartTriagem = (triagemId) => {
    router.push(`/painel-medico/${triagemId}`);
  };

  const handleNewTriagem = () => {
    alert("Abrir formulário para adicionar nova triagem manual!");
    // Aqui você pode redirecionar para uma página de novo formulário de triagem
    // router.push('/painel-medico/nova-triagem');
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
        <p className="text-zinc-500 dark:text-zinc-400 text-center py-6 sm:py-8 text-sm sm:text-base">
          Carregando triagens...
        </p>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400 text-center py-6 sm:py-8 text-sm sm:text-base">
          {error}
        </p>
      ) : pendingTriagens.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-zinc-50 dark:bg-zinc-700">
              <tr>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                  Urgência
                </th>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                  Tempo de Espera
                </th>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="relative px-3 py-2 sm:px-6 sm:py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-white/10 divide-y divide-zinc-200 dark:divide-zinc-700">
              {pendingTriagens.map((triagem) => {
                const badgeClass = colorClasses[triagem.urgencyColor] || colorClasses.gray;

                // Definindo o nome do médico de forma segura
                const medicoNome = triagem.fullTriagemData.atendimentoInfo?.medico?.nome || 'Não Atribuído';

                return (
                  <tr
                    key={triagem.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
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

                    <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">
                      {triagem.timeWaiting}
                    </td>

                    {/* AQUI ESTÁ A CORREÇÃO PRINCIPAL */}
                    <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-DarkBlue dark:text-white">
                      {medicoNome}
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
        <p className="text-zinc-500 dark:text-zinc-400 text-center py-6 sm:py-8 text-sm sm:text-base">
          Nenhuma triagem pendente no momento.
        </p>
      )}
    </div>
  );
}