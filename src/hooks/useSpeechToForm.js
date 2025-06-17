// Dentro de /hooks/useSpeechToForm.js

import { useState, useEffect, useRef } from 'react';

/**
 * Hook reutilizável para transcrever voz diretamente para um campo do React Hook Form.
 * @param {object} options - Opções do hook.
 * @param {function} options.setValue - A função `setValue` do `useForm`.
 * @returns Um objeto com o campo ativo, se está ouvindo, a função para iniciar e o suporte do navegador.
 */
export const useSpeechToForm = ({ setValue }) => {
  if (!setValue) {
    throw new Error("O hook useSpeechToForm precisa receber a função 'setValue' do react-hook-form.");
  }

  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState(null);
  
  const recognitionRef = useRef(null);
  const activeFieldRef = useRef(null); 

  const hasRecognitionSupport =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!hasRecognitionSupport) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      
      const currentActiveField = activeFieldRef.current;
      if (currentActiveField) {
        setValue(currentActiveField, speechToText, { shouldValidate: true });
      }
      
      setIsListening(false);
      setActiveField(null);
      activeFieldRef.current = null;
    };
    
    recognition.onerror = (event) => {
      console.error("Erro no reconhecimento de voz:", event.error);
      setIsListening(false);
      setActiveField(null);
      activeFieldRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      setActiveField(null);
      activeFieldRef.current = null;
    }
    
    return () => {
      if(recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
    }
  }, [hasRecognitionSupport, setValue]);

  const startListening = (fieldName) => {
    if (recognitionRef.current && !isListening) {
      setActiveField(fieldName);
      activeFieldRef.current = fieldName;

      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  return {
    isListening,
    activeField,
    startListening,
    hasRecognitionSupport,
  };
};