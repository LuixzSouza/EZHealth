'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';
import Image from 'next/image'; // Avatar do bot
import { v4 as uuidv4 } from 'uuid';

//
// --- Componentes Auxiliares ---
//

// Componente para exibir cada mensagem
function Message({
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
          <ContextMenu message={msg} onSelect={(option) => onOptionClick(option, msg, idx)} />
        )}
      </div>
    </div>
  );
}

// Componente de menu de contexto (copiar, deletar, etc.)
function ContextMenu({ message, onSelect }) {
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

// Componente para exibir sugestões de frases
function Suggestions({ suggestions, onClick }) {
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

//
// --- Componente Principal Chatbot ---
//

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [openContextIdx, setOpenContextIdx] = useState(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sugestões iniciais (podem ser parametrizadas via props se quiser)
  const initialSuggestions = useRef([
    'Quais os sintomas da gripe?',
    'Como agendar uma consulta?',
    'Onde fica a clínica mais próxima?',
    'Dicas para uma alimentação saudável',
    'Qual o telefone de contato?',
  ]).current;

  // --- Inicialização do SpeechRecognition ---
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;

    if (!SpeechRecognition) {
      recognitionRef.current = null;
      console.warn('Web Speech API não suportada neste navegador.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      const isFinal = event.results[event.results.length - 1].isFinal;

      if (isFinal) {
        setInputMessage(prev =>
          prev.trim().length > 0
            ? prev + ' ' + transcript.trim()
            : transcript.trim()
        );
      }
      // else {
      //   setInputMessage((prev) => {
      //     const cleaned = prev.replace(/\s*\[.*\]$/, '');
      //     return cleaned + ' [' + transcript + ']';
      //   });
      // }
    };

    recognition.onerror = (event) => {
      console.error('SpeechRecognition error:', event.error);
      setIsRecording(false);
      recognition.stop();
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  // Gera sessionId e carrega histórico de mensagens do localStorage
  useEffect(() => {
    const storedSession = localStorage.getItem('ezhealth_session_id');
    const newSession = storedSession ?? uuidv4();
    if (!storedSession) localStorage.setItem('ezhealth_session_id', newSession);
    setSessionId(newSession);

    try {
      const storedMessages = localStorage.getItem('ezhealth_chat_messages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        setMessages([
          {
            text: '👋 Olá! Sou seu assistente de saúde EZHealth. Como posso ajudar hoje?',
            sender: 'bot',
          },
        ]);
      }
    } catch (err) {
      console.error('Erro ao ler localStorage:', err);
      setMessages([
        {
          text: '👋 Olá! Sou seu assistente de saúde EZHealth. Como posso ajudar hoje?',
          sender: 'bot',
        },
      ]);
    }
  }, []);

  // Sempre que `messages` mudar, salva no localStorage e rola para baixo
  useEffect(() => {
    try {
      localStorage.setItem('ezhealth_chat_messages', JSON.stringify(messages));
    } catch (err) {
      console.error('Erro ao salvar no localStorage:', err);
    }
    scrollToBottom();
  }, [messages]);

  // Quando o chat abre, foca o input
  useLayoutEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Scroll automático para última mensagem
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Fecha o contexto quando clica fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        chatContainerRef.current &&
        !chatContainerRef.current.contains(e.target)
      ) {
        setOpenContextIdx(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Função para alternar gravação de voz
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Este navegador não suporta reconhecimento de voz.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setInputMessage((prev) => prev.replace(/\s*\[.*\]$/, ''));
      recognitionRef.current.start();
    }
  };

  // Função para enviar mensagem ao Dialogflow
  const sendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      const trimmed = inputMessage.trim();
      if (!trimmed) return;

      const userMsg = { text: trimmed, sender: 'user' };
      setMessages((prev) => [...prev, userMsg]);
      setInputMessage('');
      setLoading(true);
      setOpenContextIdx(null);

      try {
        const response = await fetch('/api/bot/dialogflow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed, sessionId }),
        });

        const data = await response.json();
        if (response.ok) {
          const botText =
            data.fulfillmentText || 'Desculpe, não entendi. Poderia reformular?';
          setMessages((prev) => [...prev, { text: botText, sender: 'bot' }]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              text: data.error || '❗ Ocorreu um erro na comunicação com o bot.',
              sender: 'bot',
              type: 'error',
            },
          ]);
        }
      } catch (err) {
        console.error('Error sending message:', err);
        setMessages((prev) => [
          ...prev,
          {
            text: '❗ Não foi possível conectar ao assistente no momento.',
            sender: 'bot',
            type: 'error',
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [inputMessage, sessionId]
  );

  // Ações do menu de contexto
  const handleOptionClick = useCallback((option, message, idx) => {
    setOpenContextIdx(null);
    switch (option) {
      case 'copy':
        navigator.clipboard
          .writeText(message.text)
          .then(() => alert('📋 Mensagem copiada!'))
          .catch((err) => console.error('Erro ao copiar:', err));
        break;
      case 'delete':
        setMessages((prev) => prev.filter((_, i) => i !== idx));
        break;
      case 'reply':
        alert(`↩️ Implementar função “responder” para: "${message.text}"`);
        break;
      case 'react':
        alert(`👍 Implementar função “reagir” para: "${message.text}"`);
        break;
      case 'forward':
        alert(`🔄 Implementar função “encaminhar” para: "${message.text}"`);
        break;
      case 'pin':
        alert(`📌 Implementar função “fixar” para: "${message.text}"`);
        break;
      case 'favorite':
        alert(`⭐ Implementar função “favoritar” para: "${message.text}"`);
        break;
      default:
        break;
    }
  }, []);

  // Limpa histórico de chat
  const clearChat = useCallback(() => {
    if (
      window.confirm('🗑️ Tem certeza que deseja limpar todo o histórico do chat?')
    ) {
      localStorage.removeItem('ezhealth_chat_messages');
      localStorage.removeItem('ezhealth_session_id');

      const newSession = uuidv4();
      localStorage.setItem('ezhealth_session_id', newSession);
      setSessionId(newSession);

      setMessages([
        {
          text: '❌ Chat limpo. Olá! Sou seu assistente de saúde EZHealth. Como posso ajudar hoje?',
          sender: 'bot',
        },
      ]);
    }
  }, []);

  // Preenche input ao clicar em sugestão
  const handleSuggestionClick = useCallback((sug) => {
    setInputMessage(sug);
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      {/* Botão flutuante para abrir/fechar o chat */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          fixed bottom-6 right-6 w-16 h-16 
          bg-[#002157] dark:bg-themeDark dark:border dark:border-white text-white text-3xl 
          rounded-full flex items-center justify-center 
          shadow-lg hover:bg-[#001f4d] z-50 overflow-hidden
          transition-all duration-300 ease-in-out
          ${isOpen ? 'rotate-45' : 'rotate-0'}
          focus:outline-none focus:ring-2 focus:ring-[#F47127] focus:ring-offset-2
        `}
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat'}
        title={isOpen ? 'Fechar chat' : 'Abrir chat'}
      >
        {isOpen ? '❌' : '💬'}
      </button>

      {/* Container do Chat */}
      <div
        ref={chatContainerRef}
        className={`
          fixed bottom-24 right-6 
          w-full max-w-96 h-[600px] overflow-hidden
          bg-white dark:bg-themeDark
          shadow-2xl rounded-2xl 
          flex flex-col
          transform origin-bottom-right
          transition-all duration-300 ease-in-out
          ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
          z-40
        `}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-4 py-3 shadow-md bg-DarkBlue dark:bg-themeDark">
          <h2 className="text-white text-lg font-semibold flex items-center gap-2">
            <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
              <Image
                src="/images/avatar-1.png"
                alt="Dr. EzHealth Avatar"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            Dr. EZHealth Chat
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={clearChat}
              className="text-white hover:text-red-300 transition-colors duration-200"
              aria-label="Limpar chat"
              title="Limpar chat"
            >
              🗑️
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#F47127] hover:text-[#FF6B00] transition-colors duration-200"
              aria-label="Fechar chat"
              title="Fechar chat"
            >
              ❌
            </button>
          </div>
        </div>

        {/* Área de mensagens */}
        <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#EBEDEF] dark:bg-white/10 z-20">
          {messages.map((msg, idx) => (
            <Message
              key={idx}
              msg={msg}
              idx={idx}
              isOpenContext={openContextIdx}
              onToggleContext={(i) =>
                setOpenContextIdx((prev) => (prev === i ? null : i))
              }
              onOptionClick={handleOptionClick}
            />
          ))}

          {/* Indica que o bot está “digitando” */}
          {loading && (
            <div className="flex justify-start items-center space-x-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src="/images/avatar-1.png"
                  alt="Dr. EzHealth Avatar"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <div className="
                max-w-[70%] px-3 py-2 rounded-xl 
                bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400
                italic flex items-center space-x-1
              ">
                <span className="animate-pulse">⏳</span>
                <span>Digitando...</span>
              </div>
            </div>
          )}

          {/* âncora para scroll */}
          <div ref={messagesEndRef} />
        </div>

        {/* Sugestões de frases (quando o input está vazio e não está carregando) */}
        {!inputMessage && !loading && messages.length > 0 && (
          <div className="relative z-10 flex flex-col items-center bg-DarkBlue dark:bg-themeDark p-2">
            {/* Botão de abrir/fechar */}
            <button
              onClick={() => setSuggestionsOpen((prev) => !prev)}
              className={`
                mb-1 p-2 rounded-full 
                dark:bg-transparent
                border border-white
                shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 
                transition-transform duration-200 
                ${suggestionsOpen ? 'rotate-0' : 'rotate-180'}
              `}
              aria-label={suggestionsOpen ? 'Fechar sugestões' : 'Abrir sugestões'}
              title={suggestionsOpen ? 'Fechar sugestões' : 'Abrir sugestões'}
            >
              {/* Ícone de setinha */}
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Container com transição para abrir/fechar */}
            <div
              className={`
                w-full overflow-hidden
                transition-[max-height,opacity] duration-300 ease-in-out
                ${suggestionsOpen
                  ? 'max-h-[200px] opacity-100'
                  : 'max-h-0 opacity-0'}
              `}
            >
              <Suggestions
                suggestions={initialSuggestions}
                onClick={handleSuggestionClick}
              />
            </div>
          </div>
        )}

        {/* Input de mensagem + botões extras */}
        <form
          onSubmit={sendMessage}
          className="flex p-3 border-t border-gray-300 dark:border-gray-700 bg-[#EBEDEF] dark:bg-white/10 z-20"
        >
          <div className="flex items-center space-x-2">
            {/* Botão de microfone */}
            <button
              type="button"
              onClick={toggleRecording}
              className={`
                p-2 rounded-full 
                ${isRecording
                  ? 'bg-red-500 dark:bg-red-700'
                  : 'bg-gray-200 dark:bg-gray-600'} 
                text-gray-800 dark:text-gray-200 
                hover:bg-gray-300 dark:hover:bg-gray-500
                transition-colors focus:outline-none
              `}
              aria-label={isRecording ? 'Parar gravação' : 'Iniciar gravação'}
              title={isRecording ? 'Parar gravação' : 'Iniciar gravação'}
            >
              {isRecording ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 1v4m0 0a4 4 0 014 4v4m0 0a4 4 0 01-4 4m0 0a4 4 0 01-4-4V9m0 0a4 4 0 014-4m0 0V1m0 16v4m-4-2h8"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 1v4m0 0a4 4 0 014 4v4m0 0a4 4 0 01-4 4m0-12a4 4 0 00-4 4v4a4 4 0 004 4m0-12V1m0 16v4m4-2h-8"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Substituímos <input> por <textarea> com auto-resize até 3 linhas */}
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            rows={1}
            placeholder="Digite sua mensagem..."
            className="
              flex-1 mx-2 px-3 py-2 
              border border-gray-400 dark:border-gray-600
              rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47127] dark:focus:ring-[#F47127]
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400 shadow-inner
              resize-none overflow-y-auto max-h-[4.5rem]
            "
            disabled={loading}
            spellCheck={true}
          />

          <button
            type="submit"
            className="
              bg-[#F47127] text-white px-4 py-2 rounded-lg
              hover:bg-[#FF6B00] disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            "
            disabled={loading}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
