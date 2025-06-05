'use client';

import { useState } from "react";
import { HeadingOrange } from "../theme/HeadingOrange";
import { ContainerGrid } from "../layout/ContainerGrid";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link'; // Import Link for navigation

// Lista de médicos com usuário, senha, nome e foto
const medicos = [
  {
    usuario: "joao",
    senha: "4321",
    nome: "Dr. João Silva",
    foto: "/images/doctors/dr_joao_silva.png",
    especialidade: "Clínico Geral"
  },
  {
    usuario: "ana",
    senha: "4321",
    nome: "Dra. Ana Paula",
    foto: "/images/doctors/dra_ana_paula.png",
    especialidade: "Pediatra"
  },
  {
    usuario: "marcos",
    senha: "4321",
    nome: "Dr. Marcos Vinícius",
    foto: "/images/doctors/dr_marcos_vinicius.png",
    especialidade: "Clínico General"
  },
  {
    usuario: "camila",
    senha: "4321",
    nome: "Dra. Camila Ribeiro",
    foto: "/images/doctors/dra_camila_ribeiro.png",
    especialidade: "Pediatra"
  },
  {
    usuario: "henrique",
    senha: "4321",
    nome: "Dr. Henrique Souza",
    foto: "/images/doctors/dr_henrique_souza.png",
    especialidade: "Clínico Geral"
  },
];

export default function LoginMedico() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userLoggedIn, setUserLoggedIn] = useState(null); // Changed to a more generic name
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setCarregando(true); // Start loading immediately

    // Special check for the administrator
    if (username.toLowerCase() === 'admin' && password === '4321') {
      const admin = {
        nome: "Administrador",
        usuario: "admin",
        role: "admin",
        foto: "/icons/admin-avatar.png" // Added a default photo for admin loading screen
      };
      localStorage.setItem("adminLogado", JSON.stringify(admin));
      setUserLoggedIn(admin); // Set admin as logged in user
      setTimeout(() => router.push('/painel-admin'), 1500);
      return;
    }

    const medico = medicos.find(
      (m) => m.usuario === username.toLowerCase() && m.senha === password
    );

    if (medico) {
      localStorage.setItem("medicoLogado", JSON.stringify(medico));
      setUserLoggedIn(medico); // Set medico as logged in user
      setTimeout(() => router.push('/painel-medico'), 2000);
    } else {
      setCarregando(false); // Stop loading on error
      alert("Usuário ou senha incorretos");
    }
  };

  // Check if a user (doctor or admin) is being loaded
  if (carregando && userLoggedIn) {
    return (
      <section className="py-14 flex items-center justify-center px-4 h-screen bg-zinc-100 dark:bg-themeDark">
        <ContainerGrid className="max-w-lg text-center flex flex-col items-center gap-6 animate-fade-in bg-white dark:bg-themeDark p-8 rounded-2xl shadow-xl">
          <HeadingOrange text={`Bem-vindo, ${userLoggedIn.nome}!`} />
          <Image
            src={userLoggedIn.foto} // Use the photo from the logged-in user object
            alt={userLoggedIn.nome}
            width={150}
            height={150}
            className="rounded-full shadow-lg border-4 border-orange animate-pulse"
          />
          <p className="text-blue-900 dark:text-zinc-200 text-lg font-medium animate-fade-in">
            Redirecionando você para o painel {userLoggedIn.role === 'admin' ? 'administrativo' : 'médico'}. Por favor, aguarde...
          </p>

          {/* Spinner animado */}
          <div className="mt-4 border-4 border-orange border-t-transparent rounded-full w-14 h-14 animate-spin"></div>
        </ContainerGrid>
      </section>
    );
  }

  return (
    <section className="dark:bg-themeDark flex items-center justify-center bg-zinc-100 px-4 min-h-screen">
      <ContainerGrid className="max-w-md bg-white dark:bg-white/10 shadow-xl rounded-2xl p-10 text-center shadow-black/10 dark:shadow-white/10">
        <HeadingOrange text="Acesso Exclusivo para Médicos" />
        <p className="text-zinc-600 dark:text-zinc-400 mt-2 mb-6">
          Por favor, insira suas credenciais para acessar o painel.
        </p>
        <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4 text-black text-lg">
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-orange rounded-md p-3 w-full bg-transparent dark:bg-white focus:outline-none focus:ring-2 focus:ring-orange placeholder-zinc-500"
            required
            aria-label="Usuário"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-orange rounded-md p-3 w-full bg-transparent dark:bg-white focus:outline-none focus:ring-2 focus:ring-orange placeholder-zinc-500"
            required
            aria-label="Senha"
          />
          <button
            type="submit"
            className="bg-orange text-white py-3 rounded-lg hover:opacity-90 transition duration-300 ease-in-out font-semibold"
            disabled={carregando} // Disable button while loading
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

          {/* Seção de Informações para Teste - Melhorada */}
          <div className="mt-6 p-5 bg-orange/80 dark:bg-orange/30 border border-orange dark:border-orange rounded-lg text-sm text-white">
            <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Modo de Teste
            </h3>
            <p className="mb-2">
              Para fins de demonstração, você pode usar as seguintes credenciais:
            </p>
            <ul className="list-disc list-inside text-left">
              <li>
                <span className="font-medium">Usuários (Médicos):</span> joao, ana, marcos, camila, henrique
              </li>
              <li>
                <span className="font-medium">Usuário (Administrador):</span> admin
              </li>
              <li>
                <span className="font-medium">Senha para todos:</span> 1234
              </li>
            </ul>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 italic">
              * O acesso de teste não inclui todas as funcionalidades da versão completa.
            </p>
          </div>

          {/* Links adicionais */}
          <div className="mt-6 text-sm flex flex-col gap-2">
            <Link href="/esqueci-senha" className="text-orange hover:underline">
              Esqueceu sua senha?
            </Link>
            <div className="flex flex-col items-center justify-center gap-10 lg:flex-row" >
              <Link href="/termos-de-uso" className="text-blue-700 dark:text-blue-300 hover:underline">
                Termos de Uso
              </Link>
              <Link href="/politica-de-privacidade" className="text-blue-700 dark:text-blue-300 hover:underline">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </form>
      </ContainerGrid>
    </section>
  );
}