'use client'

import Image from "next/image";
import { ContainerGrid } from "./ContainerGrid";
import { useState } from "react";
import { Menu } from "./Menu";
import { MenuSearch } from "./MenuSearch";
import Link from "next/link";

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenSearch, setIsOpenSerach] = useState(false);

    return(
        <>
            <header className="w-full fixed top-0 bg-white z-50 shadow-2xl shadow-black/10" >
                <ContainerGrid className="flex items-center justify-between" >
                    <div className="w-full flex items-center justify-center" >
                        <Link href={"/#"}>
                            <Image src={"/logo.png"} width={180} height={60} alt="Icon"/>
                        </Link>
                    </div>
                    <ul className="flex items-center justify-end gap-4" >
                        <li  className="cursor-pointer hover:scale-105 active:scale-110" onClick={() => setIsOpenSerach(true)} >
                            <Image src={"/icons/pesquisa-de-lupa.svg"} width={60} height={60} alt="Icon"/>
                        </li>
                        <li>
                            <div className="w-1 h-12 rounded-full bg-DarkBlue" ></div>
                        </li>
                        <li className="cursor-pointer hover:scale-105 active:scale-110" onClick={() => setIsOpen(true)} >
                            <Image src={"/icons/flecha-left-full-circle.svg"} width={60} height={60} alt="Icon"/>
                        </li>
                    </ul>
                </ContainerGrid>
            </header>
            <Menu isOpen={isOpen} onClose={() => setIsOpen(false)} />
            <MenuSearch isOpen={isOpenSearch} onClose={() => setIsOpenSerach(false)} />
        </>
    )
}