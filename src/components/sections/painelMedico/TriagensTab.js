// components/tabs/TriagensTab.jsx (VERSÃO REATORADA)
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";

export function TriagensTab() {
  const [pendingTriagens, setPendingTriagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const router = useRouter();

  // Mapeamento de cores baseado nos nomes de cores retornados pela API
  const colorClasses = {
    red: "bg-red-500 text-white",
    orange: "bg-orange-500 text-white",
    yellow: "bg-yellow-400 text-black",
    green: "bg-green-500 text-white",
    blue: "bg-blue-500 text-white",
    default: "bg-zinc-300 text-zinc-800",
  };

  const calculaTempoEspera = (createdAtDate) => {
    const now = new Date();
    const diffMinutes = Math.floor((now - new Date(createdAtDate)) / (1000 * 60));
    if (diffMinutes < 0) return "0 min";
    if (diffMinutes < 60) return `${diffMinutes} min`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;
    return `${diffHours}h ${remainingMinutes}min`;
  };
  
  const fetchTriagens = async () => {
    // Não precisa de `setLoading(true)` aqui para evitar o piscar da tela a cada atualização
    try {
        // ✅ MUDANÇA: Usando a URL relativa e a nova API que já popula os dados
        const response = await fetch('/api/triagem');
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        
        const result = await response.json();
        if (!result.success) throw new Error(result.message);

        // ✅ MUDANÇA: A API já nos dá os dados prontos. Só filtramos os pendentes.
        const pending = result.data.filter(t => 
            t.atendimentoInfo?.status !== 'Finalizado' && t.atendimentoInfo?.status !== 'Em Atendimento'
        );
        
        setPendingTriagens(pending);
        setError(null);
    } catch (err) {
        console.error('Erro ao buscar triagens:', err);
        setError('Não foi possível carregar as triagens.');
    } finally {
        // Só muda o loading na primeira busca
        if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchTriagens(); // Busca inicial
    
    // Configura um intervalo para buscar novas triagens e atualizar a lista
    intervalRef.current = setInterval(fetchTriagens, 30000); // A cada 30 segundos

    // Limpa o intervalo ao desmontar o componente
    return () => clearInterval(intervalRef.current);
  }, []); // O array de dependências vazio garante que o intervalo seja configurado apenas uma vez

  const handleStartTriagem = (triagemId) => {
    router.push(`/painel-medico/atendimento/${triagemId}`); // Rota mais semântica
  };

  const handleNewTriagem = () => {
    router.push('/triagem'); // Redireciona para o formulário de triagem
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-white/10 rounded-lg shadow-md">
      <Heading
        as="h2"
        text="Triagens Pendentes"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-3 text-2xl sm:text-3xl"
      />
      <ParagraphBlue className="mb-6">Pacientes aguardando atendimento na fila.</ParagraphBlue>
      
      <div className="mb-6 text-right">
        <ButtonPrimary onClick={handleNewTriagem} className="w-full sm:w-auto">
          + Registrar Nova Triagem
        </ButtonPrimary>
      </div>

      {loading ? (
        <p className="text-zinc-500 text-center py-8">Carregando triagens...</p>
      ) : error ? (
        <p className="text-red-500 text-center py-8">{error}</p>
      ) : pendingTriagens.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-zinc-50 dark:bg-zinc-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Urgência</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Tempo de Espera</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase">Responsável</th>
                <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-white/10 divide-y divide-zinc-200 dark:divide-zinc-700">
              {pendingTriagens.map((triagem) => {
                const badgeClass = colorClasses[triagem.classificacao?.color] || colorClasses.default;
                return (
                  <tr key={triagem._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-DarkBlue dark:text-white">
                      {/* ✅ MUDANÇA: Acesso direto aos dados populados */}
                      {triagem.patientId?.nome || 'Paciente não identificado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
                        {triagem.classificacao?.label || 'Não classificado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-300">
                      {calculaTempoEspera(triagem.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-DarkBlue dark:text-white">
                      {triagem.atendimentoInfo.medicoId?.nome || 'Não Atribuído'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleStartTriagem(triagem._id)}
                        className="underline text-orange-600 hover:text-orange-900 dark:text-orange"
                      >
                        Iniciar Atendimento
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-zinc-500 text-center py-8">Nenhuma triagem pendente no momento.</p>
      )}
    </div>
  );
}
