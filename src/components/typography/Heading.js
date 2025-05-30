// src/components/common/typography/Heading.js

import { twMerge } from "tailwind-merge";

export function Heading({
    text = '',
    colorClass = '',
    as: Component = 'h2', 
    className = '' 
}) {
    const baseClasses = "font-semibold text-3xl md:text-5xl";

    const combinedClasses = twMerge(baseClasses, colorClass, className);

    return (
        <Component className={combinedClasses}>
            {text}
        </Component>
    );
}