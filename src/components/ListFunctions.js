import { CircleOrangeIcon } from "./CircleOrangeIcon";
import { ParagraphBlue } from "./ParagraphBlue";

export function ListFunctions({img, title, text}) {
    return(
        <div className="flex flex-col items-center justify-center gap-10 lg:flex-row lg:justify-start" >
            <CircleOrangeIcon img={`/icons/${img}`}/>
            <div className="w-full max-w-6xl flex flex-col items-center justify-center text-center lg:text-left lg:items-start lg:justify-start" >
                <h5 className="text-DarkBlue font-semibold text-3xl" >{title}</h5>
                <ParagraphBlue>{text}</ParagraphBlue>
            </div>
        </div>
    )
}