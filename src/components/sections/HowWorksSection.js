import { ContainerGrid } from "../ContainerGrid";
import { HeadingOrange } from "../HeadingOrange";
import { ListFunctions } from "../ListFunctions";

export function HowWorksSection() {
    return(
        <section className="py-14" id="scomofunciona" >
            <ContainerGrid>
                <HeadingOrange text="Como funciona o EZHealth?" />
                <div className="flex flex-col gap-8 mt-10" >
                    <ListFunctions img={"pesquisa-de-lupa.svg"} title={"Check - in digital"} text={"O paciente realiza o check-in diretamente pelo sistema, informando: Nome, CPF e Numeração do Convênio."} />
                    <ListFunctions img={"relatorio-de-saude.svg"} title={"Preenchimento do formulário"} text={"O paciente responde a um questionário inteligente sobre seus sintomas e histórico médico. O sistema utiliza algoritmos para analisar as informações e sugerir o melhor encaminhamento."} />
                    <ListFunctions img={"pesquisa-de-lupa.svg"} title={"Direcionamento automático para o especialista"} text={"Com base nas respostas, o EzHealth identifica a especialidade médica mais adequada e encaminha o paciente para o profissional correto, otimizando o fluxo de atendimento."} />
                    <ListFunctions img={"verifica.svg"} title={"Geração de senha e informação da sala"} text={"Após a triagem, o paciente recebe uma senha digital contendo: Número da senha para atendimento, Nome do especialista e Número da sala onde será atendido."} />
                </div>
            </ContainerGrid>
        </section>
    )
}