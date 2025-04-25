import Image from "next/image";
import { ContainerGrid } from "./ContainerGrid";

export function Header() {
    return(
        <header className="w-full fixed top-0 bg-white z-50 shadow-2xl shadow-black/10" >
            <ContainerGrid className="flex items-center justify-between" >
                <div className="w-full flex items-center justify-center" >
                    <Image src={"/logo.png"} width={180} height={60} alt="Icon"/>
                </div>
                <ul className="flex items-center justify-end gap-4" >
                    <li>
                        <Image src={"/icons/pesquisa-de-lupa.svg"} width={60} height={60} alt="Icon"/>
                    </li>
                    <li>
                        <div className="w-1 h-12 rounded-full bg-DarkBlue" ></div>
                    </li>
                    <li>
                        <Image src={"/icons/flecha-left-full-circle.svg"} width={60} height={60} alt="Icon"/>
                    </li>
                </ul>
            </ContainerGrid>
        </header>
    )
}