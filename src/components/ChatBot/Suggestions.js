'use client';

import React from 'react';

// Componente para exibir sugestões de frases
export default function Suggestions({ suggestions, onClick }) {
  return (
    <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-[#EBEDEF] dark:bg-white/10 flex flex-wrap gap-2">
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
  );
}
