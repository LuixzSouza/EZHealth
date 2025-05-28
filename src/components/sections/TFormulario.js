'use client'

import { useState } from 'react';
import { Header } from '@/components/Header';
import { TCheckInSecti } from '@/components/sections/TCheckInSecti';
import { TConfirmed } from '@/components/sections/TConfirmed';
import { TriagemHomeSect } from '@/components/sections/TriagemHomeSect';
import { TSymptomsForm } from '@/components/sections/TSymptomsForm';
import { TChooseSect } from '@/components/sections/TChooseSect';
import { UrgentConfirmationModal } from '@/components/UrgentConfirmationModal';
import { UrgentReceived } from '@/components/UrgentReceived';

export default function TFormulario() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showUrgentModal, setShowUrgentModal] = useState(false);
  const [urgentDone, setUrgentDone] = useState(false);

  const handleStart = () => nextStep();
  const handleUrgent = () => setShowUrgentModal(true);
  const handleUrgentConfirm = () => {
    setShowUrgentModal(false);
    setUrgentDone(true);
  };
  const handleUrgentCancel = () => setShowUrgentModal(false);

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

  const steps = [
    { title: 'Boas-vindas', component: () => <TriagemHomeSect onStart={handleStart} /> },
    { title: 'Escolha', component: () => <TChooseSect onStart={handleStart} onUrgent={handleUrgent} /> },
    { title: 'Check-in', component: () => <TCheckInSecti onNext={nextStep} /> },
    { title: 'Formulário', component: () => <TSymptomsForm onNext={nextStep} /> },
    { title: 'Confirmação', component: () => <TConfirmed /> },
  ];

  if (urgentDone) return <UrgentReceived />;

  return (
    <div className="flex items-center justify-center flex-col min-h-screen relative">
      <Header />
      <div className="flex-grow w-full min-h-screen">
        {steps[currentStep]?.component()}
      </div>

      {!showUrgentModal && !urgentDone && currentStep !== 0 && currentStep !== 1 && currentStep !== 2 && currentStep !== 3 && currentStep !== 4 && (
        <StepNavigator
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={nextStep}
          onBack={prevStep}
          title={steps[currentStep].title}
        />
      )}

      {showUrgentModal && (
        <UrgentConfirmationModal
          onConfirm={handleUrgentConfirm}
          onCancel={handleUrgentCancel}
        />
      )}
    </div>
  );
}

function StepNavigator({ currentStep, totalSteps, onNext, onBack, title }) {
  return (
    <div className="fixed bottom-0 w-full flex justify-between items-center p-6 bg-white shadow z-20">
      <button
        onClick={onBack}
        disabled={currentStep === 0}
        className={`px-4 py-2 rounded-md border ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
        aria-label="Voltar etapa"
      >
        Voltar
      </button>

      <span className="text-gray-700 font-bold text-sm sm:text-base">
        Etapa {currentStep + 1} de {totalSteps}: {title}
      </span>

      <button
        onClick={onNext}
        disabled={currentStep === totalSteps - 1}
        className={`px-4 py-2 rounded-md text-white ${currentStep === totalSteps - 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange hover:bg-orange-dark'}`}
        aria-label="Avançar etapa"
      >
        {currentStep === totalSteps - 1 ? 'Aguarde...' : 'Próximo'}
      </button>
    </div>
  );
}