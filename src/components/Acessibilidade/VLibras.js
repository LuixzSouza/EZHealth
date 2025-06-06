'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function VLibras() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modo de seleção de texto
  const [selectingText, setSelectingText] = useState(false);

  // Array de objetos { char: originalChar, letter: normalizedLetterOrNull }
  const [charArray, setCharArray] = useState([]);

  // Índice atual no playback dos caracteres
  const [playbackIndex, setPlaybackIndex] = useState(0);

  // Path da imagem atual de Libras (ou null se char sem imagem)
  const [currentImage, setCurrentImage] = useState(null);

  // Texto que vai aparecendo abaixo da imagem
  const [displayedText, setDisplayedText] = useState('');

  // Controle de velocidade (multiplicador)
  const [speed, setSpeed] = useState(1); // 0.5x, 1x, 1.5x, 2x, 3x

  // Toggle legenda (mostrar texto abaixo da imagem)
  const [showSubtitle, setShowSubtitle] = useState(true);

  // Toggling de tela de "Quem Somos"
  const [showInfoScreen, setShowInfoScreen] = useState(false);

  // Toggling de tela de "Configuração" e "Buscar"
  const [showConfigScreen, setShowConfigScreen] = useState(false);
  const [showSearchScreen, setShowSearchScreen] = useState(false);

  // Dados do prompt "Acessar link"
  const [linkToAccess, setLinkToAccess] = useState(null);
  const [linkCoords, setLinkCoords] = useState({ x: 0, y: 0 });

  // Referência para o intervalo de playback
  const intervalRef = useRef(null);

  // Base de delay em ms (1x = 1000ms)
  const BASE_DELAY = 1000;

  // Normaliza c/ remoção de diacríticos e transforma em letra válida (a-z) ou null
  const normalizeChar = (ch) => {
    const normalized = ch
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    return normalized >= 'a' && normalized <= 'z' ? normalized : null;
  };

  // Inicia o player ao clicar no ícone
  const handleClickIcon = () => {
    setShowTooltip(false);
    setLoading(true);
    setShowPlayer(true);
    // fecha todas as telas internas
    setShowInfoScreen(false);
    setShowConfigScreen(false);
    setShowSearchScreen(false);
    setLinkToAccess(null);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  // Fecha o player e reseta estados
  const handleClosePlayer = () => {
    setShowPlayer(false);
    setSelectingText(false);
    setCharArray([]);
    setPlaybackIndex(0);
    setCurrentImage(null);
    setDisplayedText('');
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setSpeed(1);
    setShowInfoScreen(false);
    setShowConfigScreen(false);
    setShowSearchScreen(false);
    setShowSubtitle(true);
    setLinkToAccess(null);
  };

  // Inicia modo de seleção de texto
  const handleStartSelecting = () => {
    setSelectingText(true);
    setCharArray([]);
    setPlaybackIndex(0);
    setCurrentImage(null);
    setDisplayedText('');
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setShowInfoScreen(false);
    setShowConfigScreen(false);
    setShowSearchScreen(false);
    setLinkToAccess(null);
  };

  // Converte texto em array de objetos { char, letter }
  const textToCharArray = (text) => {
    return Array.from(text).map((ch) => ({
      char: ch,
      letter: normalizeChar(ch)
    }));
  };

  // Listener global de clique para capturar texto clicado OU link
  const clickListener = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Se clicou em <a href>, exibe prompt para acessar link
      const anchor = e.target.closest('a');
      if (anchor && anchor.href) {
        setLinkToAccess(anchor.href);
        setLinkCoords({ x: e.clientX, y: e.clientY });
        setSelectingText(false);
        return;
      }

      // Se alguma tela interna estiver aberta, ignora seleção de texto
      if (showInfoScreen || showConfigScreen || showSearchScreen) {
        return;
      }

      const el = e.target;
      const rawText = el.innerText || el.textContent || '';
      const trimmed = rawText.trim();
      if (!trimmed) return;

      // Cancela playback anterior para começar novo
      clearInterval(intervalRef.current);
      intervalRef.current = null;

      const arr = textToCharArray(trimmed);
      if (arr.every((o) => o.letter === null)) return; // se nenhuma letra válida, ignora

      setCharArray(arr);
      setSelectingText(false);
      setPlaybackIndex(0);
      setCurrentImage(null);
      setDisplayedText('');
      setShowInfoScreen(false);
      setShowConfigScreen(false);
      setShowSearchScreen(false);
      setLinkToAccess(null);
    },
    [showInfoScreen, showConfigScreen, showSearchScreen]
  );

  // Adiciona ou remove listener e ajusta cursor conforme selectingText
  useEffect(() => {
    if (selectingText) {
      document.body.style.cursor = `url("/icons/libras.svg"), auto`;
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

  // Configura ou reconfigura o intervalo de playback, começando de playbackIndex atual
  const setupInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (charArray.length === 0 || playbackIndex >= charArray.length) {
      return;
    }

    let idx = playbackIndex;
    const delay = BASE_DELAY / speed;

    intervalRef.current = setInterval(() => {
      if (idx < charArray.length) {
        const { char, letter } = charArray[idx];
        if (letter) {
          setCurrentImage(`/images/acessibilidade/alfabeto_${letter}.png`);
        } else {
          setCurrentImage(null);
        }
        setDisplayedText((prev) => prev + char);
        idx++;
        setPlaybackIndex(idx);
      } else {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, delay);
  }, [charArray, playbackIndex, speed]);

  // Efetua setup de intervalo sempre que charArray, speed ou playbackIndex mudam
  useEffect(() => {
    setupInterval();
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [charArray, speed, playbackIndex, setupInterval]);

  // Calcula progresso em porcentagem
  const progressPercent =
    charArray.length > 0
      ? Math.min((playbackIndex / charArray.length) * 100, 100)
      : 0;

  // Reinicia a automação (mesmo texto novamente)
  const handleRestart = () => {
    if (charArray.length === 0) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setPlaybackIndex(0);
    setDisplayedText('');
    setCurrentImage(null);
  };

  // "Pular" automação: mostra tudo de uma vez e limpa interval
  const handleSkip = () => {
    if (charArray.length === 0) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    const lastItem = charArray[charArray.length - 1];
    if (lastItem.letter) {
      setCurrentImage(`/images/acessibilidade/alfabeto_${lastItem.letter}.png`);
    } else {
      setCurrentImage(null);
    }
    setDisplayedText(charArray.map((o) => o.char).join(''));
    setPlaybackIndex(charArray.length);
  };

  // Alterna tela de "Quem Somos"
  const handleToggleInfo = () => {
    const willShowInfo = !showInfoScreen;
    setShowInfoScreen(willShowInfo);
    if (willShowInfo) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else {
      setupInterval();
    }
  };

  // Alterna tela de Configuração
  const handleToggleConfig = () => {
    const willShow = !showConfigScreen;
    setShowConfigScreen(willShow);
    // fecha outras telas
    setShowInfoScreen(false);
    setShowSearchScreen(false);
    if (willShow) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else {
      setupInterval();
    }
  };

  // Alterna tela de Buscar
  const handleToggleSearch = () => {
    const willShow = !showSearchScreen;
    setShowSearchScreen(willShow);
    // fecha outras telas
    setShowInfoScreen(false);
    setShowConfigScreen(false);
    if (willShow) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else {
      setupInterval();
    }
  };

  // Indica se está tocando (playback em andamento)
  const isPlaying =
    charArray.length > 0 && playbackIndex < charArray.length && !showInfoScreen && !showConfigScreen && !showSearchScreen;

  // Cadastrar ou cancelar o acesso ao link
  const handleAccessLink = () => {
    if (linkToAccess) window.location.href = linkToAccess;
  };
  const handleCancelLink = () => setLinkToAccess(null);

  return (
    <>
      {/* ÍCONE PRINCIPAL FIXO (aparece se player NÃO estiver aberto) */}
      {!showPlayer && (
        <div className="fixed top-1/2 right-0 z-50 transform -translate-y-1/2">
          <div
            className="relative w-16 h-16 p-3 bg-orange rounded-l-lg flex items-center justify-center cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={handleClickIcon}
          >
            <Image
              src="/icons/libras.svg"
              width={40}
              height={40}
              alt="VLibras"
              className="filter invert"
            />
            {showTooltip && (
              <div className="absolute flex items-center justify-center flex-col right-full mr-2 top-1/2 -translate-y-1/2 bg-orange text-white text-sm px-4 py-2 rounded-md shadow transition-all duration-300 ease-in-out whitespace-nowrap">
                <Image src={"/logo.png"} width={100} height={100} alt='logo'/>
                Acessibilidade em Libras
              </div>
            )}
          </div>
        </div>
      )}

      {/* PLAYER ABERTO (SEM OVERLAY PRETO) */}
      {showPlayer && (
        <div className="fixed bottom-1/4 right-4 z-50 w-80 min-h-[60vh] bg-white dark:bg-themeDark text-white rounded-lg shadow-lg overflow-hidden border border-DarkBlue dark:border-white">
          {/* Cabeçalho com ícones */}
          <div className="flex justify-between items-center px-4 py-2 bg-DarkBlue dark:bg-themeDark border-b">
            <div className="flex space-x-2">
              <Cog6ToothIcon
                onClick={handleToggleConfig}
                className={`w-5 h-5 cursor-pointer ${
                  showConfigScreen ? 'text-orange' : 'text-white-600'
                } hover:text-orange`}
                title="Configurações"
              />
              <MagnifyingGlassIcon
                onClick={handleToggleSearch}
                className={`w-5 h-5 cursor-pointer ${
                  showSearchScreen ? 'text-orange' : 'text-white-600'
                } hover:text-orange`}
                title="Buscar"
              />
            </div>
            <h5>
              Dr. EZHealth Libras
            </h5>
            <div className="flex space-x-2">
              <InformationCircleIcon
                onClick={handleToggleInfo}
                className={`w-5 h-5 cursor-pointer ${
                  showInfoScreen ? 'text-orange' : 'text-white-600'
                } hover:text-orange`}
                title="Informações"
              />
              <XMarkIcon
                onClick={handleClosePlayer}
                className="w-6 h-6 text-white-700 cursor-pointer hover:text-red-500"
                title="Fechar"
              />
            </div>
          </div>

          {/* Conteúdo do player */}
          {loading ? (
            <div className="flex flex-col w-full h-full bg-white dark:bg-themeDark items-center justify-center p-6">
              <p className="mb-4 text-black dark:text-white">Carregando Dr.EZHealth Libras...</p>
              <div className="w-10 h-10 border-4 border-orange border-t-transparent rounded-full animate-spin" />
            </div>
          ) : showInfoScreen ? (
            // Tela "Quem Somos"
            <div className="p-4">
              <button
                onClick={handleToggleInfo}
                className="flex items-center px-3 py-1 mb-4 bg-orange rounded hover:bg-orange/80 transition"
              >
                <XMarkIcon className="w-4 h-4 text-white mr-2" />
                <span className="text-sm">Voltar</span>
              </button>
              <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">Quem Somos</h2>
              <p className="text-sm text-black dark:text-white">
                Somos a equipe EZHealth, dedicada a tornar a informação em Libras acessível a todos.
                Nosso objetivo é converter textos em imagens de Libras de forma intuitiva e prática,
                promovendo inclusão e acessibilidade digital. Trabalhamos continuamente para melhorar
                a experiência dos usuários.
              </p>
            </div>
          ) : showConfigScreen ? (
            // Tela de Configurações
            <div className="p-4">
              <button
                onClick={handleToggleConfig}
                className="flex items-center px-3 py-1 mb-4 bg-orange rounded hover:bg-orange/80 transition"
              >
                <XMarkIcon className="w-4 h-4 text-white mr-2" />
                <span className="text-sm">Voltar</span>
              </button>
              <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">Configurações</h2>
              <div className="flex items-center mb-4 text-black dark:text-white">
                <input
                  type="checkbox"
                  id="toggleSubtitle"
                  checked={showSubtitle}
                  onChange={() => setShowSubtitle((prev) => !prev)}
                  className="mr-2"
                />
                <label htmlFor="toggleSubtitle" className="text-sm">
                  Mostrar Legenda
                </label>
              </div>
              <div className="mb-4">
                <label htmlFor="speedConfig" className="text-sm mr-2 text-black dark:text-white">
                  Velocidade:
                </label>
                <select
                  id="speedConfig"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="border px-2 py-1 rounded text-sm text-black"
                >
                  <option value="0.5">0.5x</option>
                  <option value="1">1x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                </select>
              </div>
            </div>
          ) : showSearchScreen ? (
            // Tela de Buscar
            <div className="p-4">
              <button
                onClick={handleToggleSearch}
                className="flex items-center px-3 py-1 mb-4 bg-orange rounded hover:bg-orange/80 transition"
              >
                <XMarkIcon className="w-4 h-4 text-white mr-2" />
                <span className="text-sm">Voltar</span>
              </button>
              <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">Buscar</h2>
              <input
                type="text"
                placeholder="Digite para buscar..."
                className="w-full border px-2 py-1 rounded text-sm mb-2 bg-zinc-100"
              />
              <button className="px-4 py-2 bg-orange text-white rounded hover:bg-orange/80 transition text-sm">
                Buscar
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center p-4 text-center">
              {/* Botão de escolher texto */}
              <button
                onClick={handleStartSelecting}
                className={`mt-2 px-4 py-2 text-sm font-semibold ${
                  selectingText
                    ? 'bg-DarkBlue cursor-not-allowed'
                    : 'bg-orange cursor-pointer'
                } text-white rounded hover:bg-orange-600 transition mb-2`}
                disabled={selectingText}
              >
                {selectingText
                  ? 'Clique em um texto na página...'
                  : 'Escolha um texto para traduzir'}
              </button>

              {/* Se não há caracteres, exibe avatar inicial; caso contrário, exibe playback */}
              {charArray.length === 0 ? (
                <Image
                  src="/images/avatar-1.png"
                  width={192}
                  height={192}
                  alt="VLibras Avatar"
                  className="mb-4 transition-opacity duration-500"
                />
              ) : (
                <>
                  {/* Exibe imagem atual de Libras (ou nada se letter==null) */}
                  <div className="w-48 h-48 mb-4 flex items-center justify-center bg-orange/50 rounded overflow-hidden">
                    {currentImage ? (
                      <Image
                        src={currentImage}
                        width={192}
                        height={192}
                        alt="Letra Libras"
                        className="transition-opacity duration-500"
                      />
                    ) : (
                      <div className="text-white-500 text-sm">Sem imagem</div>
                    )}
                  </div>

                  {/* Texto exibido, com wrapping e scroll se for muito longo */}
                  {showSubtitle && (
                    <div className="w-full max-h-16 overflow-y-auto break-words mb-2 px-2 text-left text-sm text-black dark:text-white">
                      {displayedText}
                    </div>
                  )}

                  {/* Barra de progresso */}
                  <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-orange"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between w-full mb-4">
                    {/* Controles de velocidade */}
                    <select
                      id="speed-select"
                      value={speed}
                      onChange={(e) => {
                        setSpeed(parseFloat(e.target.value));
                      }}
                      className="border px-2 py-1 rounded text-sm text-black"
                    >
                      <option value="0.5">0.5x</option>
                      <option value="1">1x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2x</option>
                      <option value="3">3x</option>
                    </select>

                    {/* Botão de reiniciar automação */}
                    <button
                      onClick={handleRestart}
                      className="flex items-center space-x-1 px-3 py-2 bg-orange rounded hover:bg-orange/80 transition"
                    >
                      <ArrowPathIcon className="w-5 h-5 text-white" />
                      <span className="text-sm font-medium text-white">Reiniciar</span>
                    </button>

                    {/* Botão "Pular" aparece somente durante playback */}
                    {isPlaying && (
                      <button
                        onClick={handleSkip}
                        className="px-3 py-2 bg-orange rounded text-white hover:bg-orange/80 transition text-sm"
                      >
                        Pular
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Prompt de Acessar Link próximo ao clique */}
      {linkToAccess && (
        <div
          className="absolute z-60 bg-white border rounded shadow p-2 text-center"
          style={{
            top: linkCoords.y + 8 + 'px',
            left: linkCoords.x + 8 + 'px'
          }}
        >
          <p className="text-xs mb-1">Acessar link?</p>
          <div className="flex space-x-2">
            <button
              onClick={handleAccessLink}
              className="px-2 py-1 bg-orange text-white rounded text-xs hover:bg-orange-600 transition"
            >
              Sim
            </button>
            <button
              onClick={handleCancelLink}
              className="px-2 py-1 bg-zinc-300 rounded text-xs hover:bg-zinc-400 transition"
            >
              Não
            </button>
          </div>
        </div>
      )}
    </>
  );
}
