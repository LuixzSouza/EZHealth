// components/sections/triagem/T_End_Confirmed.jsx
import { useEffect, useState } from "react";
import { ContainerGrid } from "@/components/layout/ContainerGrid";
import { HeadingOrange } from "@/components/theme/HeadingOrange";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import Image from "next/image";

export function T_End_Confirmed({ formData }) {
  const [senhaExibida, setSenhaExibida] = useState("");
  const [salaExibida, setSalaExibida] = useState("");
  const [medicoExibido, setMedicoExibido] = useState({ nome: "", foto: "" });
  const [classificacaoExibida, setClassificacaoExibida] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false); // New state to track submission

  useEffect(() => {
    // Only attempt submission if formData is defined, not empty, and hasn't been submitted yet
    if (formData && Object.keys(formData).length > 0 && !hasSubmitted) {
      setLoading(true);
      setError(null);

      // The delay was kept for compatibility with your original code.
      // In a real application, it might not be necessary or could be adjusted.
      const timer = setTimeout(async () => {
        try {
          const response = await fetch("/api/triagem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Falha ao salvar os dados da triagem."
            );
          }

          const result = await response.json();
          console.log(
            "Dados salvos e processados com sucesso pelo backend:",
            result
          );

          if (result.triagemCompleta) {
            setSenhaExibida(result.triagemCompleta.atendimentoInfo?.senha || "");
            setSalaExibida(result.triagemCompleta.atendimentoInfo?.sala || "");
            setMedicoExibido(
              result.triagemCompleta.atendimentoInfo?.medico || {
                nome: "",
                foto: "",
              }
            );
            setClassificacaoExibida(
              result.triagemCompleta.classificacaoRisco || null
            );
          }

          setHasSubmitted(true); // Mark as submitted after successful fetch
          setLoading(false);
        } catch (err) {
          console.error("Erro ao salvar dados:", err);
          setError("Ocorreu um erro ao salvar seu atendimento: " + err.message);
          setLoading(false);
        }
      }, 100);

      // Cleanup function for setTimeout to prevent it from running if component unmounts or dependencies change before delay finishes
      return () => clearTimeout(timer);
    } else if (!formData || Object.keys(formData).length === 0) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, hasSubmitted]); // Add hasSubmitted to dependencies

  return (
    <section className="pt-8 flex items-center justify-center px-4">
      <ContainerGrid className="w-full max-w-lg bg-orange/10 shadow-xl rounded-3xl p-10 flex flex-col items-center gap-6 text-center">
        {loading && <p>Salvando seu atendimento...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && hasSubmitted && ( // Use hasSubmitted here for rendering
          <>
            <HeadingOrange text="ATENDIMENTO CONFIRMADO" />
            <ParagraphBlue>Seu atendimento foi registrado com sucesso!</ParagraphBlue>

            {classificacaoExibida && (
              <div
                className={`p-4 rounded-lg text-white font-bold text-xl w-full`}
                style={{ backgroundColor: classificacaoExibida.color.toLowerCase() }}
              >
                Classificação: {classificacaoExibida.label} - Atendimento{" "}
                {classificacaoExibida.time}
              </div>
            )}

            <div className="w-full flex flex-col gap-4 mt-4">
              <div className="bg-white/10 rounded-xl shadow-md p-4">
                <p className="text-orange text-lg font-semibold">Senha:</p>
                <p className="text-2xl text-blue-900 dark:text-white font-bold">
                  {senhaExibida}
                </p>
              </div>

              <div className="bg-white/10 rounded-xl shadow-md p-4">
                <p className="text-orange text-lg font-semibold">Sala:</p>
                <p className="text-2xl text-blue-900 dark:text-white font-bold">
                  {salaExibida}
                </p>
              </div>

              <div className="bg-white/10 rounded-xl shadow-md p-4 flex flex-col items-center gap-2">
                <p className="text-orange text-lg font-semibold">Médico(a):</p>
                {medicoExibido.foto && (
                  <Image
                    width={96}
                    height={96}
                    src={medicoExibido.foto}
                    alt={medicoExibido.nome}
                    className="w-24 h-24 rounded-full object-cover shadow"
                  />
                )}
                <p className="text-2xl text-blue-900 dark:text-white font-bold">
                  {medicoExibido.nome}
                </p>
              </div>
            </div>
          </>
        )}

        {!loading && !hasSubmitted && !error && (
          <p>Aguardando confirmação do formulário...</p>
        )}
      </ContainerGrid>
    </section>
  );
}