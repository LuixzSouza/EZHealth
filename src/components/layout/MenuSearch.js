'use client';

import { useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

export function MenuSearch({ isOpen, onClose }) {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const pathname = usePathname();

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
    "login medico": "/login-medico",
  };

  const handleSearch = () => {
    const query = search.toLowerCase().trim();
    const match = Object.keys(sectionMap).find((key) => query.includes(key));

    if (match) {
      const target = sectionMap[match];
      setError("");

      if (target.startsWith("#")) {
        if (pathname !== "/") {
          router.push(`/${target}`);
        } else {
          onClose();
          const element = document.querySelector(target);
          if (element) {
            setTimeout(() => {
              element.scrollIntoView({ behavior: "smooth" });
            }, 300);
          }
        }
      } else {
        onClose();
        router.push(target);
      }
    } else {
      setError(`Não encontramos "${search}". Tente termos como "Triagem", "Informativo" ou "Contato".`);
    }
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setError("");
  };

  const handleClear = () => {
    setSearch("");
    setError("");
  };

  return (
    <div
      onClick={onClose}
      className={`fixed top-0 z-[51] bg-black/30 w-screen h-screen flex items-start justify-end transition-all duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex flex-col bg-orange w-full max-w-md h-screen px-10 py-20 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          onClick={onClose}
          className="group w-full max-w-16 h-16 border-2 border-white bg-white flex items-center justify-center rounded-full hover:bg-orange transition-all duration-200 ease-in-out cursor-pointer active:scale-110"
        >
          <Image
            className="group-hover:invert group-hover:filter group-hover:brightness-0 group-hover:scale-110 transition-all duration-150 ease-in-out"
            src={"/icons/seta-direita-laranja.svg"}
            width={20}
            height={20}
            alt="Fechar"
          />
        </div>

        <div className="mt-10 flex flex-col gap-3">
          <h4 className="text-white text-sm flex items-center gap-2">
            💡 Dica: você pode buscar por &quot;Triagem&quot;, &quot;Benefícios&quot;, ou &quot;Contato&quot;.
          </h4>

          <div className="relative flex items-center w-full p-5 border-2 border-white rounded-full overflow-hidden bg-white">
            <input
              className="bg-transparent w-full h-full text-black placeholder:text-gray-500 focus:outline-none"
              placeholder="Ex: Triagem, Contato, Informativo..."
              value={search}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {search && (
              <button
                onClick={handleClear}
                className="absolute right-14 text-gray-500 text-black hover:text-red-500 transition text-4xl"
              >
                &times;
              </button>
            )}
            <Image
              onClick={handleSearch}
              className="cursor-pointer"
              src={"/icons/pesquisa-de-lupa.svg"}
              width={30}
              height={30}
              alt="Buscar"
            />
          </div>

          {error && (
            <p className="text-white text-sm bg-red-500 px-4 py-2 rounded-md animate-pulse">
              {error}
            </p>
          )}

          <div className="mt-4">
            <p className="text-white text-sm mb-2">Sugestões:</p>
            <ul className="flex flex-wrap gap-2">
              {Object.keys(sectionMap).map((key, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSearch(key);
                  }}
                  className="cursor-pointer bg-white text-orange px-3 py-1 rounded-full text-sm hover:bg-orange border hover:border-white hover:text-white transition"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
