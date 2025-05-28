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
    const tl = gsap.timeline();

    tl.set([textRef.current, imageRef.current], { autoAlpha: 0 }) // invisível inicialmente

      .to(textRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      })

      .to(
        imageRef.current,
        {
          autoAlpha: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.5" // começa antes da anterior terminar
      );
  }, []);

  return (
    <section className="relative w-full h-full overflow-hidden shadow-2xl shadow-black/10 pt-24">
      <ContainerGrid className="flex flex-col items-center justify-between pt-14 lg:flex-row lg:pt-0">
        <div
          className="w-full max-w-2xl flex flex-col gap-7 opacity-0 translate-y-6" // estado inicial se JS falhar
          ref={textRef}
        >
          <HeadingOrange text="AGILIDADE E EFICIÊNCIA NA TRIAGEM MÉDICA" />
          <ParagraphBlue>
            Bem-vindo ao <strong className="font-semibold">EZHealth</strong>, a triagem inteligente que agiliza o atendimento, reduz filas e otimiza o fluxo de pacientes em hospitais e consultórios.
          </ParagraphBlue>
        </div>

        <div
          className="opacity-0 translate-x-6"
          ref={imageRef}
        >
          <Image
            src="/images/avatar-2.png"
            width={400}
            height={200}
            alt="avatar"
            priority
          />
        </div>
      </ContainerGrid>

      <ScrollDown link="#swhatis" />
    </section>
  );
}
