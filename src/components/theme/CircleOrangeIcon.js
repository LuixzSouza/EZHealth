import Image from "next/image";

export function CircleOrangeIcon({img}) {
    return(
        <div className="w-full max-w-24 p-5 rounded-full flex items-center justify-center dark:bg-orangeDark bg-orange">
            <Image src={img} width={50} height={35} alt="Icon" className="filter dark:invert dark:brightness-0" />
        </div>
    )
}