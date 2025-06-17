import Link from "next/link";
import { CircleOrangeIcon } from "../theme/CircleOrangeIcon";
import { motion } from "framer-motion";
// NOVO: Ícones mais adequados para o ambiente hospitalar
import { UserGroupIcon, ComputerDesktopIcon, BellAlertIcon } from "@heroicons/react/24/solid"; 

export function UrgentReceived({ ticketId = "UN-170625-A8B3" }) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-themeDark">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl text-center"
      >
        <div className="flex justify-center">
          <CircleOrangeIcon img="/icons/relatorio-de-saude.svg" />
        </div>

        {/* MELHORIA: Título mais apropriado para a conclusão de uma etapa no local */}
        <h2 className="text-3xl md:text-4xl font-bold text-orange mt-8">
          Triagem Concluída com Sucesso!
        </h2>

        <p className="mt-4 text-zinc-600 dark:text-zinc-300 text-base md:text-lg">
          Seus dados foram registrados. Por favor, siga as instruções abaixo para seu atendimento.
        </p>
        
        {/* MELHORIA: O protocolo agora é a "senha do painel", muito mais contextual */}
        <div className="mt-6 bg-blue-100 dark:bg-blue-900/40 border border-dashed border-blue-300 dark:border-blue-800 rounded-lg p-3 inline-block">
            <p className="text-sm text-blue-800 dark:text-blue-200">Sua senha para o painel é:</p>
            <p className="text-2xl font-bold text-blue-800 dark:text-blue-200 tracking-wider">{ticketId}</p>
        </div>

        {/* MELHORIA: A seção de "próximos passos" agora é específica para o ambiente hospitalar */}
        <div className="mt-10 text-left bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mb-4">Próximos Passos:</h3>
            <ul className="space-y-4 text-zinc-600 dark:text-zinc-300">
                <li className="flex items-start gap-4">
                    <UserGroupIcon className="w-7 h-7 text-green-500 mt-1 flex-shrink-0" />
                    <span>
                        <span className="font-bold">Dirija-se à sala de espera</span> e aguarde confortavelmente.
                    </span>
                </li>
                <li className="flex items-start gap-4">
                    <ComputerDesktopIcon className="w-7 h-7 text-green-500 mt-1 flex-shrink-0" />
                    <span>
                        <span className="font-bold">Fique atento ao painel de chamadas.</span> Sua senha será exibida lá quando for sua vez.
                    </span>
                </li>
                 <li className="flex items-start gap-4">
                    <BellAlertIcon className="w-7 h-7 text-orange mt-1 flex-shrink-0" />
                    <span>
                       Se seus sintomas piorarem enquanto aguarda, <span className="font-bold text-orange underline">informe a recepção imediatamente.</span>
                    </span>
                </li>
            </ul>
        </div>
        
        {/* REMOVIDO: O botão "Voltar à Página Inicial" não faz sentido em um totem de hospital. O fluxo do usuário termina aqui. */}
        {/* Opcional: Pode haver um botão "Finalizar" que limpa a tela para o próximo paciente. */}
        <button
          onClick={() => window.location.reload()} // Exemplo simples para reiniciar o fluxo
          className="mt-12 inline-block bg-orange text-white px-8 py-3 rounded-full text-base font-medium hover:bg-orange/90 transition-transform hover:scale-105"
        >
          Finalizar e Limpar Tela
        </button>

      </motion.div>
    </section>
  );
}