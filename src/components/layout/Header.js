'use client'

// Next - React
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from 'next/navigation';

// Componentes
import { Menu } from "./Menu";
import { MenuSearch } from "./MenuSearch";
import { DarkTheme } from "../theme/DarkTheme";
import { ContainerGrid } from "./ContainerGrid";
import { AtalhosTeclado } from "../utils/AtalhosTeclado";
import { ToolAssistentText } from "../utils/ToolAssistentText";

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenSearch, setIsOpenSerach] = useState(false);
    const pathname = usePathname();

    return(
        <>
            <header className="w-full dark:bg-themeDark bg-white shadow-2xl shadow-black/10 dark:shadow-white/5 sticky top-0 z-30" >
                <ContainerGrid className="flex items-center justify-between" >
                    <div className="flex items-start justify-start" >
                        <Link href={"/#"} className="relative group" >
                            <Image src={"/logo.png"} width={180} height={60} alt="Icon" className="block dark:hidden"/>
                            <Image src={"/logo-white.png"} width={180} height={60} alt="Icon" className="hidden dark:block"/>
                            <ToolAssistentText>
                                Inicio <span className="text-gray-400">(Esc)</span>
                            </ToolAssistentText>
                        </Link>
                    </div>
                    <ul className="flex items-center justify-end gap-4" >
                        <DarkTheme/>
                        {pathname !== '/login-medico' && pathname !== '/painel-medico' && (
                            <li className="relative group cursor-pointer hover:scale-105 active:scale-110">
                                <Link href={"/login-medico"}>
                                    <Image src="/icons/assistencia-medica.svg" width={60} height={60} alt="Atendimento Médico" className="filter dark:invert dark:brightness-0" />
                                    <ToolAssistentText>
                                        Login Médico <span className="text-gray-400">(L)</span>
                                    </ToolAssistentText>
                                </Link>
                            </li>
                        )}

                        <li className="relative group cursor-pointer hover:scale-105 active:scale-110" onClick={() => setIsOpenSerach(true)}>
                            <Image src="/icons/pesquisa-de-lupa.svg" width={60} height={60} alt="Pesquisar" className="filter dark:invert dark:brightness-0" />

                            <ToolAssistentText>
                                Pesquisar <span className="text-gray-400">(P)</span>
                            </ToolAssistentText>
                        </li>

                        <li>
                            <div className="w-1 h-12 rounded-full bg-DarkBlue filter dark:invert dark:brightness-0"></div>
                        </li>

                        <li className="relative group cursor-pointer hover:scale-105 active:scale-110" onClick={() => setIsOpen(true)}>
                            <Image src="/icons/flecha-left-full-circle.svg" width={60} height={60} alt="Menu Lateral" className="filter dark:invert dark:brightness-0" />
                            <ToolAssistentText>
                                Abrir Menu <span className="text-gray-400">(M)</span>
                            </ToolAssistentText>
                        </li>

                    </ul>
                </ContainerGrid>
            </header>
            <Menu isOpen={isOpen} onClose={() => setIsOpen(false)} />
            <MenuSearch isOpen={isOpenSearch} onClose={() => setIsOpenSerach(false)} />
            <AtalhosTeclado
                setIsOpenSearch={setIsOpenSerach} 
                setIsOpenMenu={setIsOpen} 
            />
        </>
    )
}