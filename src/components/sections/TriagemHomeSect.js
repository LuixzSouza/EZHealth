import Image from "next/image";
import { ContainerGrid } from "../ContainerGrid";
import { HeadingOrange } from "../HeadingOrange";

export function TriagemHomeSect() {
    return(
        <section className="overflow-hidden h-screen" >
            <ContainerGrid className="flex flex-col items-center justify-center" > 
                <Image src={"/logo.png"} width={180} height={60} alt="Icon"/>
                <div className="flex flex-col-reverse items-center justify-center gap-6 lg:flex-row lg:gap-0" >
                    <Image className="max-w-82 md:max-w-auto" src={"/images/avatar-3.png"} width={400} height={200} alt="avatar"/>
                    <h1 className="text-orange font-bold text-4xl md:text-6xl max-w-4xl" >
                        BEM - VINDO A SUA TRIAGEM INTELIGENTE
                    </h1>
                </div>
            </ContainerGrid>
        </section>
    )
}