import { CircleOrangeIcon } from "./CircleOrangeIcon";

// New component: screen shown after urgent is confirmed
export function UrgentReceived() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <CircleOrangeIcon img="/icons/relatorio-de-saude.svg" />
      <h2 className="text-3xl text-orange font-bold mt-4">Pedido de Ajuda Recebido!</h2>
      <p className="mt-2 max-w-lg text-blue-600">
        Recebemos sua solicitação de atendimento prioritário. Um de nossos especialistas entrará em contato com você em breve.
      </p>
    </section>
  );
}