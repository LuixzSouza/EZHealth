'use client'

import { useState } from "react";
import { ContainerGrid } from "../ContainerGrid";
import { HeadingOrange } from "../HeadingOrange";
import { ParagraphBlue } from "../ParagraphBlue";

export function TCheckInSecti({ onNext }) {
  const [temConvenio, setTemConvenio] = useState("");

  const baseFields = [
    { id: "nome", label: "Nome", type: "text", required: true },
    { id: "cpf", label: "CPF", type: "text", required: true }
  ];

  const convenioField = {
    id: "numConvenio",
    label: "Número do convênio",
    type: "text",
    required: true
  };

  return (
    <section>
      <ContainerGrid className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-10">

        <form
          onSubmit={(e) => {
            e.preventDefault(); // evita reload da página
            onNext(); // avança para próxima etapa
          }}
          className="w-full max-w-lg mt-8 bg-white shadow-2xl rounded-2xl p-8 text-left space-y-5"
        >
        <HeadingOrange text="CHECK - IN" />
        <ParagraphBlue>
          Para começar, informe seu <span className="font-bold">Nome, CPF e Número do convênio.</span> Assim, garantimos um atendimento ágil e sem burocracia.
        </ParagraphBlue>
          {/* Campos base (nome, cpf) */}
          {baseFields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="text-orange font-semibold block mb-1">
                {field.label}:
              </label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                className="border-2 border-orange rounded-md p-2 w-full bg-transparent focus:outline-none focus:ring-2 focus:ring-orange"
                required={field.required}
              />
            </div>
          ))}

          {/* Seletor de convênio */}
          <div>
            <label htmlFor="temConvenio" className="text-orange font-semibold block mb-1">
              Possui convênio?
            </label>
            <select
              id="temConvenio"
              className="border border-orange rounded-md p-2 w-full bg-transparent focus:outline-none focus:ring-2 focus:ring-orange"
              value={temConvenio}
              onChange={(e) => setTemConvenio(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>

          {/* Campo adicional se tiver convênio */}
          {temConvenio === "sim" && (
            <div>
              <label htmlFor={convenioField.id} className="text-orange font-semibold block mb-1">
                {convenioField.label}:
              </label>
              <input
                id={convenioField.id}
                name={convenioField.id}
                type={convenioField.type}
                className="border-2 border-orange rounded-md p-2 w-full bg-transparent focus:outline-none focus:ring-2 focus:ring-orange"
                required={convenioField.required}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-orange text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition"
          >
            Próximo
          </button>
        </form>
      </ContainerGrid>
    </section>
  );
}
