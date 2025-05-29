import Image from "next/image";
import Link from "next/link";
import { ToolAssistentText } from "./ToolAssistentText";

export function ScrollDown({link="#"}) {
    return(
        <Link href={link} className="group absolute bottom-10 left-1/2 w-full max-w-20 h-10 border-2 dark:border-orangeDark border-orange flex items-center justify-center rounded-full hover:bg-orange dark:hover:bg-orangeDark transition-all duration-200 ease-in-out cursor-pointer active:scale-110" >
            <Image className="rotate-90 group-hover:invert group-hover:filter group-hover:brightness-0 transition-all duration-150 ease-in-out" src={"/icons/seta-direita-laranja.svg"} width={20} height={20} alt="avatar"/>
            <ToolAssistentText>
                Proxima Seção
            </ToolAssistentText>
        </Link>
    )
} 