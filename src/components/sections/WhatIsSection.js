import Image from "next/image";
import { ContainerGrid } from "../ContainerGrid";
import { HeadingOrange } from "../HeadingOrange";
import { ParagraphBlue } from "../ParagraphBlue";

export function WhatIsSection() {
    return(
        <section className="py-14" id="swhatis" >
            <ContainerGrid className="flex flex-col items-center justify-between lg:flex-row" >
                <div className="w-full max-w-2xl flex flex-col gap-7" >
                    <HeadingOrange text="O que é EZHealth?" />
                    <ParagraphBlue>
                        O <strong className="font-semibold text-3xl">EZHealth</strong> é um software de <strong className="font-semibold text-3xl">triagem rápida e inteligente</strong> para hospitais e consultórios, agilizando o atendimento por meio de <strong className="font-semibold text-3xl">check-in digital, formulário de triagem</strong> e <strong className="font-semibold text-3xl">direcionamento automático</strong> ao especialista.
                    </ParagraphBlue>
                    <ParagraphBlue>
                        Conta com uma <strong className="font-semibold text-3xl">opção de emergência</strong> para priorizar pacientes em estado crítico. 
                    </ParagraphBlue>
                    <ParagraphBlue>
                        Totalmente <strong className="font-semibold text-3xl">personalizável</strong> e integrado a sistemas hospitalares, melhora a gestão, reduz filas e otimiza recursos.
                    </ParagraphBlue>
                </div>
                <div>
                    <Image src={"/images/avatar-4.png"} width={400} height={200} alt="avatar"/>
                </div>
            </ContainerGrid>
        </section>
    )
}