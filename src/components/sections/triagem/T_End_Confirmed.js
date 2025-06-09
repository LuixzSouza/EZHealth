// ✅ Substitua TODO o conteúdo do seu arquivo por este:
// components/sections/triagem/T_End_Confirmed.jsx (VERSÃO FINAL E ROBUSTA)

import { useEffect, useState, useRef, useCallback } from "react"; // Importe useRef
import { ContainerGrid } from "@/components/layout/ContainerGrid";
import { HeadingOrange } from "@/components/theme/HeadingOrange";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import Image from "next/image";

export function T_End_Confirmed({ formData }) {
  // Estados para exibir os dados na tela
  const [triageId, setTriageId] = useState(null);
  const [senhaExibida, setSenhaExibida] = useState("");
  const [salaExibida, setSalaExibida] = useState("");
  const [medicoExibido, setMedicoExibido] = useState({ nome: "", foto: "" });
  const [classificacaoExibida, setClassificacaoExibida] = useState(null);
  const [statusAtendimento, setStatusAtendimento] = useState("");
  
  // Estados para a fila
  const [posicaoFila, setPosicaoFila] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Estados de controle do processo de envio
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Iniciando atendimento...");
  const [error, setError] = useState(null);
  
  // ✅ A "TRAVA" PARA IMPEDIR ENVIOS DUPLICADOS
  // Usamos useRef para garantir que a submissão aconteça apenas uma vez.
  const hasSubmittedRef = useRef(false);

  // Função para buscar o status atual e a posição na fila
  const fetchStatus = useCallback(async (id) => {
    if (!id) return;
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/triagem/${id}`);
      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      const { data } = result;
      setSalaExibida(data.atendimentoInfo?.sala || "Não definida");
      setMedicoExibido({ nome: data.atendimentoInfo.medicoId?.nome || "Aguardando Médico", foto: "/icons/medico-avatar.svg" });
      setStatusAtendimento(data.atendimentoInfo?.status || "");
      setPosicaoFila(data.posicaoFila);

    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const submitTriage = async () => {
      // ✅ VERIFICA A TRAVA: Se já foi enviado, não faz mais nada.
      if (!formData || Object.keys(formData).length === 0 || hasSubmittedRef.current) {
        setLoading(false);
        return;
      }

      // ✅ ATIVA A TRAVA: Garante que este bloco de código só execute uma vez.
      hasSubmittedRef.current = true;

      try {
        setLoadingMessage("Processando dados do paciente...");
        const patientPayload = { ...formData.dadosPessoalPaciente, temConvenio: formData.dadosPessoalPaciente.temConvenio === 'true' };
        
        const patientRes = await fetch('/api/patients/find-or-create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patientPayload) });
        const patientResult = await patientRes.json();
        if (!patientResult.success) throw new Error(patientResult.message);
        const patientId = patientResult.data._id;
        
        setLoadingMessage("Registrando informações da triagem...");
        const triagePayload = { patientId, sinaisVitais: formData.sinaisVitais, sintomas: formData.sintomas, tempoSintomas: formData.sintomasDetalhes?.tempoSintomas };
        
        const triageRes = await fetch("/api/triagem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(triagePayload) });
        const triageResult = await triageRes.json();
        if (!triageResult.success) throw new Error(triageResult.message);
        
        const newTriage = triageResult.data;
        setTriageId(newTriage._id);
        setSenhaExibida(newTriage.atendimentoInfo?.senha || "Aguardando");
        setClassificacaoExibida(newTriage.classificacao || null);
        
        setLoadingMessage("Calculando posição na fila...");
        await fetchStatus(newTriage._id);

        setLoading(false);
      } catch (err) {
        setError("Ocorreu um erro: " + err.message);
        setLoading(false);
      }
    };

    submitTriage();
  // A dependência é apenas `formData` e `fetchStatus`.
  // O useEffect só vai rodar novamente se os dados do formulário mudarem.
  }, [formData, fetchStatus]);

  // O JSX para renderizar a tela permanece o mesmo
  return (
    <section className="pt-8 flex items-center justify-center px-4">
      <ContainerGrid className="w-full max-w-lg bg-orange/10 shadow-xl rounded-3xl p-10 flex flex-col items-center gap-6 text-center min-h-[600px]">
        {loading && <p className="text-xl font-semibold">{loadingMessage}</p>}
        {error && <p className="text-red-500 font-bold">{error}</p>}
        {!loading && !error && (
          <>
            <HeadingOrange text="ATENDIMENTO CONFIRMADO" />
            <ParagraphBlue>Aguarde o chamado no painel. Guarde sua senha.</ParagraphBlue>

            {classificacaoExibida && (
              <div className="p-4 rounded-lg text-white font-bold text-xl w-full" style={{ backgroundColor: classificacaoExibida.color }}>
                Classificação: {classificacaoExibida.label} - {classificacaoExibida.time}
              </div>
            )}

            <div className="w-full grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2 bg-white/10 rounded-xl shadow-md p-4">
                <p className="text-orange text-lg font-semibold">Senha:</p>
                <p className="text-4xl text-blue-900 dark:text-white font-bold">{senhaExibida}</p>
              </div>

              <div className="col-span-2 bg-white/10 rounded-xl shadow-md p-4">
                <p className="text-orange text-lg font-semibold">Sua Posição na Fila:</p>
                {posicaoFila ? (
                  <p className="text-4xl text-blue-900 dark:text-white font-bold">{posicaoFila}º</p>
                ) : (
                  <p className="text-xl text-blue-900 dark:text-white font-semibold">{statusAtendimento}</p>
                )}
              </div>

              <div className="bg-white/10 rounded-xl shadow-md p-4">
                <p className="text-orange text-lg font-semibold">Sala:</p>
                <p className="text-2xl text-blue-900 dark:text-white font-bold">{salaExibida}</p>
              </div>
              
              <div className="bg-white/10 rounded-xl shadow-md p-4">
                <p className="text-orange text-lg font-semibold">Médico(a):</p>
                <p className="text-xl text-blue-900 dark:text-white font-bold">{medicoExibido.nome}</p>
              </div>
            </div>

            <button
                onClick={() => fetchStatus(triageId)}
                disabled={isRefreshing}
                className="mt-6 w-full bg-orange hover:border hover:border-orange text-white font-semibold py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition disabled:bg-zinc-400"
            >
                {isRefreshing ? 'Atualizando...' : 'Atualizar Status'}
            </button>
          </>
        )}
      </ContainerGrid>
    </section>
  );
}