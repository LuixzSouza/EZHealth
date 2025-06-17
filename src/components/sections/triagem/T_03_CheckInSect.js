'use client'

import { useState, useEffect } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { IMaskInput } from 'react-imask';
import { ContainerGrid } from "@/components/layout/ContainerGrid";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";
import { Heading } from "@/components/typography/Heading";
import { useSpeechToForm } from "@/hooks/useSpeechToForm";
import { XCircleIcon } from "@heroicons/react/24/solid"; // Importado

const MicrophoneIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5a6 6 0 0 0-12 0v1.5a6 6 0 0 0 6 6Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5" />
  </svg>
);

const sexoOptions = [
  { label: 'Masculino', value: 'M' },
  { label: 'Feminino', value: 'F' },
  { label: 'Outro', value: 'Outro' },
  { label: 'Prefiro não informar', value: 'Outro' } 
];

export function T_03_CheckInSect({ onNext, defaultValues }) {
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    defaultValues,
    mode: 'onBlur'
  });
  
  const { activeField, startListening, hasRecognitionSupport } = useSpeechToForm({ setValue });
  const nomeValue = useWatch({ control, name: 'dadosPessoalPaciente.nome' });
  const temConvenioWatch = useWatch({ control, name: 'dadosPessoalPaciente.temConvenio' });
  const dataNascimentoWatch = useWatch({ control, name: 'dadosPessoalPaciente.dataNascimento' });
  const [idade, setIdade] = useState(null);

  useEffect(() => {
    if (dataNascimentoWatch) {
      const hoje = new Date();
      const nascimento = new Date(dataNascimentoWatch);
      let idadeCalculada = hoje.getFullYear() - nascimento.getFullYear();
      const m = hoje.getMonth() - nascimento.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idadeCalculada--;
      }
      setIdade(idadeCalculada >= 0 ? idadeCalculada : null);
    } else {
      setIdade(null);
    }
  }, [dataNascimentoWatch]);

  const onSubmit = (data) => onNext(data);

  return (
    <section className="py-16 bg-white dark:bg-themeDark">
      <ContainerGrid className="flex flex-col items-center justify-center text-center px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-lg bg-white/90 dark:bg-white/5 shadow-xl rounded-2xl p-8 text-left space-y-6 backdrop-blur-md border border-orange/30 dark:border-orangeDark/30"
        >
          <Heading as="h2" text="CHECK-IN" colorClass="dark:text-orangeDark text-orange" />
          <ParagraphBlue>Para começar, informe seus dados pessoais.</ParagraphBlue>
          
          {/* NOME MODIFICADO COM BOTÃO DE LIMPAR */}
          <div>
            <label htmlFor='nome' className="block mb-1 text-sm font-semibold text-orange">Nome completo:</label>
            <div className="relative w-full">
              <input 
                id='nome' 
                type='text' 
                placeholder="nome"
                {...register('dadosPessoalPaciente.nome', { required: 'O nome completo é obrigatório.' })} 
                className={`w-full input-style text-black p-2 pr-20 bg-slate-100 dark:bg-white ${errors.dadosPessoalPaciente?.nome ? 'border-red-500' : 'border-orange'}`} 
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {nomeValue && !activeField && (
                  <button type="button" onClick={() => setValue('dadosPessoalPaciente.nome', '', { shouldFocus: true })} title="Limpar campo">
                    <XCircleIcon className="w-6 h-6 text-zinc-400 hover:text-red-500 transition-colors" />
                  </button>
                )}
                {hasRecognitionSupport && (
                  <button
                      type="button"
                      onClick={() => startListening('dadosPessoalPaciente.nome')}
                      disabled={!!activeField}
                      title="Falar o nome"
                      className={`p-1 rounded-full transition-colors ${activeField === 'dadosPessoalPaciente.nome' ? 'bg-red-500 text-white animate-pulse' : 'text-zinc-500 hover:text-orange'}`}
                  >
                      <MicrophoneIcon className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
            {errors.dadosPessoalPaciente?.nome && <p className="text-red-500 text-xs mt-1">{errors.dadosPessoalPaciente.nome.message}</p>}
          </div>

          {/* RESTANTE DO FORMULÁRIO INTACTO */}
          {/* Data de Nascimento, CPF, etc... */}
          <div>
            <label htmlFor='dataNascimento' className="block mb-1 text-sm font-semibold text-orange">Data de nascimento:</label>
            <input 
              id='dataNascimento' 
              type='date' 
              {...register('dadosPessoalPaciente.dataNascimento', { 
                required: 'A data de nascimento é obrigatória.',
                validate: (value) => new Date().getFullYear() - new Date(value).getFullYear() >= 18 || 'É necessário ter 18 anos ou mais.'
              })} 
              className={`w-full input-style text-black p-2 bg-slate-100 dark:bg-white ${errors.dadosPessoalPaciente?.dataNascimento ? 'border-red-500' : 'border-orange'}`} 
            />
            {idade !== null && <p className="text-sm mt-2 text-slate-600 dark:text-slate-400">Idade: {idade} anos</p>}
            {errors.dadosPessoalPaciente?.dataNascimento && <p className="text-red-500 text-xs mt-1">{errors.dadosPessoalPaciente.dataNascimento.message}</p>}
          </div>

          <div>
            <label htmlFor='cpf' className="block mb-1 text-sm font-semibold text-orange">CPF ou número do SUS:</label>
            <Controller
              name="dadosPessoalPaciente.cpf"
              control={control}
              rules={{ 
                required: 'O CPF é obrigatório.', 
                minLength: { value: 14, message: 'Preencha o CPF completamente.' }
              }}
              render={({ field }) => (
                <IMaskInput
                  placeholder="000.000.000-00"
                  mask="000.000.000-00"
                  id="cpf"
                  value={field.value}
                  onAccept={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  className={`w-full input-style text-black p-2 bg-slate-100 dark:bg-white ${errors.dadosPessoalPaciente?.cpf ? 'border-red-500' : 'border-orange'}`}
                />
              )}
            />
            {errors.dadosPessoalPaciente?.cpf && <p className="text-red-500 text-xs mt-1">{errors.dadosPessoalPaciente.cpf.message}</p>}
          </div>

          <div>
            <label htmlFor='telefone' className="block mb-1 text-sm font-semibold text-orange">Telefone para contato:</label>
            <Controller
                name="dadosPessoalPaciente.telefone"
                control={control}
                rules={{ 
                  required: 'O telefone é obrigatório.', 
                  minLength: { value: 15, message: 'Preencha o telefone completamente.' }
                }}
                render={({ field }) => (
                    <IMaskInput
                        mask="(00) 00000-0000"
                        id='telefone'
                        placeholder='(DDD) 99999-9999'
                        value={field.value}
                        onAccept={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        inputRef={field.ref}
                        className={`w-full input-style text-black p-2 bg-slate-100 dark:bg-white ${errors.dadosPessoalPaciente?.telefone ? 'border-red-500' : 'border-orange'}`}
                    />
                )}
            />
            {errors.dadosPessoalPaciente?.telefone && <p className="text-red-500 text-xs mt-1">{errors.dadosPessoalPaciente.telefone.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-orange">Sexo:</label>
            <div className="flex flex-col gap-2">
              {sexoOptions.map((option) => (
                <label key={option.label} className="flex items-center gap-3 p-3 border-2 border-zinc-300 dark:border-zinc-600 rounded-md cursor-pointer hover:border-orange transition-all has-[:checked]:border-orange has-[:checked]:bg-orange/10">
                  <input 
                    type="radio" 
                    value={option.value}
                    {...register('dadosPessoalPaciente.sexo', { required: 'Por favor, selecione uma opção.' })} 
                    className="accent-orange w-5 h-5" 
                  />
                  <span className="text-base text-black dark:text-white">{option.label}</span>
                </label>
              ))}
            </div>
            {errors.dadosPessoalPaciente?.sexo && <p className="text-red-500 text-xs mt-1">{errors.dadosPessoalPaciente.sexo.message}</p>}
          </div>

          <div>
            <label htmlFor="temConvenio" className="block mb-1 text-sm font-semibold text-orange">Possui convênio?</label>
            <select 
              id="temConvenio" 
              {...register('dadosPessoalPaciente.temConvenio', { required: 'Por favor, informe se possui convênio.' })} 
              className={`w-full input-style text-black p-2 bg-slate-100 dark:bg-white ${errors.dadosPessoalPaciente?.temConvenio ? 'border-red-500' : 'border-orange'}`}
            >
              <option value="">Selecione</option>
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
            {errors.dadosPessoalPaciente?.temConvenio && <p className="text-red-500 text-xs mt-1">{errors.dadosPessoalPaciente.temConvenio.message}</p>}
          </div>

          {temConvenioWatch === "true" && (
            <div className="animate-fade-in">
              <label htmlFor="numConvenio" className="block mb-1 text-sm font-semibold text-orange">Número do convênio:</label>
              <input 
                id="numConvenio" 
                type="text" 
                {...register('dadosPessoalPaciente.numConvenio', { 
                  required: temConvenioWatch === 'true' ? 'O número do convênio é obrigatório.' : false,
                })} 
                className={`w-full input-style text-black p-2 bg-slate-100 dark:bg-white ${errors.dadosPessoalPaciente?.numConvenio ? 'border-red-500' : 'border-orange'}`}
              />
              {errors.dadosPessoalPaciente?.numConvenio && <p className="text-red-500 text-xs mt-1">{errors.dadosPessoalPaciente.numConvenio.message}</p>}
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