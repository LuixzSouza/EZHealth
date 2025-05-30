import { twMerge } from "tailwind-merge";

export function ButtonPrimary({ children, onClick, className = '' }) {
    const baseClasses = "bg-orange text-white px-8 py-3 rounded-full font-semibold";
    const hoverClasses = "hover:bg-transparent hover:scale-105 hover:shadow-lg hover:border hover:border-orange hover:text-orange transition-all duration-300 ease-in-out";
    const combinedClasses = twMerge(baseClasses, hoverClasses, className);

    return (
        <button
            onClick={onClick}
            className={combinedClasses}
        >
            {children}
        </button>
    );
}