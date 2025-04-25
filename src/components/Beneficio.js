export function Beneficio({children}) {
    return(
        <div className="w-full rounded-full p-6 bg-orange text-white" >
            <p className="text-3xl font-semibold" >
                {children}
            </p>
        </div>
    )
}