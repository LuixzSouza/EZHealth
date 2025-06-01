'use client';

import React from 'react';

// Componente de menu de contexto (copiar, deletar, etc.)
export default function ContextMenu({ message, onSelect }) {
  const options = [
    { key: 'reply', label: '↩️ Responder' },
    { key: 'copy', label: '📋 Copiar' },
    { key: 'react', label: '👍 Reagir' },
    { key: 'forward', label: '🔄 Encaminhar' },
    { key: 'pin', label: '📌 Fixar' },
    { key: 'favorite', label: '⭐ Favoritar' },
    { key: 'delete', label: '🗑️ Apagar', isDanger: true },
  ];

  return (
    <div
      className="
        absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700
        rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5
        text-black dark:text-white focus:outline-none
      "
      role="menu"
      aria-orientation="vertical"
    >
      <div className="py-1" role="none">
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onSelect(opt.key)}
            className={`
              flex items-center px-4 py-2 text-sm
              ${opt.isDanger ? 'text-red-600 dark:text-red-400' : 'text-black dark:text-white'}
              hover:bg-orange/40 dark:hover:bg-themeDark/50 w-full text-left
            `}
            role="menuitem"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
