// Chatbot.jsx

'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

import Message from './Message';
import ContextMenu from './ContextMenu';
import Suggestions from './Suggestions';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [openContextIdx, setOpenContextIdx] = useState(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Sugestões iniciais
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

  // Sempre que `messages` mudar, salva e rola para o fim
  useEffect(() => {
    try {
      localStorage.setItem('ezhealth_chat_messages', JSON.stringify(messages));
    } catch (err) {
      console.error('Erro ao salvar no localStorage:', err);
    }
    scrollToBottom();
  }, [messages]);

  // Foca input quando chat abre
  useLayoutEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Scroll automático
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Fecha contexto ao clicar fora
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

  // Alterna gravação de voz
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
      setInputMessage(prev => prev.replace(/\s*\[.*\]$/, ''));
      recognitionRef.current.start();
    }
  };

  // Envia mensagem ao Dialogflow
  const sendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      const trimmed = inputMessage.trim();
      if (!trimmed) return;

      // Cria objeto de mensagem do usuário
      const userMsg = {
        text: trimmed,
        sender: 'user',
        replyTo: replyTo ? { ...replyTo } : null,
        pinned: false,
        favorite: false,
        liked: false,
      };

      setMessages(prev => [...prev, userMsg]);
      setInputMessage('');
      setLoading(true);
      setOpenContextIdx(null);
      setReplyTo(null);

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
          setMessages(prev => [...prev, { text: botText, sender: 'bot' }]);
        } else {
          setMessages(prev => [
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
        setMessages(prev => [
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
    [inputMessage, sessionId, replyTo]
  );

  // Ações do menu de contexto
  const handleOptionClick = useCallback((option, message, idx) => {
    setOpenContextIdx(null);
    switch (option) {
      case 'copy':
        navigator.clipboard
          .writeText(message.text)
          .then(() => alert('📋 Mensagem copiada!'))
          .catch(err => console.error('Erro ao copiar:', err));
        break;
      case 'delete':
        setMessages(prev => prev.filter((_, i) => i !== idx));
        break;
      case 'reply':
        setReplyTo({ text: message.text, sender: message.sender, idx });
        setTimeout(() => inputRef.current?.focus(), 0);
        break;
      case 'react':
        setMessages(prev =>
          prev.map((m, i) =>
            i === idx ? { ...m, liked: !m.liked } : m
          )
        );
        break;
      case 'forward':
        setInputMessage(`Fwd: ${message.text}`);
        setTimeout(() => inputRef.current?.focus(), 0);
        break;
      case 'pin':
        setMessages(prev =>
          prev.map((m, i) =>
            i === idx ? { ...m, pinned: !m.pinned } : m
          )
        );
        break;
      case 'favorite':
        setMessages(prev =>
          prev.map((m, i) =>
            i === idx ? { ...m, favorite: !m.favorite } : m
          )
        );
        break;
      default:
        break;
    }
  }, []);

  // Limpa histórico do chat
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
        onClick={() => setIsOpen(prev => !prev)}
        className={`
          fixed bottom-6 right-6 w-16 h-16
          bg-[#002157] dark:bg-themeDark dark:border dark:border-white text-white text-3xl 
          rounded-full flex items-center justify-center 
          shadow-lg hover:bg-[#001f4d] z-[55] overflow-hidden
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
          fixed bottom-6 right-6 lg:bottom-24
          w-full max-w-[90vw] md:max-w-96 h-[65vh] overflow-hidden
          bg-white dark:bg-themeDark
          shadow-2xl rounded-2xl shadow-black/50 dark:shadow-white/30
          flex flex-col
          transform origin-bottom-right
          transition-all duration-300 ease-in-out
          ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
          z-[56]
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
              onToggleContext={i =>
                setOpenContextIdx(prev => (prev === i ? null : i))
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

        {/* Se estiver respondendo, mostrar mensagem que está sendo respondida */}
        {replyTo && (
          <div className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex justify-between items-center">
            <div className="flex-1 truncate">
              Respondendo a: {replyTo.text}
            </div>
            <button onClick={() => setReplyTo(null)} className="ml-2 text-red-500 hover:text-red-700">
              ✖️
            </button>
          </div>
        )}

        {/* Sugestões de frases (quando o input está vazio e não está carregando) */}
        {!inputMessage && !loading && messages.length > 0 && (
          <div className="relative z-10 flex flex-col items-center bg-DarkBlue dark:bg-themeDark p-2">
            {/* Botão de abrir/fechar */}
            <button
              onClick={() => setSuggestionsOpen(prev => !prev)}
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
          className="flex flex-col"
        >
          <div className="flex p-3 border-t border-gray-300 dark:border-gray-700 bg-[#EBEDEF] dark:bg-white/10 z-20">
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
              onChange={e => setInputMessage(e.target.value)}
              onInput={e => {
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              rows={1}
              placeholder="Digite sua mensagem..."
              className="
                flex-1 mx-2 px-3 py-2 
                border border-gray-400 dark:border-gray-600
                rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F47127] dark:focus:ring-[#F47127]
                bg-white dark:bg-white/80 dark:bg-gray-700 text-black
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
          </div>
        </form>
      </div>
    </div>
  );
}