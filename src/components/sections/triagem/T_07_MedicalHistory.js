'use client';

import { useEffect } from 'react';
import { ParagraphBlue } from '@/components/theme/ParagraphBlue';
import { Heading } from '@/components/typography/Heading';
import { useForm, useWatch } from 'react-hook-form';

export function T_07_MedicalHistory({ onNext, defaultValues }) {

  // ✅ PADRÃO: Extraindo 'errors', 'control' e 'setValue' para funcionalidades avançadas
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    defaultValues,
    mode: 'onBlur',
  });

  // ✅ PADRÃO: Observando campos para lógica condicional
  const historicoWatch = useWatch({ control, name: 'historico' });
  const temAlergias = historicoWatch?.alergias;
  const temOutraCondicao = historicoWatch?.outraCondicao;

  // ✅ PADRÃO: Lógica de exclusividade para "Nenhuma das anteriores"
  useEffect(() => {
    if (!historicoWatch) return;

    const nenhumaSelecionado = historicoWatch.nenhuma;
    const outrasSelecionadas = Object.keys(historicoWatch).some(key => key !== 'nenhuma' && historicoWatch[key]);

    if (nenhumaSelecionado && outrasSelecionadas) {
      // Se "Nenhuma" foi o último a ser marcado, desmarca os outros
      Object.keys(historicoWatch).forEach(key => {
        if (key !== 'nenhuma') {
          setValue(`historico.${key}`, false);
        }
      });
    } else if (outrasSelecionadas && historicoWatch.nenhuma) {
      // Se outro foi marcado, desmarca "Nenhuma"
      setValue('historico.nenhuma', false);
    }
  }, [historicoWatch, setValue]);

  const onSubmit = (data) => {
    onNext(data);
  };

  const historyOptions = [
    { name: 'hipertensao', label: 'Hipertensão' },
    { name: 'diabetes', label: 'Diabetes' },
    { name: 'cardiaco', label: 'Doenças cardíacas' },
    { name: 'respiratorio', label: 'Doenças respiratórias (asma, bronquite, etc.)' },
    { name: 'alergias', label: 'Alergias importantes' },
    { name: 'gravidez', label: 'Gravidez ou suspeita' },
    // ✅ PADRÃO: Adicionado campo "Outra" para flexibilidade
    { name: 'outraCondicao', label: 'Outra condição não listada' },
    { name: 'nenhuma', label: 'Nenhuma das anteriores' },
  ];

  return (
    <section className="py-16 flex items-center justify-center w-full bg-zinc-50 dark:bg-themeDark px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        // ✅ PADRÃO: Estilo de container consistente
        className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 flex flex-col gap-8 w-full max-w-lg"
      >
        <div className="text-center">
          <Heading
            as="h2"
            text="Histórico Médico"
            colorClass="dark:text-orange text-orange"
          />
          <ParagraphBlue className="mt-2">
            Alguma das condições abaixo se aplica a você? Isso nos ajuda a oferecer o melhor cuidado.
          </ParagraphBlue>
        </div>

        {/* ✅ PADRÃO: Validação para garantir que pelo menos uma opção seja marcada */}
        <div className="flex flex-col gap-4" {...register('historico', {
            validate: (value) => Object.values(value || {}).some(v => v) || 'Por favor, selecione ao menos uma opção.'
        })}>
          {historyOptions.map((item) => (
            <div key={item.name}>
              <label
                className="flex items-center gap-4 p-4 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg cursor-pointer transition-all has-[:checked]:border-orange has-[:checked]:bg-orange/10 dark:text-white"
              >
                <input
                  type="checkbox"
                  id={item.name}
                  {...register(`historico.${item.name}`)}
                  className="w-5 h-5 accent-orange"
                />
                <span className="text-base text-zinc-800 dark:text-zinc-200">{item.label}</span>
              </label>

              {/* ✅ PADRÃO: Campos de texto condicionais para detalhes */}
              {item.name === 'alergias' && temAlergias && (
                <div className="mt-2 pl-4 animate-fade-in">
                  <input
                    type="text"
                    {...register('historico.alergiasDetalhe', { required: 'Por favor, especifique suas alergias.' })}
                    placeholder="Quais alergias? (Ex: Penicilina, camarão)"
                    className="w-full border-b-2 border-orange/50 bg-transparent p-2 focus:outline-none focus:border-orange text-black dark:text-white"
                  />
                   {errors.historico?.alergiasDetalhe && <p className="text-red-500 text-xs mt-1">{errors.historico.alergiasDetalhe.message}</p>}
                </div>
              )}

              {item.name === 'outraCondicao' && temOutraCondicao && (
                <div className="mt-2 pl-4 animate-fade-in">
                  <input
                    type="text"
                    {...register('historico.outraCondicaoDetalhe', { required: 'Por favor, especifique a outra condição.' })}
                    placeholder="Qual outra condição?"
                    className="w-full border-b-2 border-orange/50 bg-transparent p-2 focus:outline-none focus:border-orange text-black dark:text-white"
                  />
                   {errors.historico?.outraCondicaoDetalhe && <p className="text-red-500 text-xs mt-1">{errors.historico.outraCondicaoDetalhe.message}</p>}
                </div>
              )}
            </div>
          ))}

          {/* ✅ PADRÃO: Exibição da mensagem de erro principal */}
          {errors.historico && (
            <p className="text-red-500 text-sm text-center -mt-2">
              {errors.historico.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          // ✅ PADRÃO: Estilo do botão consistente
          className="mt-4 bg-orange text-white font-bold py-3 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition text-lg"
        >
          Próximo
        </button>
      </form>
    </section>
  );
}