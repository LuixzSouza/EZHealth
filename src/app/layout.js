import { Montserrat } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/ChatBot/Chatbot";

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
        {children}
        <Chatbot/>
      </body>
    </html>
  );
}
