'use client'

import { ContainerGrid } from "@/components/layout/ContainerGrid";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { Heading } from "@/components/typography/Heading";
import { useForm, useWatch } from "react-hook-form";

export function T_03_CheckInSect({ onNext, defaultValues }) {
  const { register, handleSubmit, control } = useForm({ defaultValues });
  const temConvenioWatch = useWatch({ control, name: 'dadosPessoalPaciente.temConvenio' });

  const onSubmit = (data) => onNext(data);

  return (
    <section className="py-16 bg-white dark:bg-themeDark">
      <ContainerGrid className="flex flex-col items-center justify-center text-center px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-lg bg-white/90 dark:bg-white/5 shadow-xl rounded-2xl p-8 text-left space-y-6 backdrop-blur-md border border-orange/30 dark:border-orangeDark/30"
        >
          <Heading as="h2" text="CHECK - IN" colorClass="dark:text-orangeDark text-orange" />
          
          <ParagraphBlue>
            Para começar, informe seus <span className="font-bold">dados pessoais</span> e, se tiver, o <span className="font-bold">número do convênio</span>. Assim, garantimos um atendimento ágil e sem burocracia.
          </ParagraphBlue>

          {/* Campo reutilizável: estilo aplicado via classes utilitárias */}
          {[
            { id: 'nome', label: 'Nome completo:', type: 'text', name: 'dadosPessoalPaciente.nome' },
            { id: 'dataNascimento', label: 'Data de nascimento:', type: 'date', name: 'dadosPessoalPaciente.dataNascimento' },
            { id: 'idade', label: 'Idade:', type: 'number', name: 'dadosPessoalPaciente.idade', props: { min: 0 } },
            { id: 'cpf', label: 'CPF ou número do SUS:', type: 'text', name: 'dadosPessoalPaciente.cpf' },
            { id: 'telefone', label: 'Telefone para contato:', type: 'tel', name: 'dadosPessoalPaciente.telefone', props: { placeholder: '(DDD) 00000-0000' } }
          ].map(({ id, label, type, name, props = {} }) => (
            <div key={id}>
              <label htmlFor={id} className="block mb-1 text-sm font-semibold text-orange">{label}</label>
              <input
                id={id}
                type={type}
                {...register(name, { required: true })}
                className="w-full px-4 py-2 border-2 border-orange rounded-md bg-white dark:bg-themeDark/10 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange transition-all"
                required
                {...props}
              />
            </div>
          ))}

          {/* Sexo */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-orange">Sexo:</label>
            <div className="flex flex-col gap-3">
              {['Masculino', 'Feminino', 'Outro', 'Prefiro não informar'].map((option, index) => (
                <label
                  key={option}
                  className="flex items-center gap-3 p-3 border border-gray-300 rounded-md cursor-pointer hover:border-orange transition-all
                            peer-checked:border-orange peer-checked:bg-orange peer-checked:text-white text-black dark:text-white"
                >
                  <input
                    type="radio"
                    value={option}
                    {...register('dadosPessoalPaciente.sexo', { required: true })}
                    className="peer accent-orange w-5 h-5"
                    name="sexo"
                    required
                  />
                  <span className="text-base">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Seletor de convênio */}
          <div>
            <label htmlFor="temConvenio" className="block mb-1 text-sm font-semibold text-orange">
              Possui convênio?
            </label>
            <select
              id="temConvenio"
              {...register('dadosPessoalPaciente.temConvenio', { required: true })}
              className="w-full px-4 py-2 border-2 border-orange rounded-md bg-white dark:bg-black/10 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange"
              required
            >
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>

          {/* Número do convênio */}
          {temConvenioWatch === "sim" && (
            <div>
              <label htmlFor="numConvenio" className="block mb-1 text-sm font-semibold text-orange">
                Número do convênio:
              </label>
              <input
                id="numConvenio"
                type="text"
                {...register('dadosPessoalPaciente.numConvenio', { required: true })}
                className="w-full px-4 py-2 border-2 border-orange rounded-md bg-white dark:bg-black/10 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-orange hover:bg-orange-600 text-white font-semibold py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition"
          >
            Próximo
          </button>
        </form>
      </ContainerGrid>
    </section>
  );
}
