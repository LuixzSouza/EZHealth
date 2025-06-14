'use client';

import { useState } from 'react';

import { ContainerGrid } from '../../layout/ContainerGrid';
import { Heading } from '@/components/typography/Heading';

const beneficios = [
  { titulo: 'Redução do tempo de espera', descricao: 'Check-in digital e triagem automatizada agilizam o atendimento.' },
  { titulo: 'Encaminhamento inteligente', descricao: 'Direcionamento ao especialista adequado, evitando consultas desnecessárias.' },
  { titulo: 'Interface personalizada', descricao: 'Adaptação ao layout e identidade visual de cada cliente.' },
  { titulo: 'Compatibilidade com sistemas', descricao: 'Integração com prontuários eletrônicos e sistemas hospitalares.' },
  { titulo: 'Organização do fluxo de pacientes', descricao: 'Otimização de recursos e redução de custos operacionais.' },
];

export function H_BeneficiosSection() {
  const [ativo, setAtivo] = useState(null);

  const toggle = (index) => setAtivo(ativo === index ? null : index);

  return (
    <section className="dark:bg-themeDark py-14 overflow-hidden" id="sbeneficio">
      <ContainerGrid>
        
        <Heading colorClass='dark:text-themeTextDark text-DarkBlue' text='Benefícios EZHealth'/>
        <div className="flex flex-col items-center justify-start mt-10 gap-4">
          {beneficios.map((item, index) => (
            <div
              key={index}
              // armazena a referência de cada card
              className="w-full bg-orange text-white rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
              >
                <span className="text-2xl md:text-3xl font-semibold">{item.titulo}</span>
                <span className="text-base md:text-2xl">{ativo === index ? '−' : '+'}</span>
              </button>
              {ativo === index && (
                <div className=" bg-white/30 px-6 py-4 text-white text-2xl">
                  {item.descricao}
                </div>
              )}
            </div>
          ))}
        </div>
      </ContainerGrid>
    </section>
  );
}
