import { CircleOrangeIcon } from "./CircleOrangeIcon";
import { ParagraphBlue } from "./ParagraphBlue";

export function ListFunctions({img, title, text}) {
    return(
        <div className="flex items-center justify-start gap-10" >
            <CircleOrangeIcon img={`/icons/${img}`}/>
            <div className="w-full max-w-6xl flex flex-col items-start justify-start" >
                <h5 className="text-DarkBlue font-semibold text-3xl" >{title}</h5>
                <ParagraphBlue>{text}</ParagraphBlue>
            </div>
        </div>
    )
}