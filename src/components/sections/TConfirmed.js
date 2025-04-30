import { ContainerGrid } from "../ContainerGrid";
import { HeadingOrange } from "../HeadingOrange";
import { ParagraphBlue } from "../ParagraphBlue";

export function TConfirmed() {
    return(
        <section>
            <ContainerGrid className="w-full h-screen flex flex-col items-center justify-center gap-6" >
                <HeadingOrange text="ATENDIMENTO CONFIRMADO"/>
                <ParagraphBlue>Seu atendimento foi registrado com sucesso!</ParagraphBlue>
                <p className="text-orange text-3xl font-light" >Senha:</p>
                <p className="text-orange text-3xl font-light" >Sala:</p>
                <p className="text-orange text-3xl font-light" >Médico:</p>
            </ContainerGrid>
        </section>
    )
}