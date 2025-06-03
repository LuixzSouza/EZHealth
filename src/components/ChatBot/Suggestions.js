'use client';

import React from 'react';

// Componente para exibir sugestões de frases
export default function Suggestions({ suggestions, onClick, onGenerateNew }) {
  return (
    <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-[#EBEDEF] dark:bg-white/10 flex flex-col items-center gap-2">
      <div className="flex flex-wrap justify-center gap-2 mb-2 w-full" >
        {suggestions.map((sug, idx) => (
          <button
            key={idx}
            onClick={() => onClick(sug)}
            className="
              px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm
              hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800
              transition-colors
            "
          >
            {sug}
          </button>
        ))}
      </div>
      <button
        onClick={onGenerateNew}
        className="
          p-2 rounded-full 
          dark:bg-transparent
          bg-blue-100 border border-blue-800 dark:border-white
          text-blue-800 dark:text-white
          shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 dark:hover:text-white
          transition-colors duration-200
        "
        aria-label="Gerar novas sugestões"
        title="Gerar novas sugestões"
      >
        {/* Ícone de rotação/atualização */}
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 0020 13a8 8 0 00-15.356-2m15.356 2H20v-5m-5.414 4h.01M12 16v.01"
          />
        </svg>
      </button>
    </div>
    
  );
}
