import { useEffect, useState } from "react";
import { ToolAssistentText } from "../utils/ToolAssistentText";

export function DarkTheme() {
  const [darkMode, setDarkMode] = useState(null); // null inicialmente

  useEffect(() => {
    // Executa só no cliente
    const storedTheme = localStorage.getItem("theme");
    const isDark = storedTheme === "dark";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    if (darkMode !== null) {
      document.documentElement.classList.toggle("dark", darkMode);
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    }
  }, [darkMode]);

  // Enquanto `darkMode` for null (antes da montagem no cliente), não renderiza nada
  if (darkMode === null) return null;

  return (
    <div className="flex items-center justify-center">
        <button
        onClick={() => setDarkMode(!darkMode)}
        className={`relative group w-20 h-10 rounded-full p-1 transition-colors duration-500 ${
        darkMode ? "bg-slate-100/30" : "bg-orangeDark/30"
        }`}
        >
            <div
            className={`w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-500 flex items-center justify-center ${
                darkMode ? "translate-x-10" : "translate-x-0"
            }`}
            >
            {darkMode ? "🌙" : "🌞"}
            </div>
            <ToolAssistentText>
                {darkMode ? "Tema Escuro" : "Tema Claro"}
            </ToolAssistentText>
        </button>
    </div>
  );
}
