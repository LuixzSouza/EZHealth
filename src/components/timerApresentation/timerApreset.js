'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

//=================================================================
// 1. HOOK E COMPONENTES AUXILIARES (SEM ALTERAÇÕES)
//=================================================================
const IconPlay = () => <svg fill="currentColor" viewBox="0 0 16 16" height="1em" width="1em"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>;
const IconSparkles = () => <svg fill="currentColor" viewBox="0 0 16 16" height="1em" width="1em"><path d="M5.05.316a.5.5 0 0 1 .318.632a.5.5 0 0 1-.632.318l-.835-.418a.5.5 0 0 1-.318-.632a.5.5 0 0 1 .632-.318l.835.418zm5.899.418a.5.5 0 0 1 .318-.632a.5.5 0 0 1 .632.318l.835.418a.5.5 0 0 1-.318.632a.5.5 0 0 1-.632-.318l-.835-.418zM8 .25a.5.5 0 0 1 .5.5v1.25a.5.5 0 0 1-1 0V.75a.5.5 0 0 1 .5-.5zM3.496 4.146a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708L3.496 4.853a.5.5 0 0 1 0-.707zm7.008 1.622a.5.5 0 0 1 .707 0l.915-.914a.5.5 0 0 1 .708.708l-.915.914a.5.5 0 0 1-.707 0a.5.5 0 0 1 0-.707zM13.5 8a.5.5 0 0 1 .5-.5h1.25a.5.5 0 0 1 0 1H14a.5.5 0 0 1-.5-.5zM.75 8a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-1 0V8.5a.5.5 0 0 1 .5-.5zM3.496 11.854a.5.5 0 0 1 0 .707l-.915.914a.5.5 0 1 1-.708-.708l.915-.914a.5.5 0 0 1 .707 0zm7.008 1.622a.5.5 0 0 1 .707 0l.915-.914a.5.5 0 0 1 .708.708l-.915.914a.5.5 0 1 1-.708-.708l.915-.914a.5.5 0 0 1 0 .707zM8 13.25a.5.5 0 0 1 .5.5v1.25a.5.5 0 0 1-1 0V13.75a.5.5 0 0 1 .5-.5z"/></svg>;
const CustomConfetti = ({ count = 150 }) => {
  const [pieces, setPieces] = useState([]);
  useEffect(() => {
    const colors = ['#f97316', '#ea580c', '#ffedd5', '#fed7aa'];
    const newPieces = Array.from({ length: count }).map((_, index) => (
      <div key={index} className="confetti-piece" style={{
        left: `${Math.random() * 100}%`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        animationDuration: `${Math.random() * 3 + 4}s`,
        animationDelay: `${Math.random() * 2}s`,
        transform: `rotate(${Math.random() * 360}deg)`,
        width: `${Math.floor(Math.random() * 10) + 8}px`,
        height: `${Math.floor(Math.random() * 10) + 8}px`,
        borderRadius: Math.random() > 0.5 ? '50%' : '0',
      }} />
    ));
    setPieces(newPieces);
  }, [count]);
  return <div className="confetti-container">{pieces}</div>;
};

const useCountUp = (end, duration = 2, startOnMount = false) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        if (!startOnMount) return;
        const start = 0;
        const frameDuration = 1000 / 60;
        const totalFrames = Math.round(duration * 1000 / frameDuration);
        let frame = 0;
        const counter = () => {
            frame++;
            const progress = frame / totalFrames;
            const currentCount = Math.round(start + (end - start) * progress);
            setCount(currentCount);
            if (frame < totalFrames) { ref.current = requestAnimationFrame(counter); }
        };
        ref.current = requestAnimationFrame(counter);
        return () => cancelAnimationFrame(ref.current);
    }, [end, duration, startOnMount]);
    return count;
};


