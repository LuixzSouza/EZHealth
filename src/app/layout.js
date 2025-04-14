import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700", "800",],
  style: ['normal', 'italic'],
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
})
export const metadata = {
  title: "eZHealth",
  description: "Triagem rapida e Inteligente",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
