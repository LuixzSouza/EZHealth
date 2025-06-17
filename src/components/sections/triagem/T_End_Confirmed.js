// components/sections/triagem/T_End_Confirmed.jsx (VERSÃO FINAL E ROBUSTA)
'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { ContainerGrid } from "@/components/layout/ContainerGrid";
import { HeadingOrange } from "@/components/theme/HeadingOrange";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import Image from "next/image";
import { ArrowPathIcon, XCircleIcon } from "@heroicons/react/24/solid";

// ✅ PADRÃO: Sub-componente para o estado de carregamento
function LoadingState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in gap-4">
       <div className="w-16 h-16 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
       <p className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">{message}</p>
    </div>
  );
}

// ✅ PADRÃO: Sub-componente para o estado de erro
function ErrorState({ message, onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center h-full animate-fade-in gap-4 text-center">
            <XCircleIcon className="w-16 h-16 text-red-500" />
            <p className="text-xl font-bold text-red-500">Falha na Comunicação</p>
            <p className="text-zinc-600 dark:text-zinc-400">{message}</p>
            <button
                onClick={onRetry}
                className="mt-4 bg-orange text-white font-semibold py-2 px-6 rounded-md hover:bg-orange/80 transition"
            >
                Tentar Novamente
            </button>
        </div>
    );
}


