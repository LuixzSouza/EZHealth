import Image from "next/image";
import { HeadingOrange } from "../HeadingOrange";
import { ParagraphBlue } from "../ParagraphBlue";
import { ContainerGrid } from "../ContainerGrid";
import { ScrollDown } from "../ScrollDown";

export function HeroSection() {
    return(
        <section className="relative w-full h-full overflow-hidden shadow-2xl shadow-black/10 pt-24" >
            <ContainerGrid className="flex items-center justify-between" >
                <div className="w-full max-w-2xl flex flex-col gap-7" >
                    <HeadingOrange text="AGILIDADE E EFICIÊNCIA NA TRIAGEM MÉDICA" />
                    <ParagraphBlue>
                        Bem-vindo ao <strong className="font-semibold text-3xl">EZHealth</strong>, a triagem inteligente que agiliza o atendimento, reduz filas e otimiza o fluxo de pacientes em hospitais e consultórios.
                    </ParagraphBlue>
                </div>
                <div>
                    <Image src={"/images/avatar-2.png"} width={400} height={200} alt="avatar"/>
                </div>
            </ContainerGrid>
            <ScrollDown/>
        </section>
    )
}