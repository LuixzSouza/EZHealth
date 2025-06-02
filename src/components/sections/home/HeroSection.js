'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { HeadingOrange } from "../../theme/HeadingOrange";
import { ParagraphBlue } from "../../theme/ParagraphBlue";
import { ContainerGrid } from "../../layout/ContainerGrid";
import { ScrollDown } from "../../utils/ScrollDown";
import { Heading } from "@/components/typography/Heading";
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";
import Link from "next/link";

export function HeroSection() {
  const textRef = useRef(null);
  const imageRef = useRef(null);

useEffect(() => {
  if (typeof window !== "undefined" && window.innerWidth >= 768) {
    const tl = gsap.timeline();

    tl.set([textRef.current, imageRef.current], { autoAlpha: 0 })

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
        "-=0.5"
      );
  } else {
    // Se for mobile, garantir que fique visível sem animação
    if (textRef.current && imageRef.current) {
      gsap.set([textRef.current, imageRef.current], { autoAlpha: 1, x: 0, y: 0 });
    }
  }
}, []);

  return (
    <section className="dark:bg-themeDark relative w-full h-full overflow-hidden shadow-2xl shadow-black/10">
      <ContainerGrid className="flex flex-col items-center justify-between pt-14 lg:flex-row lg:pt-0">
        <div
          className="w-full max-w-2xl flex flex-col items-center text-center lg:items-start lg:text-start gap-7 opacity-0 translate-y-6 " // estado inicial se JS falhar
          ref={textRef}
        >
          <Heading as="h1" className="md:text-7xl" colorClass='dark:text-orangeDark text-orange' text='AGILIDADE E EFICIÊNCIA NA TRIAGEM MÉDICA'/>
          <ParagraphBlue>
            Bem-vindo ao <strong className="font-semibold">EZHealth</strong>, a triagem inteligente que agiliza o atendimento, reduz filas e otimiza o fluxo de pacientes em hospitais e consultórios.
          </ParagraphBlue>
          <Link href={"/triagem"} >
            <ButtonPrimary>Acessar Triagem</ButtonPrimary>
          </Link>
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
