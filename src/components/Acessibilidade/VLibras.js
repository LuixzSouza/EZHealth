// src/components/Acessibilidade/VLibras.js
'use client'; // <-- Correto, indica que é um Client Component

import { useEffect } from 'react';
import Script from 'next/script';

export default function VLibras() {
  useEffect(() => {
    // Este useEffect é executado apenas no lado do cliente
    console.log('[VLibras] Componente Cliente VLibras montado.');
  }, []);

  return (
    <>
      <Script
        id="vlibras-script-nextjs"
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive" // <-- Boa! Carrega após a hidratação.
        onLoad={() => {
          console.log('[VLibras] Script carregado com sucesso via next/script');

          // O setTimeout é crucial aqui para dar tempo ao script
          setTimeout(() => {
            if (window.VLibras) {
              console.log('[VLibras] window.VLibras detectado, inicializando widget');
              new window.VLibras.Widget('https://vlibras.gov.br/app'); // <-- Inicialização!
            } else {
              console.error('[VLibras] VLibras não detectado em window.VLibras após carregamento.');
            }
          }, 500); // <-- Tempo de espera (500ms é razoável)

        }}
        onError={(e) => {
          console.error('[VLibras] Erro ao carregar o script via next/script:', e);
          console.error('[VLibras] Detalhes do erro:', e.message || e);
        }}
      />
    </>
  );
}