'use client';

import React from 'react';
import Image from 'next/image';

// Componente para exibir cada mensagem
export default function Message({
  msg,
  idx,
  isOpenContext,
  onToggleContext,
  onOptionClick,
}) {
  const isUser = msg.sender === 'user';
  const isError = msg.type === 'error';
  const containerClasses = `flex ${isUser ? 'justify-end' : 'justify-start'}`;
  const bubbleBase = `max-w-[75%] px-3 py-2 rounded-xl relative group`;
  const bubbleColor = isUser
    ? 'bg-orange/90 text-white rounded-br-none'
    : isError
    ? 'bg-red-200 text-red-800 rounded-tl-none border border-red-500'
    : 'bg-DarkBlue text-white dark:bg-themeDark dark:bg-gray-700 dark:text-white rounded-tl-none';

  return (
    <div className={containerClasses}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 mr-2 rounded-full overflow-hidden">
          <Image
            src="/images/avatar-1.png"
            alt="Dr. EzHealth Avatar"
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
      )}

      <div
        className={`${bubbleBase} ${bubbleColor}`}
        onClick={() => onToggleContext(idx)}
      >
        {msg.text}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleContext(idx);
          }}
          className="
            absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-md
            text-black hover:text-orange hover:bg-slate-200
            opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-orange
            z-10
          "
          aria-label="Abrir opções da mensagem"
          title="Abrir opções da mensagem"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v.01M12 12v.01M12 18v.01" />
          </svg>
        </button>

        {isOpenContext === idx && (
          <ContextMenu message={msg} onSelect={(opt) => onOptionClick(opt, msg, idx)} />
        )}
      </div>
    </div>
  );
}

// Importação circular: ContextMenu será importado abaixo no Chatbot.jsx
import ContextMenu from './ContextMenu';
