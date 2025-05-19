'use client'

import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";
import { BeneficiosSection } from "@/components/sections/BeneficiosSection";
import { ContactUsSection } from "@/components/sections/ContactUsSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowWorksSection } from "@/components/sections/HowWorksSection";
import { VideoSection } from "@/components/sections/VideoSection";
import { WhatIsSection } from "@/components/sections/WhatIsSection";

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
      <WhatIsSection/>
      <BeneficiosSection/>
      <HowWorksSection/>
      <VideoSection/>
      <ContactUsSection/>
      <button onClick={handleSubmit} style={{margin: '2rem', padding: '1rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px'}}>
        Enviar dados de teste
      </button>

    </>
  );
}
