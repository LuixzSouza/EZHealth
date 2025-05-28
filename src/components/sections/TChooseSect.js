import { CircleOrangeIcon } from "../CircleOrangeIcon";
import { ContainerGrid } from "../ContainerGrid";
import { ParagraphBlue } from "../ParagraphBlue";

function CardOption({ onClick, title, description }) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center text-center max-w-96 bg-orange/10 rounded-2xl p-8 gap-4 cursor-pointer
                 hover:bg-orange/20 hover:scale-105 transition-all duration-200 ease-in-out shadow-xl"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <CircleOrangeIcon img="/icons/relatorio-de-saude.svg" />
      <div>
        <h4 className="text-orange text-2xl md:text-3xl font-bold">
          {title}
        </h4>
        <ParagraphBlue>{description}</ParagraphBlue>
      </div>
    </div>
  );
}

export function TChooseSect({ onStart, onUrgent }) {
  return (
    <section className="pt-32" >
      <ContainerGrid className="flex flex-col items-center justify-center w-full min-h-screen gap-10 pt-28 md:flex-row md:pt-0">
        <CardOption
          onClick={onStart}
          title="INICIAR TRIAGEM"
          description="Responda perguntas rápidas para identificar os sintomas e receba o encaminhamento ideal, de forma ágil e eficiente."
        />
        <CardOption
          onClick={onUrgent}
          title="PRECISO DE AJUDA"
          description="Solicite ajuda prioritária. Essa opção é para pacientes que não conseguem realizar a triagem sozinhos e precisam de suporte imediato."
        />
      </ContainerGrid>
    </section>
  );
}
