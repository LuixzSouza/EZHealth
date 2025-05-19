'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { HeadingOrange } from "../HeadingOrange";
import { ParagraphBlue } from "../ParagraphBlue";
import { ContainerGrid } from "../ContainerGrid";
import { ScrollDown } from "../ScrollDown";

export function HeroSection() {
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    gsap.from(textRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(imageRef.current, {
      opacity: 0,
      x: 50,
      duration: 1,
      delay: 0.5,
      ease: "power3.out",
    });
  }, []);

  return (
    <section className="relative w-full h-full overflow-hidden shadow-2xl shadow-black/10 pt-24">
      <ContainerGrid className="flex flex-col items-center justify-between pt-14 lg:flex-row lg:pt-0">
        <div
          className=" w-full max-w-2xl flex flex-col gap-7"
          ref={textRef}
        >
          <HeadingOrange text="AGILIDADE E EFICIÊNCIA NA TRIAGEM MÉDICA" />
          <ParagraphBlue>
            Bem-vindo ao <strong className="font-semibold text-3xl">EZHealth</strong>, a triagem inteligente que agiliza o atendimento, reduz filas e otimiza o fluxo de pacientes em hospitais e consultórios.
          </ParagraphBlue>
        </div>

        <div ref={imageRef}>
          <Image src="/images/avatar-2.png" width={400} height={200} alt="avatar" />
        </div>
      </ContainerGrid>

      <ScrollDown link="#swhatis" />
    </section>
  );
}
