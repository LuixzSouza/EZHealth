'use client';

import { useForm } from 'react-hook-form';

export function TSymptomsForm({ onNext }) {
  const { register, handleSubmit } = useForm();

  function onSubmit(vals) {
    onNext(vals);
  }

  return (
    <section className="flex items-center justify-around w-full h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4 w-full max-w-md">
        <h2 className="text-2xl font-bold text-orange">Perguntas Rápidas</h2>

        <div>
          <label className="font-semibold">Está com febre?</label>
          <select {...register('febre')} className="border p-2 w-full">
            <option value="">Escolha...</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </div>

        <div>
          <label className="font-semibold">Dores no corpo?</label>
          <select {...register('dores')} className="border p-2 w-full">
            <option value="">Escolha...</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </div>
        
        <div>
          <label className="font-semibold">Está com Indisposição?</label>
          <select {...register('dores')} className="border p-2 w-full">
            <option value="">Escolha...</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </div>
        
        <div>
          <label className="font-semibold">Está com Azia?</label>
          <select {...register('dores')} className="border p-2 w-full">
            <option value="">Escolha...</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </div>
        
        <div>
          <label className="font-semibold">Perda de Apetite?</label>
          <select {...register('dores')} className="border p-2 w-full">
            <option value="">Escolha...</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </div>
      </form>
    </section>
  );
}
