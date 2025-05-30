import { useEffect, useState } from "react";
import { ContainerGrid } from "@/components/layout/ContainerGrid";
import { HeadingOrange } from "@/components/theme/HeadingOrange";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import Image from "next/image";

// Dados combinando nome e imagem
const medicos = [
  {
    nome: "Dr. João Silva",
    foto: "/images/doctors/dr_joao_silva.png",
  },
  {
    nome: "Dra. Ana Paula",
    foto: "/images/doctors/dra_ana_paula.png",
  },
  {
    nome: "Dr. Marcos Vinícius",
    foto: "/images/doctors/dr_marcos_vinicius.png",
  },
  {
    nome: "Dra. Camila Ribeiro",
    foto: "/images/doctors/dra_camila_ribeiro.png",
  },
  {
    nome: "Dra. Larissa Mendes",
    foto: "/images/doctors/dra_larissa_mendes.png",
  },
  {
    nome: "Dr. Rafael Albuquerque",
    foto: "/images/doctors/dr_rafael_albuquerque.png",
  },
  {
    nome: "Dra. Beatriz Costa",
    foto: "/images/doctors/dra_beatriz_costa.png",
  },
  {
    nome: "Dr. Henrique Souza",
    foto: "/images/doctors/dr_henrique_souza.png",
  },
];

const senhas = ["A123", "B456", "C789", "D321", "E654"];
const salas = ["01", "02", "03", "04", "05"];

export function T_End_Confirmed() {
  const [senha, setSenha] = useState("");
  const [sala, setSala] = useState("");
  const [medico, setMedico] = useState({ nome: "", foto: "" });

  useEffect(() => {
    setSenha(senhas[Math.floor(Math.random() * senhas.length)]);
    setSala(salas[Math.floor(Math.random() * salas.length)]);
    setMedico(medicos[Math.floor(Math.random() * medicos.length)]);
  }, []);

  return (
    <section className="pt-8 flex items-center justify-center px-4">
      <ContainerGrid className="w-full max-w-lg bg-orange/10 shadow-xl rounded-3xl p-10 flex flex-col items-center gap-6 text-center">
        <HeadingOrange text="ATENDIMENTO CONFIRMADO" />
        <ParagraphBlue>Seu atendimento foi registrado com sucesso!</ParagraphBlue>

        <div className="w-full flex flex-col gap-4 mt-4">
          <div className="bg-white/10 rounded-xl shadow-md p-4">
            <p className="text-orange text-lg font-semibold">Senha:</p>
            <p className="text-2xl text-blue-900 dark:text-white font-bold">{senha}</p>
          </div>

          <div className="bg-white/10 rounded-xl shadow-md p-4">
            <p className="text-orange text-lg font-semibold">Sala:</p>
            <p className="text-2xl text-blue-900 dark:text-white font-bold">{sala}</p>
          </div>

          <div className="bg-white/10 rounded-xl shadow-md p-4 flex flex-col items-center gap-2">
            <p className="text-orange text-lg font-semibold">Médico(a):</p>
            {medico.foto && (
              <Image
                width={96}
                height={96}
                src={medico.foto}
                alt={medico.nome}
                className="w-24 h-24 rounded-full object-cover shadow"
              />
            )}
            <p className="text-2xl text-blue-900 dark:text-white font-bold">{medico.nome}</p>
          </div>
        </div>
      </ContainerGrid>
    </section>
  );
}
