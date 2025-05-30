'use client';

import { ContainerGrid } from "../../layout/ContainerGrid";
import { ListFunctions } from '../../layout/ListFunctions';
import { Heading } from '@/components/typography/Heading';

export function H_HowWorksSection() {

  return (
    <section className="dark:bg-themeDark py-14 overflow-hidden" id="scomofunciona">
      <ContainerGrid>
        <Heading colorClass='dark:text-orangeDark text-orange' text='Como funciona o EZHealth?'/>
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
