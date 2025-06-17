import { Montserrat } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/ChatBot/Chatbot";
import VLibras2 from "@/components/Acessibilidade/VLibras";

// --- IMPORTAÇÕES CORRETAS ---
import { TimerProvider } from "@/context/TimerContext";
// Importamos o TimerRenderer de seu próprio arquivo, que vamos criar a seguir.
import { TimerRenderer } from "@/components/timerApresentation/TimerRenderer"; 

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
        {/* O Provedor envolve toda a aplicação, isso está correto. */}
        <TimerProvider>
          {children}
          <Chatbot />
          <VLibras2 />
          
          {/* Chamamos o componente importado, que tem sua própria lógica. */}
          <TimerRenderer />
        </TimerProvider>
      </body>
    </html>
  );
}