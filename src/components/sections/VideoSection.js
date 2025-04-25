import Image from "next/image";
import { ContainerGrid } from "../ContainerGrid";

export function VideoSection() {
    return(
        <section className="py-14" >
            <ContainerGrid>
                <div className="flex flex-col items-center justify-center gap-10 bg-orange rounded-3xl h-580" >
                    <h3 className="text-white text-6xl font-semibold max-w-screen-md text-center" >Anexo vídeo do software funcionando</h3>
                    <div className="w-full max-w-32 h-32 flex items-center justify-center border-4 border-white rounded-full" >
                        <Image className="relative invert -right-2" src={"/icons/play-black.svg"} alt="Play" width={55} height={65}/>
                    </div>
                </div>
            </ContainerGrid>
        </section>
    )
}