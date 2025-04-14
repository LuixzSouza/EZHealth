import { Beneficio } from "@/components/Beneficio";
import { CircleOrangeIcon } from "@/components/CircleOrangeIcon";
import { HeadingDarkBlue } from "@/components/HeadingDarkBlue";
import { HeadingOrange } from "@/components/HeadingOrange";
import { ParagraphBlue } from "@/components/ParagraphBlue";
import { SpanParagraph } from "@/components/SpanParagraph";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <h1>Teste</h1>
      <h2>Teste</h2>
      <h3>Teste</h3>
      <h4>Teste</h4>
      <h5>Teste</h5>
      <h6>Teste</h6>
      <HeadingOrange text="Teste" />
      <HeadingDarkBlue text="Teste" />
      <ParagraphBlue content={"O EZHealth blabla"} /><SpanParagraph content={'Teste'} />
      <CircleOrangeIcon img={"/icons/pesquisa-de-lupa.svg"}/>
      <Beneficio content={"Reducao de tempo de especa com chec in digita"} />
      <p>Bem-vindo ao <span>EZHealth</span></p>
      <Image src={"/logo.png"} width={180} height={60} alt="Icon"/>
      <Image src={"/images/avatar-1.png"} width={200} height={200} alt="avatar"/>
      <Image src={"/images/avatar-2.png"} width={200} height={200} alt="avatar"/>
      <Image src={"/images/avatar-3.png"} width={200} height={200} alt="avatar"/>
      <Image src={"/images/avatar-4.png"} width={200} height={200} alt="avatar"/>
    </>
  );
}
