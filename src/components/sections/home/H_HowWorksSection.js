'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ContainerGrid } from "../../layout/ContainerGrid";
import { HeadingOrange } from "../../theme/HeadingOrange";
import { ListFunctions } from '../../layout/ListFunctions';

gsap.registerPlugin(ScrollTrigger);

export function H_HowWorksSection() {
  const itemsRef = useRef([]);

  useEffect(() => {
    itemsRef.current.forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 50,
        duration: 0.6,
        ease: 'power3.out',
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="dark:bg-themeDark py-14 overflow-hidden" id="scomofunciona">
      <ContainerGrid>
        <HeadingOrange text="Como funciona o EZHealth?" />
        <div className="flex flex-col gap-8 mt-10">
          {[
            {
              img: "pesquisa-de-lupa.svg",
              title: "Check - in digital",
              text: "O paciente realiza o check-in diretamente pelo sistema, informando: Nome, CPF e Numeração do Convênio."
            },
            {
              img: "relatorio-de-saude.svg",
              title: "Preenchimento do formulário",
              text: "O paciente responde a um questionário inteligente sobre seus sintomas e histórico médico. O sistema utiliza algoritmos para analisar as informações e sugerir o melhor encaminhamento."
            },
            {
              img: "auto-direcionamento.svg",
              title: "Direcionamento automático para o especialista",
              text: "Com base nas respostas, o EzHealth identifica a especialidade médica mais adequada e encaminha o paciente para o profissional correto, otimizando o fluxo de atendimento."
            },
            {
              img: "verifica.svg",
              title: "Geração de senha e informação da sala",
              text: "Após a triagem, o paciente recebe uma senha digital contendo: Número da senha para atendimento, Nome do especialista e Número da sala onde será atendido."
            }
          ].map((item, index) => (
            <div
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
            >
              <ListFunctions
                img={item.img}
                title={item.title}
                text={item.text}
              />
            </div>
          ))}
        </div>
      </ContainerGrid>
    </section>
  );
}
