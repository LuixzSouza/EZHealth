// components/configuracoes/EditProfileForm.jsx
'use client';

import { useState } from 'react';
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";

export function EditProfileForm({ onBack }) {
  // Simule os dados atuais do usuário (em um app real viriam do backend)
  const [name, setName] = useState('Nome do Usuário Atual');
  const [email, setEmail] = useState('usuario.atual@exemplo.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Simulação de chamada de API para atualizar perfil
      // Em um app real, você faria um fetch/axios para o seu backend
      console.log('Tentando atualizar perfil:', { name, email });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula atraso da rede

      if (name === "" || email === "") { // Exemplo de validação simples
        throw new Error("Nome e E-mail não podem ser vazios.");
      }

      // Suponha que a API retorna sucesso
      setSuccess(true);
      alert('Perfil atualizado com sucesso!');
      // onBack(); // Opcional: voltar para a tela de configurações após sucesso
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError(err.message || 'Não foi possível atualizar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-white/10 p-6 rounded-lg shadow-md mt-4">
      <Heading
        as="h3"
        text="Editar Perfil"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-4 text-xl sm:text-2xl"
      />
      <ParagraphBlue className="mb-6 text-sm sm:text-base">
        Atualize suas informações pessoais.
      </ParagraphBlue>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="profileName" className="block text-sm font-medium text-blue-800 dark:text-white mb-1">
            Nome Completo
          </label>
          <input
            type="text"
            id="profileName"
            className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-blue-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div>
          <label htmlFor="profileEmail" className="block text-sm font-medium text-blue-800 dark:text-white mb-1">
            E-mail
          </label>
          <input
            type="email"
            id="profileEmail"
            className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-blue-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        )}
        {success && (
          <p className="text-green-600 dark:text-green-400 text-sm">Perfil atualizado com sucesso!</p>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <ButtonPrimary
            type="button"
            onClick={onBack}
            disabled={loading}
            className="bg-neutral-500 hover:bg-neutral-600 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white w-full sm:w-auto"
          >
            Voltar
          </ButtonPrimary>
          <ButtonPrimary
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </ButtonPrimary>
        </div>
      </form>
    </div>
  );
}