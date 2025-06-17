// src/app/esqueci-senha/page.js ou src/pages/esqueci-senha.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Ou 'next/router' para Pages Router
import Image from 'next/image';

import { Header } from '@/components/layout/Header'; // Verifique o caminho correto
import { Heading } from '@/components/typography/Heading'; // Verifique o caminho correto
import { ParagraphBlue } from '@/components/theme/ParagraphBlue'; // Verifique o caminho correto
import { ButtonPrimary } from '@/components/theme/ButtonPrimary'; // Verifique o caminho correto
import { LockClosedIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function EsqueciSenhaPage() {
  const [identifier, setIdentifier] = useState(''); // Pode ser e-mail ou CPF
  const [message, setMessage] = useState(''); // Mensagem de sucesso/erro para o usuário
  const [messageType, setMessageType] = useState(''); // 'success' ou 'error'
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.title = "Esqueci Senha - EZHealth";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(''); // Limpa mensagens anteriores
    setMessageType('');

    // Validação básica
    if (!identifier) {
      setMessage('Por favor, insira seu e-mail ou CPF.');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      // Simulação de chamada de API
      // Em um cenário real, você faria uma requisição POST para seu backend aqui.
      // Ex: const response = await fetch('/api/recuperar-senha', {
      //      method: 'POST',
      //      headers: { 'Content-Type': 'application/json' },
      //      body: JSON.stringify({ identifier }),
      //    });

      // Simula um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Lógica de simulação de resposta da API
      // Em um ambiente real, você verificaria response.ok e a resposta JSON do servidor.
      const isSuccess = Math.random() > 0.3; // 70% de chance de sucesso simulado

      if (isSuccess) {
        setMessage('Se as informações estiverem corretas, você receberá um e-mail com as instruções para redefinir sua senha.');
        setMessageType('success');
        setIdentifier(''); // Limpa o campo após o envio
        // Opcional: redirecionar o usuário após um tempo ou para uma página de confirmação
        // setTimeout(() => router.push('/login-medico'), 5000);
      } else {
        setMessage('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
        setMessageType('error');
      }

    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      setMessage('Não foi possível completar a solicitação. Verifique sua conexão e tente novamente.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-zinc-50 dark:bg-themeDark p-4">
        <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-8 space-y-6 text-center">
          <LockClosedIcon
            className="w-16 h-16 mx-auto mb-4 text-DarkBlue dark:text-zinc-500"
          />
          <Heading
            as="h1"
            text="Esqueceu sua senha?"
            colorClass="text-DarkBlue dark:text-orangeDark"
            className="text-2xl sm:text-3xl"
          />
          <ParagraphBlue className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300">
            Não se preocupe! Informe seu e-mail ou CPF e enviaremos um link para redefinir sua senha.
          </ParagraphBlue>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="identifier" className="sr-only">E-mail ou CPF</label>
              <input
                type="text" // Pode ser 'email' se for só email, mas 'text' para aceitar CPF também
                id="identifier"
                name="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Seu e-mail ou CPF"
                className="block w-full px-4 py-3 border border-zinc-300 rounded-md shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-zinc-700 dark:border-zinc-600 dark:text-white dark:placeholder-zinc-400"
                required
                disabled={loading}
              />
            </div>

            {message && (
              <ParagraphBlue
                className={`text-sm ${messageType === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              >
                {message}
              </ParagraphBlue>
            )}

            <ButtonPrimary
              type="submit"
              className="w-full py-3 text-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </span>
              ) : (
                'Redefinir Senha'
              )}
            </ButtonPrimary>
          </form>

          <div className="mt-6 text-sm">
            <ParagraphBlue className="text-zinc-600 dark:text-zinc-300">
              Lembrou sua senha?{' '}
              <Link href="/login-medico" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Fazer Login
              </Link>
            </ParagraphBlue>
          </div>
        </div>
      </main>
    </>
  );
}