export function T_End_Confirmed({ formData }) {
  const [triageId, setTriageId] = useState(null);
  const [senhaExibida, setSenhaExibida] = useState("");
  const [salaExibida, setSalaExibida] = useState("");
  const [medicoExibido, setMedicoExibido] = useState({ nome: "", foto: "" });
  const [classificacaoExibida, setClassificacaoExibida] = useState(null);
  const [statusAtendimento, setStatusAtendimento] = useState("");
  const [posicaoFila, setPosicaoFila] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Iniciando atendimento...");
  const [error, setError] = useState(null);
  
  const hasSubmittedRef = useRef(false);

  const submitTriage = useCallback(async () => {
    if (!formData || Object.keys(formData).length === 0 || hasSubmittedRef.current) {
        if (hasSubmittedRef.current && triageId) {
            // Se a submissão já ocorreu e temos um ID, apenas busca o status mais recente.
            await fetchStatus(triageId);
        }
        setLoading(false);
        return;
    }
    hasSubmittedRef.current = true;
    setLoading(true);
    setError(null);

    try {
      setLoadingMessage("Processando dados do paciente...");
      const patientPayload = { ...formData.dadosPessoalPaciente, temConvenio: formData.dadosPessoalPaciente.temConvenio === 'true' };
      const patientRes = await fetch('/api/patients/find-or-create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patientPayload) });
      const patientResult = await patientRes.json();
      if (!patientResult.success) throw new Error(`Erro no cadastro do paciente: ${patientResult.message}`);
      const patientId = patientResult.data._id;
      
      setLoadingMessage("Registrando informações da triagem...");
      const triagePayload = { patientId, sinaisVitais: formData.sinaisVitais, sintomas: formData.sintomas, tempoSintomas: formData.sintomasDetalhes?.tempoSintomas, historico: formData.historico };
      const triageRes = await fetch("/api/triagem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(triagePayload) });
      const triageResult = await triageRes.json();
      if (!triageResult.success) throw new Error(`Erro no registro da triagem: ${triageResult.message}`);
      
      const newTriage = triageResult.data;
      setTriageId(newTriage._id);
      setSenhaExibida(newTriage.atendimentoInfo?.senha || "Aguardando");
      setClassificacaoExibida(newTriage.classificacao || null);
      
      setLoadingMessage("Calculando posição na fila...");
      await fetchStatus(newTriage._id);

      setLoading(false);
    } catch (err) {
      setError(err.message || "Não foi possível conectar ao servidor.");
      setLoading(false);
    }
  }, [formData]); // A função de submissão só depende dos dados do formulário

  // ✅ PADRÃO: `fetchStatus` agora é uma função isolada e otimizada
  const fetchStatus = useCallback(async (id) => {
    if (!id || isRefreshing) return;
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/triagem/${id}`);
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      const { data } = result;
      setSalaExibida(data.atendimentoInfo?.sala || "Aguardando");
      setMedicoExibido({ nome: data.atendimentoInfo.medicoId?.nome || "A ser definido", foto: data.atendimentoInfo.medicoId?.fotoUrl || "/icons/medico-avatar.svg" });
      setStatusAtendimento(data.atendimentoInfo?.status || "Na fila");
      setPosicaoFila(data.posicaoFila);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]); // Depende apenas de 'isRefreshing' para evitar chamadas duplicadas

  // Efeito para a submissão inicial
  useEffect(() => {
    submitTriage();
  }, [submitTriage]);

  // ✅ PADRÃO: Efeito para atualização automática (Polling)
  useEffect(() => {
    if (loading || error || !triageId || statusAtendimento === 'Finalizado') {
      return; // Não faz nada se estiver carregando, com erro, sem ID ou se o atendimento já finalizou
    }

    const intervalId = setInterval(() => {
      fetchStatus(triageId);
    }, 15000); // Atualiza a cada 15 segundos

    // Função de limpeza para parar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [loading, error, triageId, fetchStatus, statusAtendimento]);


  return (
    <section className="py-16 flex items-center justify-center w-full px-4">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl p-8 flex flex-col items-center gap-6 text-center min-h-[650px]">
        {loading && <LoadingState message={loadingMessage} />}
        {error && <ErrorState message={error} onRetry={submitTriage} />}
        
        {!loading && !error && triageId && (
          <>
            <HeadingOrange text="ATENDIMENTO CONFIRMADO" />
            <ParagraphBlue>Aguarde o chamado no painel. Guarde sua senha.</ParagraphBlue>

            {classificacaoExibida && (
              <div className="p-4 rounded-lg text-white font-bold text-xl w-full" style={{ backgroundColor: classificacaoExibida.color }}>
                Classificação: {classificacaoExibida.label} - {classificacaoExibida.time}
              </div>
            )}

            <div className="w-full grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-md p-4">
                <p className="text-orange text-lg font-semibold">Senha:</p>
                <p className="text-4xl text-blue-900 dark:text-white font-bold">{senhaExibida}</p>
              </div>

              {/* ✅ MELHORIA: Destaque visual para quando for a vez do paciente */}
              <div className={`col-span-2 rounded-xl shadow-md p-4 transition-all ${statusAtendimento === 'Em atendimento' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-white/10 dark:bg-zinc-800'}`}>
                <p className="text-orange text-lg font-semibold">Sua Posição na Fila:</p>
                {statusAtendimento === 'Em atendimento' ? (
                     <p className="text-2xl text-green-700 dark:text-green-300 font-bold">É a sua vez! Dirija-se à sala.</p>
                ) : posicaoFila ? (
                  <p className="text-4xl text-blue-900 dark:text-white font-bold">{posicaoFila}º</p>
                ) : (
                  <p className="text-xl text-blue-900 dark:text-white font-semibold">{statusAtendimento}</p>
                )}
              </div>
              
              <div className="bg-white/10 dark:bg-zinc-800 rounded-xl shadow-md p-4 flex flex-col items-center">
                <p className="text-orange text-lg font-semibold">Sala:</p>
                <p className="text-3xl text-blue-900 dark:text-white font-bold">{salaExibida}</p>
              </div>
              
              <div className="bg-white/10 dark:bg-zinc-800 rounded-xl shadow-md p-4 flex flex-col items-center">
                <p className="text-orange text-lg font-semibold">Médico(a):</p>
                <Image src={medicoExibido.foto} alt="Foto do médico" width={40} height={40} className="rounded-full my-1"/>
                <p className="text-base text-blue-900 dark:text-white font-bold text-center leading-tight">{medicoExibido.nome}</p>
              </div>
            </div>

            <button
                onClick={() => fetchStatus(triageId)}
                disabled={isRefreshing}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-orange text-white font-semibold py-3 rounded-md transition hover:bg-orange/90 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:bg-zinc-400 disabled:cursor-wait"
            >
              {/* ✅ PADRÃO: Ícone de carregamento no botão */}
              <ArrowPathIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Atualizando...' : 'Atualizar Status Agora'}
            </button>
          </>
        )}
      </div>
    </section>
  );
}