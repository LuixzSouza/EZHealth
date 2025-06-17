'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

export default function VLibras() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectingText, setSelectingText] = useState(false);
  const [charArray, setCharArray] = useState([]);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const [speed, setSpeed] = useState(1);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [showInfoScreen, setShowInfoScreen] = useState(false);
  const [showConfigScreen, setShowConfigScreen] = useState(false);
  const [showSearchScreen, setShowSearchScreen] = useState(false);
  const [linkToAccess, setLinkToAccess] = useState(null);
  const [linkCoords, setLinkCoords] = useState({ x: 0, y: 0 });

  const intervalRef = useRef(null);
  const speakingUtteranceRef = useRef(null);

  const [wordArray, setWordArray] = useState([]);
  const [audioWordIndex, setAudioWordIndex] = useState(0);

  const BASE_DELAY = 1000;
  const [showAudio, setShowAudio] = useState(false);

  // States para as novas funcionalidades de acessibilidade
  const [showAccessibilityScreen, setShowAccessibilityScreen] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [contrast, setContrast] = useState('none'); // 'none', 'dark', 'light'
  const [stopAnimations, setStopAnimations] = useState(false);
  const [readableFont, setReadableFont] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);
  const [fontSize, setFontSize] = useState('medium'); // 'small', 'medium', 'large'

  // Efeito para carregar configurações do localStorage ao iniciar
  useEffect(() => {
    // Carrega apenas no cliente
    if (typeof window !== 'undefined') {
      const savedGrayscale = localStorage.getItem('accessibility-grayscale') === 'true';
      const savedContrast = localStorage.getItem('accessibility-contrast') || 'none';
      const savedStopAnimations = localStorage.getItem('accessibility-stop-animations') === 'true';
      const savedReadableFont = localStorage.getItem('accessibility-readable-font') === 'true';
      const savedUnderlineLinks = localStorage.getItem('accessibility-underline-links') === 'true';
      const savedFontSize = localStorage.getItem('accessibility-font-size') || 'medium';

      setGrayscale(savedGrayscale);
      setContrast(savedContrast);
      setStopAnimations(savedStopAnimations);
      setReadableFont(savedReadableFont);
      setUnderlineLinks(savedUnderlineLinks);
      setFontSize(savedFontSize);
    }
  }, []);

  // Função para aplicar as classes de acessibilidade no HTML
  const applyClassToHtml = (className, enable) => {
    const html = document.documentElement;
    if (enable) {
      html.classList.add(className);
    } else {
      html.classList.remove(className);
    }
  };

  // Efeitos para aplicar/remover classes e salvar no localStorage quando o estado muda
  useEffect(() => {
    applyClassToHtml('grayscale-enabled', grayscale);
    localStorage.setItem('accessibility-grayscale', String(grayscale));
  }, [grayscale]);

  useEffect(() => {
    document.documentElement.classList.remove('contrast-dark', 'contrast-light');
    if (contrast !== 'none') {
      document.documentElement.classList.add(`contrast-${contrast}`);
    }
    localStorage.setItem('accessibility-contrast', contrast);
  }, [contrast]);

  useEffect(() => {
    applyClassToHtml('animations-disabled', stopAnimations);
    localStorage.setItem('accessibility-stop-animations', String(stopAnimations));
  }, [stopAnimations]);

  useEffect(() => {
    applyClassToHtml('readable-font-enabled', readableFont);
    localStorage.setItem('accessibility-readable-font', String(readableFont));
  }, [readableFont]);

  useEffect(() => {
    applyClassToHtml('underline-links-enabled', underlineLinks);
    localStorage.setItem('accessibility-underline-links', String(underlineLinks));
  }, [underlineLinks]);

  useEffect(() => {
    document.documentElement.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    document.documentElement.classList.add(`font-size-${fontSize}`);
    localStorage.setItem('accessibility-font-size', fontSize);
  }, [fontSize]);

  // Função para resetar todas as configurações de acessibilidade
  const handleResetAccessibility = () => {
    setGrayscale(false);
    setContrast('none');
    setStopAnimations(false);
    setReadableFont(false);
    setUnderlineLinks(false);
    setFontSize('medium');
  };

  const normalizeChar = (ch) => {
    const normalized = ch
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    return normalized >= 'a' && normalized <= 'z' ? normalized : null;
  };

  const cancelSpeech = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      speakingUtteranceRef.current = null;
    }
  }, []);

  const speakText = useCallback((text) => {
    if (!showAudio || !text || text.trim() === '') {
      return;
    }

    if (!('speechSynthesis' in window)) {
      console.warn("API de Síntese de Fala não suportada neste navegador.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = speed;

    utterance.onstart = () => {
      speakingUtteranceRef.current = utterance;
    };
    utterance.onend = () => {
      if (speakingUtteranceRef.current === utterance) {
        speakingUtteranceRef.current = null;
      }
    };
    utterance.onerror = (event) => {
      if (event.error !== 'interrupted') {
        console.error('Erro na fala:', event.error, 'Tipo de erro:', event.error, 'Texto:', text);
      }
      if (speakingUtteranceRef.current === utterance) {
        speakingUtteranceRef.current = null;
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [showAudio, speed]);

  const handleClickIcon = () => {
    setShowTooltip(false);
    setLoading(true);
    setShowPlayer(true);
    setShowInfoScreen(false);
    setShowConfigScreen(false);
    setShowAccessibilityScreen(false);
    setShowSearchScreen(false);
    setLinkToAccess(null);
    cancelSpeech();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setSelectingText(false);
    setCharArray([]);
    setPlaybackIndex(0);
    setCurrentImage(null);
    setDisplayedText('');
    setWordArray([]);
    setAudioWordIndex(0);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setSpeed(1);
    setShowInfoScreen(false);
    setShowConfigScreen(false);
    setShowAccessibilityScreen(false);
    setShowSearchScreen(false);
    setShowSubtitle(true);
    setLinkToAccess(null);
    cancelSpeech();
  };

  const handleStartSelecting = () => {
    setSelectingText(true);
    setCharArray([]);
    setPlaybackIndex(0);
    setCurrentImage(null);
    setDisplayedText('');
    setWordArray([]);
    setAudioWordIndex(0);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setShowInfoScreen(false);
    setShowConfigScreen(false);
    setShowAccessibilityScreen(false);
    setShowSearchScreen(false);
    setLinkToAccess(null);
    cancelSpeech();
  };

  const textToCharArray = (text) => {
    return Array.from(text).map((ch) => ({
      char: ch,
      letter: normalizeChar(ch),
    }));
  };

  const splitTextIntoWords = (text) => {
    const regex = /[\p{L}\p{N}']+|\s+|[.,!?;:]/gu;
    const matches = text.match(regex);
    if (!matches) {
      return [];
    }
    return matches.filter((part) => part.trim() !== '');
  };

  const clickListener = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      const anchor = e.target.closest('a');
      if (anchor && anchor.href) {
        const linkText = anchor.innerText || anchor.textContent || '';
        const promptText = `Link ativado: ${linkText}. Deseja acessar?`;
        cancelSpeech();
        if (showAudio) {
          speakText(promptText);
        }

        setLinkToAccess(anchor.href);
        setLinkCoords({ x: e.clientX, y: e.clientY });
        setSelectingText(false);
        return;
      }

      if (showInfoScreen || showConfigScreen || showSearchScreen || showAccessibilityScreen) {
        return;
      }

      const el = e.target;
      const rawText = el.innerText || el.textContent || '';
      const trimmed = rawText.trim();
      if (!trimmed) {
        return;
      }

      clearInterval(intervalRef.current);
      intervalRef.current = null;

      const arr = textToCharArray(trimmed);
      if (arr.every((o) => o.letter === null)) {
        return;
      }

      setCharArray(arr);
      setSelectingText(false);
      setPlaybackIndex(0);
      setCurrentImage(null);
      setDisplayedText('');
      setShowInfoScreen(false);
      setShowConfigScreen(false);
      setShowSearchScreen(false);
      setShowAccessibilityScreen(false);
      setLinkToAccess(null);

      const words = splitTextIntoWords(trimmed);
      setWordArray(words);
      setAudioWordIndex(0);
      cancelSpeech();
    },
    [showInfoScreen, showConfigScreen, showSearchScreen, showAccessibilityScreen, cancelSpeech, showAudio, speakText]
  );

  useEffect(() => {
    if (selectingText) {
      document.body.style.cursor = `crosshair`;
      document.addEventListener('click', clickListener, true);
    } else {
      document.body.style.cursor = '';
      document.removeEventListener('click', clickListener, true);
    }
    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('click', clickListener, true);
    };
  }, [selectingText, clickListener]);

  const setupInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (charArray.length === 0 || playbackIndex >= charArray.length) {
      if (window.speechSynthesis && !window.speechSynthesis.speaking) {
        cancelSpeech();
      }
      return;
    }

    let currentIdx = playbackIndex;
    const delay = BASE_DELAY / speed;

    intervalRef.current = setInterval(() => {
      if (currentIdx < charArray.length) {
        const { char, letter } = charArray[currentIdx];
        if (letter) {
          setCurrentImage(`/images/acessibilidade/alfabeto_${letter}.png`);
        } else {
          setCurrentImage(null);
        }
        setDisplayedText((prev) => {
          const newText = prev + char;
          if (showAudio && wordArray.length > 0 && audioWordIndex < wordArray.length) {
            const currentWord = wordArray[audioWordIndex];
            if (newText.toLowerCase().includes(currentWord.toLowerCase()) || (currentIdx === charArray.length - 1 && audioWordIndex === wordArray.length - 1)) {
              if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
                speakText(currentWord);
                setAudioWordIndex((prevIndex) => prevIndex + 1);
              }
            }
          }
          return newText;
        });
        currentIdx++;
        setPlaybackIndex(currentIdx);
      } else {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        cancelSpeech();
      }
    }, delay);
  }, [charArray, playbackIndex, speed, cancelSpeech, showAudio, wordArray, audioWordIndex, speakText]);

  useEffect(() => {
    setupInterval();
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [charArray, speed, playbackIndex, setupInterval]);

  const progressPercent = charArray.length > 0 ? Math.min((playbackIndex / charArray.length) * 100, 100) : 0;

  const handleRestart = () => {
    if (charArray.length === 0) return;
    cancelSpeech();

    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setPlaybackIndex(0);
    setDisplayedText('');
    setCurrentImage(null);
    setAudioWordIndex(0);

    if (wordArray.length > 0) {
      setTimeout(() => {
        speakText(wordArray.join(' '));
      }, 50);
    }
  };

  const handleSkip = () => {
    if (charArray.length === 0) return;
    cancelSpeech();

    clearInterval(intervalRef.current);
    intervalRef.current = null;
    const lastItem = charArray[charArray.length - 1];
    if (lastItem.letter) {
      setCurrentImage(`/images/acessibilidade/alfabeto_${lastItem.letter}.png`);
    } else {
      setCurrentImage(null);
    }
    const fullText = charArray.map((o) => o.char).join('');
    setDisplayedText(fullText);
    setPlaybackIndex(charArray.length);
    setAudioWordIndex(wordArray.length);

    if (fullText) {
      setTimeout(() => {
        speakText(fullText);
      }, 50);
    }
  };

  const pausePlayback = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    cancelSpeech();
  };

  const resumePlayback = () => {
    if (!showInfoScreen && !showConfigScreen && !showSearchScreen && !showAccessibilityScreen) {
      setupInterval();
    }
  };

  const handleToggleInfo = () => {
    const willShow = !showInfoScreen;
    setShowInfoScreen(willShow);
    setShowConfigScreen(false);
    setShowSearchScreen(false);
    setShowAccessibilityScreen(false);
    willShow ? pausePlayback() : resumePlayback();
  };

  const handleToggleConfig = () => {
    const willShow = !showConfigScreen;
    setShowConfigScreen(willShow);
    setShowInfoScreen(false);
    setShowSearchScreen(false);
    setShowAccessibilityScreen(false);
    willShow ? pausePlayback() : resumePlayback();
  };

  const handleToggleSearch = () => {
    const willShow = !showSearchScreen;
    setShowSearchScreen(willShow);
    setShowInfoScreen(false);
    setShowConfigScreen(false);
    setShowAccessibilityScreen(false);
    willShow ? pausePlayback() : resumePlayback();
  };

  const handleToggleAccessibility = () => {
    const willShow = !showAccessibilityScreen;
    setShowAccessibilityScreen(willShow);
    setShowInfoScreen(false);
    setShowConfigScreen(false);
    setShowSearchScreen(false);
    willShow ? pausePlayback() : resumePlayback();
  };

  const isPlaying = charArray.length > 0 && playbackIndex < charArray.length && !showInfoScreen && !showConfigScreen && !showSearchScreen && !showAccessibilityScreen;

  const handleAccessLink = () => {
    if (linkToAccess) window.location.href = linkToAccess;
  };
  const handleCancelLink = () => {
    setLinkToAccess(null);
  };

  return (
    <>
      {/* ÍCONE PRINCIPAL FIXO (aparece se player NÃO estiver aberto) */}
      {!showPlayer && (
        <div className="fixed top-1/2 right-0 z-50 transform -translate-y-1/2 hover:scale-105 ease-linear duration-150">
          <div
            className="relative w-16 h-16 p-3 bg-orange rounded-l-lg flex items-center justify-center cursor-pointer shadow-lg shadow-black/40"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={handleClickIcon}
          >
            <Image src="/icons/libras.svg" width={40} height={40} alt="VLibras" className="filter invert" />
            {showTooltip && (
              <div className="absolute flex items-center justify-center flex-col right-full mr-2 top-1/2 -translate-y-1/2 bg-orange text-white text-sm px-4 py-2 rounded-md shadow transition-all duration-300 ease-in-out whitespace-nowrap">
                <Image src={"/logo.png"} width={100} height={100} alt="logo" />
                Acessibilidade em Libras
              </div>
            )}
          </div>
        </div>
      )}

      {/* PLAYER ABERTO */}
      {showPlayer && (
        <div className="fixed bottom-4 right-4 z-[56] w-80 max-h-[85vh] bg-white dark:bg-themeDark text-white rounded-lg shadow-lg overflow-hidden border border-DarkBlue dark:border-white flex flex-col">
          {/* Cabeçalho com ícones */}
          <div className="flex justify-between items-center px-4 py-2 bg-DarkBlue dark:bg-themeDark border-b">
            {/* CORRIGIDO: Adicionado space-x-4 para espaçamento entre ícones */}
            <div className="flex items-center space-x-4">
              <Cog6ToothIcon
                onClick={handleToggleConfig}
                className={`w-5 h-5 cursor-pointer ${showConfigScreen ? 'text-orange' : 'text-white'} hover:text-orange`}
                title="Configurações de Libras"
              />
              <UserCircleIcon
                onClick={handleToggleAccessibility}
                className={`w-5 h-5 cursor-pointer ${showAccessibilityScreen ? 'text-orange' : 'text-white'} hover:text-orange`}
                title="Acessibilidade do Site"
              />
              <MagnifyingGlassIcon
                onClick={handleToggleSearch}
                className={`w-5 h-5 cursor-pointer ${showSearchScreen ? 'text-orange' : 'text-white'} hover:text-orange`}
                title="Buscar"
              />
            </div>
            <h5 className="font-semibold text-white">Dr. EZHealth</h5>
            {/* CORRIGIDO: Adicionado space-x-4 para espaçamento entre ícones */}
            <div className="flex items-center space-x-4">
              <InformationCircleIcon
                onClick={handleToggleInfo}
                className={`w-5 h-5 cursor-pointer ${showInfoScreen ? 'text-orange' : 'text-white'} hover:text-orange`}
                title="Informações"
              />
              <XMarkIcon
                onClick={handleClosePlayer}
                className="w-6 h-6 text-white cursor-pointer hover:text-red-500"
                title="Fechar"
              />
            </div>
          </div>

          {/* Conteúdo do player (flex-grow para ocupar espaço) */}
          <div className="flex-grow overflow-y-auto">
            {loading ? (
              <div className="flex flex-col w-full h-full bg-white dark:bg-themeDark items-center justify-center p-6 text-center">
                <p className="mb-4 text-black dark:text-white">Carregando Dr.EZHealth Libras...</p>
                <div className="w-10 h-10 border-4 border-orange border-t-transparent rounded-full animate-spin" />
              </div>
            ) : showAccessibilityScreen ? (
              // TELA DE ACESSIBILIDADE
              <div className="p-4 text-sm text-black dark:text-white">
                <h2 className="text-lg font-semibold mb-4 text-center">Acessibilidade do Site</h2>
                <div className="space-y-4">
                  <button onClick={() => setGrayscale((p) => !p)} className={`w-full text-left p-2 rounded transition ${grayscale ? 'bg-orange text-white' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                    Preto e Branco
                  </button>
                  <div>
                    <p className="mb-2">Contraste</p>
                    {/* CORRIGIDO: Adicionado gap-2 para espaçamento */}
                    <div className="flex gap-2">
                      <button onClick={() => setContrast('none')} className={`flex-1 p-1 rounded transition ${contrast === 'none' ? 'bg-orange text-white' : 'bg-zinc-200 dark:bg-zinc-700'}`}>Nenhum</button>
                      <button onClick={() => setContrast('dark')} className={`flex-1 p-1 rounded transition ${contrast === 'dark' ? 'bg-orange text-white' : 'bg-zinc-200 dark:bg-zinc-700'}`}>Preto</button>
                      <button onClick={() => setContrast('light')} className={`flex-1 p-1 rounded transition ${contrast === 'light' ? 'bg-orange text-white' : 'bg-zinc-200 dark:bg-zinc-700'}`}>Branco</button>
                    </div>
                  </div>
                  <button onClick={() => setStopAnimations((p) => !p)} className={`w-full text-left p-2 rounded transition ${stopAnimations ? 'bg-orange text-white' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                    Parar Movimento
                  </button>
                  <button onClick={() => setReadableFont((p) => !p)} className={`w-full text-left p-2 rounded transition ${readableFont ? 'bg-orange text-white' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                    Fonte Legível
                  </button>
                  <button onClick={() => setUnderlineLinks((p) => !p)} className={`w-full text-left p-2 rounded transition ${underlineLinks ? 'bg-orange text-white' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                    Sublinhar Links
                  </button>
                  <div>
                    <p className="mb-2">Tamanho da Fonte</p>
                    {/* CORRIGIDO: Adicionado gap-2 para espaçamento */}
                    <div className="flex gap-2">
                      <button onClick={() => setFontSize('small')} className={`flex-1 p-1 rounded transition ${fontSize === 'small' ? 'bg-orange text-white' : 'bg-zinc-200 dark:bg-zinc-700'}`}>P</button>
                      <button onClick={() => setFontSize('medium')} className={`flex-1 p-1 rounded transition ${fontSize === 'medium' ? 'bg-orange text-white' : 'bg-zinc-200 dark:bg-zinc-700'}`}>M</button>
                      <button onClick={() => setFontSize('large')} className={`flex-1 p-1 rounded transition ${fontSize === 'large' ? 'bg-orange text-white' : 'bg-zinc-200 dark:bg-zinc-700'}`}>G</button>
                    </div>
                  </div>
                </div>
                <button onClick={handleResetAccessibility} className="w-full mt-6 p-2 rounded bg-red-500 text-white hover:bg-red-600 transition">
                  Resetar Tudo
                </button>
              </div>
            ) : showInfoScreen ? (
              // Tela "Quem Somos"
              <div className="p-4">
                <button onClick={handleToggleInfo} className="flex items-center px-3 py-1 mb-4 bg-orange rounded hover:bg-orange/80 transition">
                  <XMarkIcon className="w-4 h-4 text-white mr-2" />
                  <span className="text-sm">Voltar</span>
                </button>
                <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">Quem Somos</h2>
                <p className="text-sm text-black dark:text-white">
                  Somos a equipe EZHealth, dedicada a tornar a informação em Libras acessível a todos. Nosso objetivo é converter textos em imagens de Libras de forma intuitiva e prática, promovendo inclusão e acessibilidade digital. Trabalhamos continuamente para melhorar a experiência dos usuários.
                </p>
              </div>
            ) : showConfigScreen ? (
              // Tela de Configurações
              <div className="p-4">
                <button onClick={handleToggleConfig} className="flex items-center px-3 py-1 mb-4 bg-orange rounded hover:bg-orange/80 transition">
                  <XMarkIcon className="w-4 h-4 text-white mr-2" />
                  <span className="text-sm">Voltar</span>
                </button>
                <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">Configurações</h2>
                <div className="space-y-4">
                  <div className="flex items-center text-black dark:text-white">
                    <input type="checkbox" id="toggleSubtitle" checked={showSubtitle} onChange={() => setShowSubtitle((prev) => !prev)} className="mr-2 h-4 w-4" />
                    <label htmlFor="toggleSubtitle" className="text-sm">Mostrar Legenda</label>
                  </div>
                  <div className="flex items-center text-black dark:text-white">
                    <input type="checkbox" id="toggleAudio" checked={showAudio} onChange={() => setShowAudio((prev) => !prev)} className="mr-2 h-4 w-4" />
                    <label htmlFor="toggleAudio" className="text-sm">Ouvir Áudio</label>
                  </div>
                  <div className="flex items-center">
                    <label htmlFor="speedConfig" className="text-sm mr-2 text-black dark:text-white">Velocidade:</label>
                    <select id="speedConfig" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="border px-2 py-1 rounded text-sm text-black w-full">
                      <option value="0.5">0.5x</option>
                      <option value="1">1x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2x</option>
                      <option value="3">3x</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : showSearchScreen ? (
              // Tela de Buscar
              <div className="p-4">
                <button onClick={handleToggleSearch} className="flex items-center px-3 py-1 mb-4 bg-orange rounded hover:bg-orange/80 transition">
                  <XMarkIcon className="w-4 h-4 text-white mr-2" />
                  <span className="text-sm">Voltar</span>
                </button>
                <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">Buscar</h2>
                {/* CORRIGIDO: Espaçamento no formulário de busca */}
                <div className="flex flex-col gap-3">
                    <input type="text" placeholder="Digite para buscar..." className="w-full border px-2 py-1 rounded text-sm bg-zinc-100 text-black" />
                    <button className="px-4 py-2 bg-orange text-white rounded hover:bg-orange/80 transition text-sm">Buscar</button>
                </div>
              </div>
            ) : (
              // Tela Principal do Player
              <div className="flex flex-col items-center p-4 text-center">
                <button
                  onClick={handleStartSelecting}
                  className={`mt-2 px-4 py-2 w-full text-sm font-semibold ${selectingText ? 'bg-DarkBlue cursor-not-allowed' : 'bg-orange cursor-pointer'} text-white rounded hover:bg-orange/80 transition mb-4`}
                  disabled={selectingText}
                >
                  {selectingText ? 'Clique em um texto na página...' : 'Escolha um texto para traduzir'}
                </button>

                {charArray.length === 0 ? (
                  <Image src="/images/avatar-1.png" width={192} height={192} alt="VLibras Avatar" className="transition-opacity duration-500" />
                ) : (
                  <>
                    <div className="w-48 h-48 mb-4 flex items-center justify-center bg-orange/50 rounded overflow-hidden">
                      {currentImage ? (
                        <Image src={currentImage} width={192} height={192} alt="Letra Libras" className="transition-opacity duration-500" />
                      ) : (
                        <div className="text-white-500 text-sm">Sem imagem</div>
                      )}
                    </div>
                    {showSubtitle && (
                      <div className="w-full max-h-16 overflow-y-auto break-words mb-2 px-2 text-left text-sm text-black dark:text-white bg-zinc-100 dark:bg-zinc-800 rounded py-1">
                        {displayedText}
                      </div>
                    )}
                    <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden mb-4">
                      <div className="h-full bg-orange" style={{ width: `${progressPercent}%` }} />
                    </div>
                    {/* CORRIGIDO: Adicionado gap-2 para espaçamento e itens alinhados */}
                    <div className="flex items-center justify-between w-full gap-2">
                        <select id="speed-select" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="border px-2 py-1 rounded text-sm text-black flex-1">
                            <option value="0.5">0.5x</option>
                            <option value="1">1x</option>
                            <option value="1.5">1.5x</option>
                            <option value="2">2x</option>
                            <option value="3">3x</option>
                        </select>
                        <button onClick={handleRestart} className="flex items-center justify-center space-x-1 p-2 bg-orange rounded hover:bg-orange/80 transition flex-1">
                            <ArrowPathIcon className="w-5 h-5 text-white" />
                            <span className="text-sm font-medium text-white">Reiniciar</span>
                        </button>
                        {isPlaying && (
                            <button onClick={handleSkip} className="p-2 bg-orange rounded text-white hover:bg-orange/80 transition text-sm flex-1">
                                Pular
                            </button>
                        )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Prompt de Acessar Link */}
      {linkToAccess && (
        <div
          className="absolute z-60 bg-white border rounded shadow p-3 text-center"
          style={{ top: linkCoords.y + 8 + 'px', left: linkCoords.x + 8 + 'px' }}
        >
          <p className="text-sm mb-2 text-black">Acessar link?</p>
          {/* CORRIGIDO: Adicionado gap-2 para espaçamento */}
          <div className="flex gap-2">
            <button onClick={handleAccessLink} className="px-3 py-1 bg-orange text-white rounded text-xs hover:bg-orange/80 transition">Sim</button>
            <button onClick={handleCancelLink} className="px-3 py-1 bg-zinc-300 rounded text-xs hover:bg-zinc-400 transition">Não</button>
          </div>
        </div>
      )}
    </>
  );
}