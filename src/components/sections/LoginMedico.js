'use client';

import { useState } from "react";
import { HeadingOrange } from "../theme/HeadingOrange";
import { ContainerGrid } from "../layout/ContainerGrid";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Lista de médicos com usuário, senha, nome e foto
const medicos = [
  {
    usuario: "joao",
    senha: "1234",
    nome: "Dr. João Silva",
    foto: "/images/doctors/dr_joao_silva.png",
    especialidade: "Clínico Geral"
  },
  {
    usuario: "ana",
    senha: "1234",
    nome: "Dra. Ana Paula",
    foto: "/images/doctors/dra_ana_paula.png",
    especialidade: "Pediatra"
  },
  {
    usuario: "marcos",
    senha: "1234",
    nome: "Dr. Marcos Vinícius",
    foto: "/images/doctors/dr_marcos_vinicius.png",
    especialidade: "Clínico Geral"
  },
  {
    usuario: "camila",
    senha: "1234",
    nome: "Dra. Camila Ribeiro",
    foto: "/images/doctors/dra_camila_ribeiro.png",
    especialidade: "Pediatra"
  },
  {
    usuario: "henrique",
    senha: "1234",
    nome: "Dr. Henrique Souza",
    foto: "/images/doctors/dr_henrique_souza.png",
    especialidade: "Clínico Geral"
  },
];

export default function LoginMedico() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [medicoLogado, setMedicoLogado] = useState(null); // guarda o médico logado
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    const medico = medicos.find(
      (m) => m.usuario === username.toLowerCase() && m.senha === password
    );
    
    if (medico) {
      localStorage.setItem("medicoLogado", JSON.stringify(medico));
      setCarregando(true);
      setMedicoLogado(medico);
      // Enviar para a pagina
      setTimeout(() => router.push('/painel-medico'), 2000);
    } else {
      alert("Usuário ou senha incorretos");
    }
  };

  if (carregando && medicoLogado) {
    return (
      <section className="py-14 flex items-center justify-center px-4 h-screen">
        <ContainerGrid className="max-w-lg text-center flex flex-col items-center gap-6 animate-fade-in">
          <HeadingOrange text={`Bem-vindo, ${medicoLogado.nome}`} />
          <Image
            src={medicoLogado.foto}
            alt={medicoLogado.nome}
            width={120}
            height={120}
            className="rounded-full shadow-md animate-pulse"
          />
          <p className="text-blue-900 dark:text-white text-lg animate-fade-in">
            Redirecionando para o painel médico...
          </p>

          {/* Spinner animado */}
          <div className="mt-4 border-4 border-orange border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
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
          <div className="bg-orange/40 p-4 text-black dark:text-white">
            Teste:<br />
            Usuários: joao, ana, marcos, camila, henrique<br />
            Senha: 1234
          </div>
        </form>
      </ContainerGrid>
    </section>
  );
}
