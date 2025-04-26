import Image from "next/image";

export function MenuSearch({isOpen, onClose}) {

    return(
        <div className={`fixed top-0 z-[51] bg-black/30 w-screen h-screen flex items-start justify-end transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} >
            <div className={`flex flex-col bg-orange w-full max-w-md h-screen px-10 py-20 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} >
                <div onClick={onClose} className="group w-full max-w-16 h-16 border-2 border-white bg-white flex items-center justify-center rounded-full hover:bg-orange transition-all duration-200 ease-in-out cursor-pointer active:scale-110" >
                    <Image className="group-hover:invert group-hover:filter group-hover:brightness-0 group-hover:scale-110 transition-all duration-150 ease-in-out" src={"/icons/seta-direita-laranja.svg"} width={20} height={20} alt="avatar"/>
                </div>
                <div className="mt-10 flex items-center justify-between w-full p-5 border-2 border-white rounded-full overflow-hidden bg-white" >
                    <input className="bg-transparent w-full h-full" />
                    <Image className="filter brightness-100" src={"/icons/pesquisa-de-lupa.svg"} width={30} height={30} alt="Icon"/>
                </div>
            </div>
        </div>
    )
}