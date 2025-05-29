'use client';

import { useState } from "react";
import { HeadingOrange } from "../theme/HeadingOrange";
import { ContainerGrid } from "../layout/ContainerGrid";
import { useRouter } from 'next/navigation'

export default function LoginMedico() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulação de login simples
    if (username === "medico" && password === "1234") {
      setIsLoggedIn(true);
      router.push('/painel-medico');
    } else {
      alert("Usuário ou senha incorretos");
    }
  };

  if (isLoggedIn) {
    return (
      <section className="py-14">
        <ContainerGrid>
          <HeadingOrange text={`Bem-vindo, Dr. ${username}`} />
          <p className="text-blue-900 text-lg mt-4">Você acessou o painel médico com sucesso.</p>
          {/* Aqui pode incluir os cards, botões e funcionalidades do médico */}
        </ContainerGrid>
      </section>
    );
  }

  return (
    <section className="dark:bg-themeDark h-screen flex items-center justify-center bg-gray-100 px-4">
      <ContainerGrid className="max-w-md bg-white dark:bg-themeDark shadow-xl rounded-2xl p-10 text-center shadow-black/10 dark:shadow-white/10">
        <HeadingOrange text="Login Médico" />
        <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4 text-black text-lg">
            <input
                type="text"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-2 border-orange rounded-md p-2 w-full bg-transparent dark:bg-white focus:outline-none focus:ring-2 focus:ring-orange"
                required
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-orange rounded-md p-2 w-full bg-transparent dark:bg-white focus:outline-none focus:ring-2 focus:ring-orange"
                required
            />
            <button type="submit" className="bg-orange text-white py-2 rounded-lg hover:opacity-90">
                Entrar
            </button>
            <div className="bg-orange/40 p-4 text-black dark:text-white" >
                Teste <br/>
                Usuario: medico <br/>
                Senha: 1234
            </div>
        </form>
      </ContainerGrid>
    </section>
  );
}