//=================================================================
// COMPONENTE PRINCIPAL: TimerApresentacao
//=================================================================
export function TimerApresentacao() {
  const TEMPO_TOTAL = 600; //600 = 10min / 10s -> para teste
  const MOMENTO_REAPARECER = 60; //60 = 9min / 5s -> para teste

  const [tempoRestante, setTempoRestante] = useState(TEMPO_TOTAL);
  const [timerAtivo, setTimerAtivo] = useState(false);
  const [mostrarTelaFinal, setMostrarTelaFinal] = useState(false);
  const [mensagemRevelarVisivel, setMensagemRevelarVisivel] = useState(false);

  const containerRef = useRef(null);
  const telaFinalRef = useRef(null);
  const progressBarRef = useRef(null);
  const finalContentRef = useRef(null);

  const vidasImpactadas = useCountUp(8742, 2.5, mostrarTelaFinal);

  // --- LÓGICA DO TIMER ---
  useEffect(() => {
    const progresso = ((TEMPO_TOTAL - tempoRestante) / TEMPO_TOTAL) * 100;
    gsap.to(progressBarRef.current, { width: `${progresso}%`, duration: 1, ease: 'linear' });

    if (timerAtivo && tempoRestante <= MOMENTO_REAPARECER) {
      setMensagemRevelarVisivel(true);
    }

    if (!timerAtivo) return;
    if (tempoRestante === 0) {
      setTimerAtivo(false);
      return;
    }

    const intervalo = setInterval(() => {
      setTempoRestante(tempo => tempo > 0 ? tempo - 1 : 0);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [timerAtivo, tempoRestante]);

  // --- ANIMAÇÕES ---
  useEffect(() => {
    if (timerAtivo && !mensagemRevelarVisivel) {
      gsap.to(containerRef.current, { autoAlpha: 0, y: 20, duration: 0.5, ease: 'power3.in' });
    } else {
      gsap.to(containerRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' });
    }
  }, [timerAtivo, mensagemRevelarVisivel]);

  // ALTERADO: Lógica de animação da tela final
  useEffect(() => {
    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        if (!telaFinalRef.current) return;
        const { offsetWidth, offsetHeight } = telaFinalRef.current;
        const xPos = (clientX / offsetWidth - 0.5) * 30;
        const yPos = (clientY / offsetHeight - 0.5) * 30;
        gsap.to(finalContentRef.current, { x: -xPos, y: -yPos, duration: 0.5, ease: 'power3.out' });
    };

    if (mostrarTelaFinal) {
        gsap.timeline()
            .to(telaFinalRef.current, { autoAlpha: 1, duration: 0.5, ease: 'power3.out' })
            // Anima cada 'span' dentro dos elementos de texto
            .fromTo('.animate-word',
                { y: 30, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' },
                "-=0.2"
            );

        window.addEventListener('mousemove', handleMouseMove);
    } else {
      gsap.to(telaFinalRef.current, { autoAlpha: 0, duration: 0.5, ease: 'power3.out' });
    }

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mostrarTelaFinal]);

  // --- FUNÇÕES DE CONTROLE ---
  const toggleTimer = () => setTimerAtivo(!timerAtivo);
  const reiniciarTimer = () => {
    setMostrarTelaFinal(false);
    setTempoRestante(TEMPO_TOTAL);
    setTimerAtivo(false);
    setMensagemRevelarVisivel(false);
  };
  const formatarTempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1 z-[99999] pointer-events-none"> 
        <div ref={progressBarRef} className="h-full bg-orange dark:bg-orange/40 shadow-sm shadow-white dark:shadow-transparent"></div>
      </div>

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 pointer-events-none">
        <div ref={containerRef} className="pointer-events-auto opacity-0 translate-y-5">
          { mensagemRevelarVisivel ? (
            <div onClick={() => setMostrarTelaFinal(true)} className="flex items-center gap-3 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm p-4 pr-5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-white dark:hover:bg-zinc-800">
              <div className="text-orange text-2xl animate-pulse"><IconSparkles /></div>
              <span className="text-md font-semibold text-zinc-800 dark:text-zinc-100">Clique para revelar</span>
            </div>
          ) : (
            <div className="flex items-center gap-4 bg-white/70 dark:bg-zinc-800/70 backdrop-blur-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-lg">
              <button onClick={toggleTimer} className="flex items-center justify-center w-10 h-10 rounded-lg text-white text-xl transition-colors duration-300 bg-orange hover:brightness-110"><IconPlay /></button>
              <div className="text-2xl font-bold font-mono text-zinc-800 dark:text-zinc-100 w-[70px]">{formatarTempo(tempoRestante)}</div>
            </div>
          )}
        </div>
      </div>

      <div ref={telaFinalRef} className="fixed inset-0 bg-zinc-900/80 dark:bg-black/80 backdrop-blur-md flex flex-col justify-center items-center z-[99999] text-white text-center p-6 opacity-0 pointer-events-none">
        {mostrarTelaFinal && <CustomConfetti />}
        <div ref={finalContentRef} className="flex flex-col items-center gap-8 pointer-events-auto transition-transform duration-500">

          {/* =============================================== */}
          {/* ALTERADO: Título principal com número integrado */}
          {/* =============================================== */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="animate-word inline-block">Mais de</span>
              <span className="animate-word inline-block text-orange mx-3">
                {vidasImpactadas.toLocaleString('pt-BR')}
              </span>
              <span className="animate-word inline-block">vidas simplificadas.</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 max-w-3xl">
             <span className="animate-word inline-block">Com o <strong className="font-semibold text-orange">EZHealth</strong>, em apenas alguns minutos, a jornada de saúde se torna mais clara e acessível.</span>
          </p>

          <div className="animate-word inline-block">
            <button onClick={reiniciarTimer} className="mt-8 bg-orange text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:brightness-110">
              Finalizar e Reiniciar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}