'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { TCheckInSecti } from "@/components/sections/TCheckInSecti";
import { TChooseSect } from "@/components/sections/TChooseSect";
import { TConfirmed } from "@/components/sections/TConfirmed";
import { TriagemHomeSect } from "@/components/sections/TriagemHomeSect";
import { TSymptomsForm } from "@/components/sections/TSymptomsForm";

export default function TFormulario() {
  const steps = [
    { title: 'Boas-vindas', component: <TriagemHomeSect /> },
    { title: 'Escolha', component: <TChooseSect /> },
    { title: 'Check-in', component: <TCheckInSecti /> },
    { title: 'Formulario', component: <TSymptomsForm /> },
    { title: 'Confirmação', component: <TConfirmed /> },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex items-center justify-center flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <div className="min-h-screen">
          {steps[currentStep].component}
        </div>
      </div>

      <div className="fixed bottom-0 w-full flex justify-between items-center p-6 bg-transparent shadow-md z-20">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`px-4 py-2 rounded-md border ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
        >
          Voltar
        </button>

        <span className="text-gray-700 font-bold">
          Etapa {currentStep + 1} de {steps.length}: {steps[currentStep].title}
        </span>

        <button
          onClick={nextStep}
          className="px-4 py-2 rounded-md bg-orange text-white hover:bg-orange-dark"
        >
          {currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
        </button>
      </div>
    </div>
  );
}
