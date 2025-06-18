import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
    UserGroupIcon, 
    ComputerDesktopIcon, 
    BellAlertIcon, 
    ClipboardDocumentCheckIcon,
    XCircleIcon // NOVO: Ícone para limpar o campo
} from "@heroicons/react/24/solid";
import { CircleOrangeIcon } from "../theme/CircleOrangeIcon";
import { useSpeechToForm } from "@/hooks/useSpeechToForm";
import { UrgentConfirmationModal } from "./UrgentConfirmationModal";

const urgencias = [
  // ... lista de urgências não muda
  { name: 'respirar', label: 'Dificuldade para respirar' },
  { name: 'dor_peito', label: 'Dor intensa no peito' },
  { name: 'desmaio', label: 'Desmaios ou convulsões' },
  { name: 'sangramento', label: 'Hemorragia' },
  { name: 'consciencia', label: 'Alteração de consciência' },
  { name: 'nenhuma', label: 'Nenhuma das anteriores' },
];

const MicrophoneIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5a6 6 0 0 0-12 0v1.5a6 6 0 0 0 6 6Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5" />
  </svg>
);

export function UEmergencyForm() {
  const [view, setView] = useState('form');
  const [submittedData, setSubmittedData] = useState(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { activeField, startListening, hasRecognitionSupport } = useSpeechToForm({ setValue });
  
  // NOVO: Observa os valores dos campos para mostrar o botão de limpar
  const nomeValue = watch('nome');
  // Adicionei de volta o campo de sintoma para demonstrar a reutilização
  const sintomaValue = watch('sintoma');

  const urgentWatch = watch('urgencia'); 

  useEffect(() => {
    // ... useEffects não mudam ...
    setIsClient(true);
    if (urgentWatch?.nenhuma) {
      urgencias.forEach(u => u.name !== 'nenhuma' && setValue(`urgencia.${u.name}`, false));
    } else if (Object.values(urgentWatch || {}).some(v => v)) {
      if (urgentWatch?.nenhuma !== false) setValue('urgencia.nenhuma', false);
    }
  }, [urgentWatch, setValue]);

  const handleFormSubmit = (data) => {
    // ... função handleFormSubmit não muda ...
    const selectedUrgencies = Object.entries(data.urgencia || {})
      .filter(([key, value]) => value === true && key !== 'nenhuma')
      .map(([key]) => urgencias.find(u => u.name === key)?.label)
      .filter(Boolean);

    const processedData = {
      nome: data.nome,
      sintomaPrincipal: data.sintoma, // Adicionando o sintoma aos dados processados
      sintomas: selectedUrgencies,
      ticketId: `UN-${Date.now().toString().slice(-6)}`
    };

    setSubmittedData(processedData);
    setView('confirmation');
  };
  
  const onSubmit = (data) => {
    const isUrgent = Object.values(data.urgencia || {}).some(v => v) && !data.urgencia.nenhuma;
    if (isUrgent) {
      setShowModal(true);
    } else {
      handleFormSubmit(data);
    }
  };

  const handleConfirmUrgencia = () => {
    handleFormSubmit(watch());
    setShowModal(false);
  };
  const handleCancelUrgencia = () => setShowModal(false);
  
  if (view === 'confirmation' && submittedData) {
    return <UrgentReceivedView data={submittedData} />;
  }

  return (
    <section className="py-8 flex items-center justify-center w-full bg-zinc-50 dark:bg-themeDark px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl p-8 flex flex-col gap-8 w-full max-w-lg dark:text-white">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-orange">Triagem de Urgência</h2>
          <p className="text-zinc-600 dark:text-zinc-300 mt-2">Você pode preencher para outra pessoa.</p>
        </div>

        {/* Campo Nome com botão de limpar */}
        <div className="flex flex-col gap-2">
          <label htmlFor="nome" className="font-semibold text-zinc-800 dark:text-white">Nome do Paciente</label>
          <div className="relative">
            <input
              id="nome" type="text"
              disabled={!!activeField}
              placeholder={activeField === 'nome' ? "Ouvindo..." : "Digite ou use o microfone"}
              {...register("nome", { required: "O nome é obrigatório" })}
              className="w-full p-3 pr-20 border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 rounded-md focus:ring-2 focus:ring-orange focus:border-transparent transition disabled:bg-zinc-200 dark:disabled:bg-zinc-700"
            />
            {/* NOVO: Agrupamento dos ícones à direita */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {nomeValue && !activeField && (
                <button type="button" onClick={() => setValue('nome', '', { shouldFocus: true })} title="Limpar campo">
                  <XCircleIcon className="w-6 h-6 text-zinc-400 hover:text-red-500 transition-colors" />
                </button>
              )}
              {isClient && hasRecognitionSupport && (
                <button
                    type="button" onClick={() => startListening('nome')}
                    disabled={!!activeField} title="Falar o nome"
                    className={`p-1 rounded-full transition-colors ${activeField === 'nome' ? 'bg-red-500 text-white animate-pulse' : 'text-zinc-500 hover:text-orange'}`}
                >
                    <MicrophoneIcon className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
        </div>

        {/* Campo Sintoma com botão de limpar */}
        <div className="flex flex-col gap-2">
          <label htmlFor="sintoma" className="font-semibold text-zinc-800 dark:text-white">Descreva o principal sintoma (opcional)</label>
          <div className="relative">
            <textarea
              id="sintoma" rows={3}
              disabled={!!activeField}
              placeholder={activeField === 'sintoma' ? "Ouvindo..." : "Ex: forte dor de cabeça, febre alta..."}
              {...register("sintoma")}
              className="w-full p-3 pr-20 border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 rounded-md focus:ring-2 focus:ring-orange focus:border-transparent transition disabled:bg-zinc-200 dark:disabled:bg-zinc-700"
            />
             <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {sintomaValue && !activeField && (
                <button type="button" onClick={() => setValue('sintoma', '', { shouldFocus: true })} title="Limpar campo">
                  <XCircleIcon className="w-6 h-6 text-zinc-400 hover:text-red-500 transition-colors" />
                </button>
              )}
              {isClient && hasRecognitionSupport && (
                <button
                    type="button" onClick={() => startListening('sintoma')}
                    disabled={!!activeField} title="Falar o sintoma"
                    className={`p-1 rounded-full transition-colors ${activeField === 'sintoma' ? 'bg-red-500 text-white animate-pulse' : 'text-zinc-500 hover:text-orange'}`}
                >
                    <MicrophoneIcon className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Checkboxes de Urgência */}
        <div className="flex flex-col gap-4 bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-lg border border-blue-100 dark:border-blue-900/20">
          <p className="font-semibold text-zinc-800 dark:text-zinc-200 text-center text-base">O paciente apresenta alguma das situações abaixo?</p>
          {urgencias.map((item) => (
            <label key={item.name} className="flex items-center gap-4 p-4 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg cursor-pointer transition hover:border-orange hover:bg-orange/5">
              <input type="checkbox" {...register(`urgencia.${item.name}`)} className="accent-orange w-5 h-5" />
              <span className="text-zinc-800 dark:text-zinc-200 text-base">{item.label}</span>
            </label>
          ))}
        </div>

        <button type="submit" className="mt-4 bg-orange text-white font-bold py-3 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition text-lg">
          Próximo
        </button>
      </form>

      {showModal && <UrgentConfirmationModal onConfirm={handleConfirmUrgencia} onCancel={handleCancelUrgencia} />}
    </section>
  );
}

// O componente de confirmação agora exibe o sintoma principal também
function UrgentReceivedView({ data }) {
  const { nome, ticketId, sintomas, sintomaPrincipal } = data;

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-themeDark">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full max-w-2xl text-center">
        {/* ... (cabeçalho da confirmação não muda) ... */}
        <div className="flex justify-center">
          <CircleOrangeIcon img="/icons/relatorio-de-saude.svg" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-orange mt-8">Triagem de {nome} Concluída!</h2>
        <p className="mt-4 text-zinc-600 dark:text-zinc-300 text-base md:text-lg">Seus dados foram registrados. Por favor, siga as instruções abaixo.</p>
        
        <div className="mt-6 bg-blue-100 dark:bg-blue-900/40 border border-dashed border-blue-300 dark:border-blue-800 rounded-lg p-3 inline-block">
            <p className="text-sm text-blue-800 dark:text-blue-200">Sua senha para o painel é:</p>
            <p className="text-2xl font-bold text-blue-800 dark:text-blue-200 tracking-wider">{ticketId}</p>
        </div>

        {/* Resumo da Triagem */}
        <div className="mt-10 text-left bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <ClipboardDocumentCheckIcon className="w-7 h-7 text-orange"/>
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-white">Resumo da sua Triagem</h3>
          </div>
          <div className="mt-4 border-t border-zinc-200 dark:border-zinc-700 pt-4 space-y-2">
              <p className="text-zinc-600 dark:text-zinc-300"><span className="font-bold">Paciente:</span> {nome}</p>
              {sintomaPrincipal && (
                <p className="text-zinc-600 dark:text-zinc-300"><span className="font-bold">Sintoma Principal:</span> {sintomaPrincipal}</p>
              )}
              {sintomas?.length > 0 && (
                  <div className="mt-2">
                      <p className="font-bold text-zinc-600 dark:text-zinc-300">Sintomas de Urgência informados:</p>
                      <ul className="list-disc list-inside mt-1 text-zinc-600 dark:text-zinc-300">
                          {sintomas.map(sintoma => <li key={sintoma}>{sintoma}</li>)}
                      </ul>
                  </div>
              )}
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="mt-8 text-left bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mb-4">Próximos Passos:</h3>
            <ul className="space-y-4 text-zinc-600 dark:text-zinc-300">
              <li className="flex items-start gap-4"><UserGroupIcon className="w-7 h-7 text-green-500 mt-1 flex-shrink-0" /><span><span className="font-bold">Dirija-se à sala de espera</span> e aguarde.</span></li>
              <li className="flex items-start gap-4"><ComputerDesktopIcon className="w-7 h-7 text-green-500 mt-1 flex-shrink-0" /><span><span className="font-bold">Fique atento ao painel de chamadas.</span> Sua senha será exibida lá.</span></li>
              <li className="flex items-start gap-4"><BellAlertIcon className="w-7 h-7 text-orange mt-1 flex-shrink-0" /><span>Se seus sintomas piorarem, <span className="font-bold text-orange underline">informe a recepção imediatamente.</span></span></li>
            </ul>
        </div>
        
        <button onClick={() => window.location.reload()} className="mt-12 inline-block bg-orange text-white px-8 py-3 rounded-full text-base font-medium hover:bg-orange/90 transition-transform hover:scale-105">
          Finalizar e Limpar Tela
        </button>
      </motion.div>
    </section>
  );
}