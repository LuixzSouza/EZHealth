// components/configuracoes/ChangePasswordForm.jsx
'use client';

import { useState } from 'react';
import { ButtonPrimary } from "@/components/theme/ButtonPrimary";
import { Heading } from "@/components/typography/Heading";
import { ParagraphBlue } from "@/components/theme/ParagraphBlue";

export function ChangePasswordForm({ onBack }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validações básicas
      if (newPassword !== confirmNewPassword) {
        throw new Error("A nova senha e a confirmação não coincidem.");
      }
      if (newPassword.length < 8) {
        throw new Error("A nova senha deve ter pelo menos 8 caracteres.");
      }

      // Simulação de chamada de API para alterar senha
      console.log('Tentando alterar senha...');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula atraso da rede

      // Suponha que a API valida a senha atual e altera
      // Em um app real, você enviaria { currentPassword, newPassword } para seu backend
      // e o backend validaria currentPassword antes de salvar newPassword.
      setSuccess(true);
      alert('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      // onBack(); // Opcional: voltar para a tela de configurações após sucesso
    } catch (err) {
      console.error('Erro ao alterar senha:', err);
      setError(err.message || 'Não foi possível alterar a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-white/10 p-6 rounded-lg shadow-md mt-4">
      <Heading
        as="h3"
        text="Alterar Senha"
        colorClass="dark:text-orangeDark text-orange"
        className="mb-4 text-xl sm:text-2xl"
      />
      <ParagraphBlue className="mb-6 text-sm sm:text-base">
        Por favor, insira sua senha atual e a nova senha.
      </ParagraphBlue>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-blue-800 dark:text-white mb-1">
            Senha Atual
          </label>
          <input
            type="password"
            id="currentPassword"
            className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-blue-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-blue-800 dark:text-white mb-1">
            Nova Senha
          </label>
          <input
            type="password"
            id="newPassword"
            className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-blue-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-blue-800 dark:text-white mb-1">
            Confirmar Nova Senha
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-blue-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        )}
        {success && (
          <p className="text-green-600 dark:text-green-400 text-sm">Senha alterada com sucesso!</p>
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
            {loading ? 'Salvando...' : 'Alterar Senha'}
          </ButtonPrimary>
        </div>
      </form>
    </div>
  );
}