import Image from "next/image";
import { ContainerGrid } from "../ContainerGrid";
import { HeadingOrange } from "../HeadingOrange";
import { useState } from "react";

export function TriagemHomeSect({ onStart }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="pt-32 overflow-hidden h-screen bg-white">
      <ContainerGrid className="flex flex-col items-center justify-center h-full gap-8 px-4 text-center lg:text-left">
        {/* Logo */}
        <Image src="/logo.png" width={180} height={60} alt="Logo" />

        {/* Hero Section */}
        <div className="flex flex-col-reverse items-center justify-center gap-10 lg:flex-row lg:gap-20 relative">
          {/* Avatar com balão de fala */}
          <div
            className="relative w-64 md:w-96"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src="/images/avatar-3.png"
              width={400}
              height={400}
              alt="Avatar"
              className="rounded-3xl shadow-xl transition-transform duration-300 hover:scale-105"
            />
            {isHovered && (
              <div className="absolute top-0 left-full ml-4 w-full max-w-lg p-4 bg-orange text-white rounded-lg shadow-lg">
                Olá, eu sou o Dr. EzHealth! Basta clicar em (Iniciar Triagem) e vamos começar sua triagem para cuidar melhor da sua saúde.
              </div>
            )}
          </div>

          {/* Heading e botão */}
          <div className="max-w-2xl">
            <h1 className="text-orange font-bold text-4xl md:text-5xl lg:text-6xl leading-tight animate-fade-in mb-8">
              BEM-VINDO À SUA TRIAGEM INTELIGENTE
            </h1>
            <button
              onClick={onStart}
              className="bg-orange text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-dark transition-colors"
            >
              Iniciar Triagem
            </button>
          </div>
        </div>
      </ContainerGrid>
    </section>
  );
}
