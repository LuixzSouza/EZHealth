import Image from "next/image";

export function CircleOrangeIcon({img}) {
    return(
        <div className="w-full max-w-24 p-5 rounded-full flex items-center justify-center bg-orange">
            <Image src={img} width={50} height={35} alt="Icon"/>
        </div>
    )
}