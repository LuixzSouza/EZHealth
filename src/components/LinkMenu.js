import Link from "next/link";

export function LinkMenu({children, link="/", onClick }) {
    return(
        <Link onClick={onClick} className="text-white text-3xl hover:bg-slate-100 hover:text-black transition-all duration-200 ease-in-out p-4" href={link}>
            {children}
        </Link>
    )
}