'use client'; // Diretiva no topo, marcando o arquivo como Cliente

import { useTimer } from '@/context/TimerContext';
import { TimerApresentacao } from './timerApreset'; // Importa o componente do timer

export function TimerRenderer() {
  const { isTimerEnabled } = useTimer();

  // Se o timer não estiver ativado no contexto, não renderiza nada.
  if (!isTimerEnabled) {
    return null;
  }

  // Se estiver ativado, renderiza o componente do timer.
  return <TimerApresentacao />;
}