import { CircleOrangeIcon } from "../theme/CircleOrangeIcon";
import { ParagraphBlue } from "../theme/ParagraphBlue";
import { Heading } from "../typography/Heading";

export function CardOption({ onClick, title, description, img }) {
  return (
    <div
      onClick={onClick}
      className="
        flex flex-col items-center justify-center text-center
        w-full max-w-96 h-96        
        bg-orange/10 rounded-2xl p-8 gap-4 cursor-pointer
        hover:bg-orange/20 hover:scale-105
        transition-all duration-200 ease-in-out shadow-xl
      "
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <CircleOrangeIcon img={`/icons/${img}.svg`} />
      <div>
        <Heading as="h4" colorClass="text-orange" className="text-2xl md:text-3xl font-bold" text={title}/>
        <ParagraphBlue>{description}</ParagraphBlue>
      </div>
    </div>
  );
}
