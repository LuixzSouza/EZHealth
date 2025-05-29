
import Link from "next/link";
import { CircleOrangeIcon } from "../theme/CircleOrangeIcon";

export function UrgentReceived() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-themeDark">
      <div className="animate-bounce-slow">
        <CircleOrangeIcon img="/icons/relatorio-de-saude.svg" />
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-orange mt-6">
        Pedido de Ajuda Recebido!
      </h2>

      <p className="mt-4 text-blue-600 max-w-md text-base md:text-lg">
        Sua solicitação de atendimento prioritário foi registrada com sucesso.
        Nossa equipe entrará em contato com você o mais breve possível.
      </p>

      <Link
        href="/"
        className="mt-8 inline-block bg-orange text-white px-6 py-3 rounded-full text-sm md:text-base font-medium hover:bg-orange/90 transition"
      >
        Voltar à Página Inicial
      </Link>
    </section>
  );
}
