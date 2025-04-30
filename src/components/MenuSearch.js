'use client';

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function MenuSearch({ isOpen, onClose }) {
  const [search, setSearch] = useState("");
  const [error, setError] = useState('');

  const sectionMap = {
    "o que é ezhealth": "#swhatis",
    "ezhealth": "#swhatis",
    "benefícios": "#sbeneficio",
    "beneficio": "#sbeneficio",
    "informativo": "#scomofunciona",
    "como funciona": "#scomofunciona",
    "contato": "#scontato",
    "fale conosco": "#scontato",
    "triagem": "/triagem",
  };

  const handleSearch = () => {
    const query = search.toLowerCase().trim();
    const match = Object.keys(sectionMap).find((key) =>
      query.includes(key)
    );

    if (match) {
      const target = sectionMap[match];
      onClose();

      if (target.startsWith("#")) {
        // Scroll suave para seção
        const element = document.querySelector(target);
        if (element) {
            setError('');
            setTimeout(() => {
                element.scrollIntoView({ behavior: "smooth" });
            }, 300); // espera o menu fechar
        }} else {
            // Navega para rota externa
            router.push(target);
        }} else {
            setError('Nenhum resultado encontrado');
        }
    };

    return (
        <div
            onClick={onClose}
            className={`fixed top-0 z-[51] bg-black/30 w-screen h-screen flex items-start justify-end transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`flex flex-col bg-orange w-full max-w-md h-screen px-10 py-20 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div onClick={onClose} className="group w-full max-w-16 h-16 border-2 border-white bg-white flex items-center justify-center rounded-full hover:bg-orange transition-all duration-200 ease-in-out cursor-pointer active:scale-110">
                    <Image className="group-hover:invert group-hover:filter group-hover:brightness-0 group-hover:scale-110 transition-all duration-150 ease-in-out" src={"/icons/seta-direita-laranja.svg"} width={20} height={20} alt="avatar" />
                </div>

                <div className="mt-10 flex flex-col gap-2">
                    <div className="flex items-center justify-between w-full p-5 border-2 border-white rounded-full overflow-hidden bg-white">
                        <input 
                            className="bg-transparent w-full h-full text-black" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Image 
                            onClick={handleSearch}
                            className="cursor-pointer" 
                            src={"/icons/pesquisa-de-lupa.svg"} 
                            width={30} 
                            height={30} 
                            alt="Icon" 
                        />
                    </div>

                    {error && (
                        <p className="text-white text-sm bg-red-500 px-4 py-2 rounded-md animate-pulse">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
