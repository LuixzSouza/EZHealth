'use client'

import { Header } from "@/components/layout/Header";
import { Menu } from "@/components/layout/Menu";
import { H_BeneficiosSection } from "@/components/sections/home/H_BeneficiosSection";
import { H_ContactUsSection } from "@/components/sections/home/H_ContactUsSection";
import { HeroSection } from "@/components/sections/home/HeroSection";
import { H_HowWorksSection } from "@/components/sections/home/H_HowWorksSection";
import { H_VideoSection } from "@/components/sections/home/H_VideoSection";
import { H_WhatIsSection } from "@/components/sections/home/H_WhatIsSection";

export default function Home() {
  const handleSubmit = async () => {
  const dados = {
    nome: 'Maria',
    telefone: '11 99999-0000',
    email: 'maria@email.com',
    sintomas: 'Dor de cabeça, febre'
  };

  const res = await fetch('/api/triagem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  });

  const json = await res.json();
  console.log(json);
};

  return (
    <>
      <Menu/>
      <Header/>
      <HeroSection/>
      <H_WhatIsSection/>
      <H_BeneficiosSection/>
      <H_HowWorksSection/>
      <H_VideoSection/>
      <H_ContactUsSection/>
      {/* <button onClick={handleSubmit} style={{margin: '2rem', padding: '1rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px'}}>
        Enviar dados de teste
      </button> */}
    </>
  );
}
