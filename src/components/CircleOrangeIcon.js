import Image from "next/image";

export function CircleOrangeIcon({img}) {
    return(
        <div className="w-full max-w-16 p-3 rounded-full flex items-center justify-center bg-orange">
            <Image src={img} width={35} height={35} alt="Icon"/>
        </div>
    )
}