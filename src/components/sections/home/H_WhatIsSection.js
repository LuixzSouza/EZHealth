'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from "next/image";
import { ContainerGrid } from '@/components/layout/ContainerGrid';
import { ParagraphBlue } from '@/components/theme/ParagraphBlue';
import { Heading } from '@/components/typography/Heading';

gsap.registerPlugin(ScrollTrigger);

export function H_WhatIsSection() {
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        x: -50,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from(imageRef.current, {
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        x: 50,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert(); // limpa ao desmontar
  }, []);

  return (
    <section className="dark:bg-themeDark py-14 overflow-hidden" id="swhatis">
      <ContainerGrid className="flex flex-col items-center justify-between lg:flex-row">
        <div ref={textRef} className="w-full max-w-2xl flex flex-col gap-7">
          <Heading colorClass='dark:text-orangeDark text-orange' text='O que é EZHealth?'/>
          <ParagraphBlue>
            O <strong className="font-semibold ">EZHealth</strong> é um software de <strong className="font-semibold ">triagem rápida e inteligente</strong> para hospitais e consultórios, agilizando o atendimento por meio de <strong className="font-semibold ">check-in digital, formulário de triagem</strong> e <strong className="font-semibold ">direcionamento automático</strong> ao especialista.
          </ParagraphBlue>
          <ParagraphBlue>
            Conta com uma <strong className="font-semibold">opção de emergência</strong> para priorizar pacientes em estado crítico. 
          </ParagraphBlue>
          <ParagraphBlue>
            Totalmente <strong className="font-semibold ">personalizável</strong> e integrado a sistemas hospitalares, melhora a gestão, reduz filas e otimiza recursos.
          </ParagraphBlue>
        </div>

        <div ref={imageRef}>
          <Image src="/images/avatar-4.png" width={400} height={200} alt="avatar" />
        </div>
      </ContainerGrid>
    </section>
  );
}
