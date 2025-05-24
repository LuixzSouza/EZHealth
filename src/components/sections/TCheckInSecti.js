'use client'

import { useState } from "react";
import { ContainerGrid } from "../ContainerGrid";
import { HeadingOrange } from "../HeadingOrange";
import { ParagraphBlue } from "../ParagraphBlue";

export function TCheckInSecti() {
    const [temConvenio, setTemConvenio] = useState("");

    return(
        <section>
            <ContainerGrid className="flex flex-col items-center justify-center gap-6 h-screen text-center" >
                <HeadingOrange text="CHECK - IN"/>
                <ParagraphBlue>Para começar, informe seu <span className="font-bold" >Nome, CPF e Número do convênio.</span> Assim, garantimos um atendimento ágil e sem burocracia.</ParagraphBlue>
                <div className="flex flex-col" >
                    <div className="w-full" >
                        <label className="text-orange font-semibold" >Nome:</label>
                        <input className="border-2 border-orange w-full bg-transparent" />
                    </div>
                    <div className="w-full" >
                        <label className="text-orange font-semibold" >CPF:</label>
                        <input className="border-2 border-orange w-full bg-transparent" />
                    </div>
                    <div className="w-full">
                        <label className="text-orange font-semibold">Possui convênio?</label>
                        <select
                        className="border border-orange w-full bg-transparent"
                        value={temConvenio}
                        onChange={(e) => setTemConvenio(e.target.value)}
                        >
                            <option value="">Selecione</option>
                            <option value="sim">Sim</option>
                            <option value="nao">Não</option>
                        </select>
                    </div>
                    {temConvenio === "sim" && (
                        <div className="w-full">
                        <label className="text-orange font-semibold">Número do convênio:</label>
                        <input className="border-2 border-orange w-full bg-transparent" />
                        </div>
                    )}
                </div>
            </ContainerGrid>
        </section>
    )
}