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
    ? 'bg-red-200 text-red-800 rounded-bl-none border border-red-500'
    : 'bg-DarkBlue text-white dark:bg-themeDark dark:bg-gray-700 dark:text-white rounded-bl-none';

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
            absolute -bottom-2 -right-2 p-1 bg-white rounded-full
            text-gray-400 hover:text-gray-600 transition-all duration-200
            opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100
            shadow-md z-10 flex items-center justify-center
          "
          aria-label="Opções da mensagem"
          title="Opções da mensagem"
        >
          ⋮
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
