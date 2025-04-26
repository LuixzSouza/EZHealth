import { CircleOrangeIcon } from "../CircleOrangeIcon";
import { ContainerGrid } from "../ContainerGrid";
import { ParagraphBlue } from "../ParagraphBlue";

export function TChooseSect() {
    return(
        <section>
            <ContainerGrid className="flex items-center justify-around" >
                <div className="flex flex-col items-center justify-center text-center max-w-96" >
                    <CircleOrangeIcon img={"/icons/relatorio-de-saude.svg"}/>
                    <div>
                        <h4 className="text-orange text-3xl font-bold" >INICIAR TRIAGEM</h4>
                        <ParagraphBlue>Responda algumas perguntas rápidas e seja direcionado ao especialista certo de forma ágil e eficiente.</ParagraphBlue>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center text-center max-w-96" >
                    <CircleOrangeIcon img={"/icons/relatorio-de-saude.svg"}/>
                    <div>
                        <h4 className="text-orange text-3xl font-bold" >PRECISO DE AJUDA</h4>
                        <ParagraphBlue>Solicite ajuda imediata! Esta opção é para pacientes que não conseguem realizar a triagem sozinhos e precisam de atendimento prioritário.</ParagraphBlue>
                    </div>
                </div>
            </ContainerGrid>
        </section>
    )
}