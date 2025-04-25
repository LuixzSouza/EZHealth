import Image from "next/image";
import { ContainerGrid } from "../ContainerGrid";
import { HeadingOrange } from "../HeadingOrange";
import { ParagraphBlue } from "../ParagraphBlue";
import { InputsForm } from "../InputsForm";

export function ContactUsSection() {
    return(
        <section className="flex items-end justify-between pt-14" >
            <ContainerGrid className="flex flex-col items-start justify-end h-screen" >
                <HeadingOrange text="FALE CONOSCO!" />
                <ParagraphBlue>Tem dúvidas? Entre em contato e descubra como o EZHealth pode transformar seu atendimento!</ParagraphBlue>
                <div className="flex items-center justify-center gap-5" >
                    <Image src={"/icons/whatsapp.svg"} alt="Icon Zap" width={45} height={45}/>
                    <span className="text-DarkBlue text-3xl font-semibold" >(35) 92569-1149</span>
                </div>
            </ContainerGrid>
            <div className="w-full max-w-screen-sm h-full flex flex-col items-start justify-start gap-10 bg-orange p-10 rounded-md" >
                <InputsForm label={"Nome:"} input={"text"} />
                <InputsForm label={"E-mail:"} input={"email"} />
                <InputsForm label={"Telefone:"} input={"tel"} />
                <div className="w-full h-80 border-2 border-white rounded-xl p-2" >
                    <span className="text-white" >Mensagem</span>
                </div>
                <button className="text-white text-3xl border-2 border-white rounded-full p-4" >Enviar</button>
            </div>
        </section>
    )
}