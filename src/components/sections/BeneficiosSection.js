import { Beneficio } from "../Beneficio";
import { ContainerGrid } from "../ContainerGrid";
import { HeadingDarkBlue } from "../HeadingDarkBlue";

export function BeneficiosSection() {
    return(
        <section className="py-14" >
            <ContainerGrid>
                <HeadingDarkBlue text="Benefícios EZHealth" />
                <div className="flex flex-col items-center justify-start mt-10 gap-8" >
                    <Beneficio>Redução do tempo de espera com check-in digital e triagem automatizada.</Beneficio>
                    <Beneficio>Encaminhamento inteligente para o especialista correto, evitando consultas desnecessárias.</Beneficio>
                    <Beneficio>Interface adaptada ao layout e identidade visual de cada cliente.</Beneficio>
                    <Beneficio>Compatível com prontuários eletrônicos e sistemas hospitalares.</Beneficio>
                    <Beneficio>Organização do fluxo de pacientes, otimizando recursos e reduzindo custos operacionais.</Beneficio>
                </div>
            </ContainerGrid>
        </section>
    )
}