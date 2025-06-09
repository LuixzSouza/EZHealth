// ✅ PASSO 2: SUBSTITUA O CONTEÚDO DO SEU ARQUIVO POR ESTE:
// src/components/sections/LoginMedico.jsx

'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { HeadingOrange } from "../theme/HeadingOrange";
import { ContainerGrid } from "../layout/ContainerGrid";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// ✅ O componente agora é a exportação padrão.
export default function LoginMedico() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError(null);

    try {
      // ✅ MUDANÇA: Fazendo a chamada para a nossa nova API de login.
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Falha no login.');
      }
      
      const user = result.data;
      setLoggedInUser(user); // Guarda os dados do usuário para a tela de "Bem-vindo"

      // Salva os dados no localStorage para uso em outras partes do app
      if (user.role === 'admin') {
        localStorage.setItem("adminLogado", JSON.stringify(user));
        setTimeout(() => router.push('/painel-admin'), 1500);
      } else {
        localStorage.setItem("medicoLogado", JSON.stringify(user));
        setTimeout(() => router.push('/painel-medico'), 1500);
      }

    } catch (err) {
      setApiError(err.message);
      setLoading(false);
    }
  };

  // Tela de "Bem-vindo" enquanto redireciona
  if (loading && loggedInUser) {
    return (
      <section className="py-14 flex items-center justify-center h-screen bg-zinc-100 dark:bg-themeDark">
        <ContainerGrid className="max-w-lg text-center flex flex-col items-center gap-6 animate-fade-in bg-white dark:bg-themeDark p-8 rounded-2xl shadow-xl">
          <HeadingOrange text={`Bem-vindo, ${loggedInUser.nome}!`} />
          <Image src={loggedInUser.foto || "/icons/medico-avatar.svg"} alt={loggedInUser.nome} width={150} height={150} className="rounded-full shadow-lg border-4 border-orange animate-pulse" />
          <p className="text-blue-900 dark:text-zinc-200 text-lg font-medium">Redirecionando para o painel...</p>
          <div className="mt-4 border-4 border-orange border-t-transparent rounded-full w-14 h-14 animate-spin"></div>
        </ContainerGrid>
      </section>
    );
  }

  // Formulário de Login Principal
  return (
    <section className="dark:bg-themeDark flex items-center justify-center bg-zinc-100 px-4 min-h-screen">
      <ContainerGrid className="max-w-md bg-white dark:bg-white/10 shadow-xl rounded-2xl p-10 text-center">
        <HeadingOrange text="Acesso Exclusivo" />
        <p className="text-zinc-600 dark:text-zinc-400 mt-2 mb-6">Insira suas credenciais para acessar o painel.</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4 text-black text-lg">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "O email é obrigatório" })}
              className="border-2 border-orange rounded-md p-3 w-full bg-transparent dark:bg-white focus:outline-none focus:ring-2 focus:ring-orange placeholder-zinc-500"
              aria-label="Email"
            />
            {errors.email && <p className="text-red-500 text-xs text-left mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Senha"
              {...register("password", { required: "A senha é obrigatória" })}
              className="border-2 border-orange rounded-md p-3 w-full bg-transparent dark:bg-white focus:outline-none focus:ring-2 focus:ring-orange placeholder-zinc-500"
              aria-label="Senha"
            />
            {errors.password && <p className="text-red-500 text-xs text-left mt-1">{errors.password.message}</p>}
          </div>
          
          {/* ✅ MUDANÇA: Exibe erros da API aqui, em vez de `alert()` */}
          {apiError && <p className="text-red-500 text-sm bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{apiError}</p>}
          
          <button type="submit" className="bg-orange text-white py-3 rounded-lg hover:opacity-90 transition font-semibold" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-sm flex flex-col gap-2">
          <Link href="/esqueci-senha" className="text-orange hover:underline">Esqueceu sua senha?</Link>
        </div>
      </ContainerGrid>
    </section>
  );
}
