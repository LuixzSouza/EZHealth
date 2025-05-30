
import { ContainerGrid } from "@/components//layout/ContainerGrid";
import { CardOption } from "@/components/layout/CardOption";

export function T_02_ChooseSect({ onStart, onUrgent }) {
  return (
    <section className="dark:bg-themeDark" >
      <ContainerGrid className="flex flex-col items-center justify-center w-full h-[85vh] gap-10 pt-28 md:flex-row md:pt-0">
        <CardOption
          onClick={onStart}
          img={"play"}
          title="INICIAR TRIAGEM"
          description="Responda perguntas rápidas para identificar os sintomas e receba o encaminhamento ideal, de forma ágil e eficiente."
        />
        <CardOption
          onClick={onUrgent}
          img={"sinal-de-aviso"}
          title="PRECISO DE AJUDA"
          description="Solicite ajuda prioritária. Essa opção é para pacientes que não conseguem realizar a triagem sozinhos e precisam de suporte imediato."
        />
      </ContainerGrid>
    </section>
  );
}
