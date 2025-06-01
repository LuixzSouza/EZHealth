// Importante ao importar para outro componente na Div pai colocar (relative e group)

export function ToolAssistentText({children}) {
    return (
        <div className="absolute bottom-[-2.5rem] left-1/2 -translate-x-1/2 bg-black/90 border border-white/40 text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-10 pointer-events-none overflow-visible">
            {children}
        </div>
    )
}