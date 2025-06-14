import Image from "next/image";
import { ContainerGrid } from "../../layout/ContainerGrid";
import { useState, useEffect, useRef } from "react";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";
import { Heading } from "@/components/typography/Heading";

export function T_01_TriagemHomeSect({ onStart }) {
  const [isHovered, setIsHovered] = useState(false);
  const [typedText, setTypedText] = useState("");
  const timeoutsRef = useRef([]);

  const phrases = [
    "Olá, eu sou o Dr. EzHealth! Clique em (Iniciar Triagem) para começarmos.",
    "Vamos cuidar da sua saúde? É só clicar em (Iniciar Triagem).",
    "Preparado para saber mais sobre sua saúde? Vamos lá!",
    "Estou aqui para te ajudar! Clique em (Iniciar Triagem).",
    "Bora começar sua triagem inteligente? Clique no botão abaixo!",
    "Sua saúde é nossa prioridade! Inicie sua triagem agora.",
    "Desvende informações importantes sobre seu bem-estar. Comece a triagem!",
    "Com a triagem inteligente, você tem a saúde na palma da mão. Vamos lá!",
    "Pequenos passos para grandes resultados. Comece sua jornada de saúde conosco!",
    "Descubra insights valiosos sobre sua saúde com nossa triagem.",
    "Tecnologia e cuidado se unem para te auxiliar. Clique em (Iniciar Triagem).",
    "Um check-up rápido e eficaz te espera. Inicie a triagem!",
    "Sua jornada rumo a uma vida mais saudável começa aqui. Vamos triar?",
    "Sem filas, sem esperas. Sua triagem inteligente está pronta para você!",
    "Tenho muitas informações úteis para te dar. É só clicar em (Iniciar Triagem)."
  ];

  useEffect(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];

    if (isHovered) {
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      setTypedText("");

      for (let i = 0; i < phrase.length; i++) {
        const id = setTimeout(() => {
          setTypedText((prev) => prev + phrase.charAt(i));
        }, i * 25);
        timeoutsRef.current.push(id);
      }
    }

    return () => {
      timeoutsRef.current.forEach((id) => clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, [isHovered]);

  return (
    <section className="h-screen overflow-hidden bg-white dark:bg-themeDark">
      <ContainerGrid className="flex h-full flex-col items-center justify-center gap-8 px-4 text-center lg:text-left">
        <div className="relative flex flex-col-reverse items-center justify-center gap-10 lg:flex-row lg:gap-20">
          {/* Avatar + balão de fala */}
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
              className="rounded-3xl shadow-xl shadow-black/10 dark:shadow-white/10 transition-transform duration-300 hover:scale-105"
            />

            <div
              className={`
                absolute top-1/2 left-0 w-full ml-4 p-4 text-white bg-orange shadow-lg rounded-lg
                lg:top-0 lg:left-full lg:max-w-lg lg:rounded-tl-none lg:rounded-bl-lg
                transition-all duration-500 ease-out pointer-events-none
                ${isHovered
                  ? "opacity-100 scale-100 translate-y-0 lg:translate-x-0"
                  : "opacity-0 scale-95 -translate-y-10 lg:translate-y-0 lg:-translate-x-10"}
              `}
            >
              {typedText}
            </div>
          </div>

          {/* Título + botão */}
          <div className="max-w-3xl">
            <Heading
              as="h1"
              text="BEM-VINDO À SUA TRIAGEM INTELIGENTE"
              colorClass="text-orange"
              className="mb-8 text-4xl font-bold leading-tight animate-fade-in md:text-5xl lg:text-6xl"
            />
            <ButtonPrimary onClick={onStart}>Iniciar Triagem</ButtonPrimary>
          </div>
        </div>
      </ContainerGrid>
    </section>
  );
}
