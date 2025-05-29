export function HeadingOrange({text = ''}){
    return(
        <>
            <h2 className="dark:text-orangeDark text-orange font-semibold text-3xl md:text-5xl" >
                {text}
            </h2>
        </>
    )
}