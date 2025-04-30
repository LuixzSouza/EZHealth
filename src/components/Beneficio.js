export function Beneficio({children}) {
    return(
        <div className="w-full rounded-full p-6 bg-orange text-white" >
            <p className="text-1xl font-semibold lg:text-3xl" >
                {children}
            </p>
        </div>
    )
}