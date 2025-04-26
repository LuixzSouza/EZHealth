import { Header } from "@/components/Header";
import { TCheckInSecti } from "@/components/sections/TCheckInSecti";
import { TChooseSect } from "@/components/sections/TChooseSect";
import { TConfirmed } from "@/components/sections/TConfirmed";
import { TriagemHomeSect } from "@/components/sections/TriagemHomeSect";

export default function Formulario() {
    return(
        <>
            <Header/>
            <TriagemHomeSect/>
            <TChooseSect/>
            <TCheckInSecti/>
            <TConfirmed/>
        </>
    )
}