'use client'

import { ContainerGrid } from "@/components/layout/ContainerGrid";
import { HeadingOrange } from "@/components/theme/HeadingOrange";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { useState } from "react";

export function T_03_CheckInSect({ onNext }) {
  const [temConvenio, setTemConvenio] = useState("");
  const [sexo, setSexo] = useState("");

  return (
    <section>
      <ContainerGrid className="flex flex-col items-center justify-center text-center px-4">

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onNext();
          }}
          className="w-full max-w-lg mt-8 bg-white/10 shadow-2xl rounded-2xl p-8 text-left space-y-5 text-black"
        >
          <HeadingOrange text="CHECK - IN" />
          <ParagraphBlue>
            Para começar, informe seus <span className="font-bold">dados pessoais</span> e, se tiver, o <span className="font-bold">número do convênio</span>. Assim, garantimos um atendimento ágil e sem burocracia.
          </ParagraphBlue>

          {/* Nome completo */}
          <div>
            <label htmlFor="nome" className="text-orange font-semibold block mb-1">
              Nome completo:
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              className="border-2 border-orange rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange bg-white"
              required
            />
          </div>

          {/* Data de nascimento */}
          <div>
            <label htmlFor="dataNascimento" className="text-orange font-semibold block mb-1">
              Data de nascimento:
            </label>
            <input
              id="dataNascimento"
              name="dataNascimento"
              type="date"
              className="border-2 border-orange rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange bg-white"
              required
            />
          </div>

          {/* Idade */}
          <div>
            <label htmlFor="idade" className="text-orange font-semibold block mb-1">
              Idade:
            </label>
            <input
              id="idade"
              name="idade"
              type="number"
              min="0"
              className="border-2 border-orange rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange bg-white"
              required
            />
          </div>

          {/* Sexo */}
          <div>
            <label className="text-orange font-semibold block mb-1">Sexo:</label>
            <div className="flex flex-col gap-1">
              {['Masculino', 'Feminino', 'Outro', 'Prefiro não informar'].map((option) => (
                <label key={option} className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="sexo"
                    value={option}
                    checked={sexo === option}
                    onChange={(e) => setSexo(e.target.value)}
                    required
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* CPF ou SUS */}
          <div>
            <label htmlFor="cpf" className="text-orange font-semibold block mb-1">
              CPF ou número do SUS:
            </label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              className="border-2 border-orange rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange bg-white"
              required
            />
          </div>

          {/* Telefone */}
          <div>
            <label htmlFor="telefone" className="text-orange font-semibold block mb-1">
              Telefone para contato:
            </label>
            <input
              id="telefone"
              name="telefone"
              type="tel"
              className="border-2 border-orange rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange bg-white"
              placeholder="(DDD) 00000-0000"
              required
            />
          </div>

          {/* Seletor de convênio */}
          <div>
            <label htmlFor="temConvenio" className="text-orange font-semibold block mb-1">
              Possui convênio?
            </label>
            <select
              id="temConvenio"
              className="border border-orange rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange bg-white"
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
              <label htmlFor="numConvenio" className="text-orange font-semibold block mb-1">
                Número do convênio:
              </label>
              <input
                id="numConvenio"
                name="numConvenio"
                type="text"
                className="border-2 border-orange rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange bg-white"
                required
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
