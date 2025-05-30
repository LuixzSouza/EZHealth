'use client';

// Next
import Image from "next/image";

// Componentes
import { LinkMenu } from "./LinkMenu";

export function Menu({ isOpen, onClose }) {
    return (
        <div 
            onClick={onClose}
            className={`fixed top-0 z-[51] bg-black/30 w-screen h-[100dvh] flex items-start justify-end transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className={`flex flex-col gap-6 bg-orange w-full max-w-md h-[100dvh] px-4 py-4 md:px-10 md:py-20 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Botão de fechar */}
                <div onClick={onClose} className="group w-full max-w-16 h-16 border-2 border-white bg-white flex items-center justify-center rounded-full hover:bg-orange transition-all duration-200 ease-in-out cursor-pointer active:scale-110">
                    <Image className="group-hover:invert group-hover:filter group-hover:brightness-0 group-hover:scale-110 transition-all duration-150 ease-in-out" src={"/icons/seta-direita-laranja.svg"} width={20} height={20} alt="avatar" />
                </div>

                <LinkMenu link="#swhatis" onClick={onClose} >O que é EZHealth?</LinkMenu>
                <LinkMenu link="#sbeneficio" onClick={onClose} >Benefícios EZHealth</LinkMenu>
                <LinkMenu link="#scomofunciona" onClick={onClose} >Informativo</LinkMenu>
                <LinkMenu link="#scontato" onClick={onClose} >Entre em contato</LinkMenu>
                <LinkMenu link="/triagem">Triagem</LinkMenu>
            </div>
        </div>
    );
}
