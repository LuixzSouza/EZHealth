// src/app/layout.js
import { Montserrat } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/ChatBot/Chatbot";
import VLibras2 from "@/components/Acessibilidade/VLibras";
// import VLibras from 'vlibras-nextjs'
// REMOVA: import Script from 'next/script'; // Não precisamos mais importar Script aqui diretamente para o Hand Talk

// IMPORTAR O NOVO COMPONENTE CLIENTE

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ['normal', 'italic'],
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "eZHealth",
  description: "Triagem rápida e inteligente",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        {/* Script para tema - Mantenha-o aqui para evitar flash de tema */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        
      </head>
      <body className={`${montserrat.variable} antialiased`}>
        {children}
        <Chatbot/>

        {/* --- Renderiza o HandTalkScript Client Component --- */}
        {/* Ele mesmo conterá o <Script> e suas lógicas de onLoad/onError */}
        <VLibras2 /> 
        
      </body>
    </html>
  );
}