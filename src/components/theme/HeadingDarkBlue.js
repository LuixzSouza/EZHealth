export function HeadingDarkBlue({text = ''}){
    return(
        <>
            <h2 className="dark:text-themeTextDark text-DarkBlue font-semibold text-3xl md:text-5xl" >
                {text}
            </h2>
        </>
    )
}