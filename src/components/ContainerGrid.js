import { twMerge } from "tailwind-merge"

export function ContainerGrid({ children, className = "" }) {
    const defaultClass = "w-full mx-auto px-[8.3vw]";
    const combinedClasses = twMerge(defaultClass, className)
    return (
        <div className={combinedClasses} >
            {children}
        </div>
    )
}