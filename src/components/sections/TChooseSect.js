import { CircleOrangeIcon } from "../CircleOrangeIcon";
import { ContainerGrid } from "../ContainerGrid";
import { ParagraphBlue } from "../ParagraphBlue";

export function TChooseSect({ onStart, onUrgent }) {
     return (
        <section>
            <ContainerGrid className="flex items-center justify-around w-full h-screen ">
                <div onClick={onStart} className="flex flex-col items-center justify-center text-center max-w-96 bg-orange/10 rounded-2xl p-8 hover:bg-orange/50 hover:scale-105 cursor-pointer gap-4 transition-all duration-100 ease-in-out ">
                    <CircleOrangeIcon img="/icons/relatorio-de-saude.svg" />
                    <div >
                        <h4
                        className="text-orange text-3xl font-bold cursor-pointer"
                        >
                        INICIAR TRIAGEM
                        </h4>
                        <ParagraphBlue>
                        Responda algumas perguntas rápidas e seja direcionado ao especialista certo de forma ágil e eficiente.
                        </ParagraphBlue>
                    </div>
                </div>

                <div onClick={onUrgent} className="flex flex-col items-center justify-center text-center max-w-96 bg-orange/10 rounded-2xl p-8 hover:bg-orange/50 hover:scale-105 cursor-pointer gap-4 transition-all duration-100 ease-in-out">
                    <CircleOrangeIcon img="/icons/relatorio-de-saude.svg" />
                    <div >
                        <h4
                        className="text-orange text-3xl font-bold cursor-pointer"
                        >
                        PRECISO DE AJUDA
                        </h4>
                        <ParagraphBlue>
                        Solicite ajuda imediata! Esta opção é para pacientes que não conseguem realizar a triagem sozinhos e precisam de atendimento prioritário.
                        </ParagraphBlue>
                    </div>
                </div>
            </ContainerGrid>
        </section>
    );
}