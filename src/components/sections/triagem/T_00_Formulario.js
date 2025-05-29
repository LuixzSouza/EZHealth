'use client'

// Next - React
import { useState } from 'react';

// Componentes - Pages
import { Header } from '@/components/layout/Header';
import { T_01_TriagemHomeSect } from '@/components/sections/triagem/T_01_TriagemHomeSect';
import { T_02_ChooseSect } from '@/components/sections/triagem/T_02_ChooseSect';
import { T_03_CheckInSect } from '@/components/sections/triagem/T_03_CheckInSect';
import { T_04_VitalSigns } from './T_04_VitalSigns';
import { T_05_SymptomsDirector } from '@/components/sections/triagem/T_05_SymptomsDirector';
import { T_06_SymptomDuration } from './T_06_SymptomDuration';
import { T_07_MedicalHistory } from './T_07_MedicalHistory';
import { T_08_Medication } from './T_08_Medication';
import { T_End_Confirmed } from '@/components/sections/triagem/T_End_Confirmed';

// Modal
import { UrgentReceived } from '@/components/modals/UrgentReceived';
import { UEmergencyForm } from '../../modals/UEmergencyForm';
import { UrgentConfirmationModal } from '../../modals/UrgentConfirmationModal';

export default function T_00_Formulario() {
    const [currentStep, setCurrentStep] = useState(0);
    const [showUrgentModal, setShowUrgentModal] = useState(false);
    const [urgentDone, setUrgentDone] = useState(false);
    const [emergencyMode, setEmergencyMode] = useState(false);

    const handleStart = () => nextStep();
    const handleUrgent = () => setShowUrgentModal(true);

    // Mostrar o Fomrm de Emergencia
    const handleUrgentConfirm = () => {
    setShowUrgentModal(false);
    setEmergencyMode(true); 
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
    { title: 'Boas-vindas', component: () => <T_01_TriagemHomeSect onStart={handleStart} /> },
    { title: 'Escolha', component: () => <T_02_ChooseSect onStart={handleStart} onUrgent={handleUrgent} /> },
    { title: 'Check-in', component: () => <T_03_CheckInSect onNext={nextStep} /> },
    { title: 'Sinal Vital', component: () => <T_04_VitalSigns onNext={nextStep} /> },
    { title: 'Queixa Principal', component: () => <T_05_SymptomsDirector onNext={nextStep} /> },
    { title: 'Tempo de Sintomas', component: () => <T_06_SymptomDuration onNext={nextStep} /> },
    { title: 'Historico Médico', component: () => <T_07_MedicalHistory onNext={nextStep} /> },
    { title: 'Uso Medicamentos', component: () => <T_08_Medication onNext={nextStep} /> },
    { title: 'Confirmação', component: () => <T_End_Confirmed /> },
  ];

  if (emergencyMode) {
  return (
    <UEmergencyForm
      onNext={() => {
        setEmergencyMode(false);
        setUrgentDone(true); // marcar como finalizado e voltar ao fluxo
      }}
    />
  );
}

if (urgentDone) return <UrgentReceived />;


  return (
    <div className="flex items-center justify-center flex-col relative">
      <Header />
      <div className="flex-grow w-full h-full">
        {steps[currentStep]?.component()}
      </div>

 {!showUrgentModal && !urgentDone && ![0, 1, 2, 3, 4, 5, 6, 7, 8].includes(currentStep) && (     
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