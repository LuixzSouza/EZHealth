// app/painel-medico/[id]/page.jsx
import React from "react";
import Link from 'next/link'; // Import Link for navigation

// Função que busca a triagem pelo ID
async function getTriagemById(id) {
  try {
    // IMPORTANT: Para um ambiente de produção, use process.env.NEXT_PUBLIC_API_BASE_URL
    // Como você especificou 'http://localhost:3000', vou manter para este exemplo.
    // Em um ambiente real, você faria: `const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/triagem/${id}`, {`
    const res = await fetch(`http://localhost:3000/api/triagem/${id}`, {
      cache: "no-store", // Evita cache para sempre buscar dados atualizados
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Triagem não encontrada.");
      }
      throw new Error(`Erro ao buscar triagem: Status ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Falha ao buscar triagem:", error); // Log o erro completo para depuração
    return null; // Retorna null em caso de erro para o componente lidar
  }
}

export default async function TriagemDetalhePage({ params }) {
  const { id } = params;

  // Renderiza a página de erro para ID inválido
  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-6">
        <div className="bg-white dark:bg-zinc-700 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-500 mb-4">ID Inválido</h2>
          <p className="text-gray-700 dark:text-zinc-200">
            Por favor, forneça um ID de triagem válido na URL (ex:{" "}
            <code className="bg-gray-100 dark:bg-zinc-600 p-1 rounded">
              /painel-medico/&lt;id&gt;
            </code>
            ).
          </p>
        </div>
      </div>
    );
  }

  const triagem = await getTriagemById(id);

  // Renderiza a página de erro se a triagem não for encontrada
  if (!triagem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-6">
        <div className="bg-white dark:bg-zinc-700 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Triagem Não Encontrada
          </h2>
          <p className="text-gray-700 dark:text-zinc-200">
            Não foi possível carregar os detalhes da triagem com o ID{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {id}
            </span>
            . Por favor, verifique o ID e tente novamente.
          </p>
        </div>
      </div>
    );
  }

  // Extrai dados com fallback
  const {
    dadosPessoalPaciente = {},
    classificacaoRisco = {},
    sintomas = {},
    sintomasDetalhes = {},
    sinaisVitais = {},
    historico = {},
    medicamentos = [],
    atendimentoInfo = {},
  } = triagem;

  const pacienteNome = dadosPessoalPaciente.nome || "Não informado";
  const pacienteIdade = dadosPessoalPaciente.idade || "Não informada";
  const pacienteGenero = dadosPessoalPaciente.sexo || "Não informado";

  const classificacao = {
    label: classificacaoRisco.label || "Não Classificado",
    color: classificacaoRisco.color || "gray",
    time: classificacaoRisco.time || "Não informado",
  };

  // Função para formatar sintomas, filtrando `false` e vazios
  const getSintomasDisplay = (sintomasObj, detalhesObj) => {
    const symptomList = [];

    // Adiciona sintomas booleanos que são true
    for (const [key, value] of Object.entries(sintomasObj)) {
      if (typeof value === "boolean" && value === true) {
        // Formata a chave para ser mais legível (ex: 'dorPeito' -> 'Dor no Peito')
        const readableKey = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        symptomList.push(readableKey);
      } else if (typeof value === "string" && value.trim() !== "") {
        symptomList.push(`${key}: ${value}`);
      }
    }

    // Adiciona detalhes de sintomas se existirem e não forem vazios
    if (detalhesObj?.tempoSintomas && detalhesObj.tempoSintomas !== "naoSeAplica") {
      symptomList.push(`Tempo de sintomas: ${detalhesObj.tempoSintomas}`);
    }
    if (detalhesObj?.sintomasOutros && detalhesObj.sintomasOutros.trim() !== "") {
      symptomList.push(`Outros: ${detalhesObj.sintomasOutros}`);
    }

    return symptomList.length > 0
      ? symptomList.join(" | ") // Usar um separador mais claro
      : "Nenhum sintoma relevante registrado.";
  };

  const sintomasTexto = getSintomasDisplay(sintomas, sintomasDetalhes);

  const temperatura = sinaisVitais.temperatura || "-";
  const pressao = sinaisVitais.pressao || "-";
  const frequencia = sinaisVitais.frequencia || "-";
  const saturacao = sinaisVitais.saturacao || "-";

  // Filtra e formata o histórico, mostrando apenas itens que são true ou têm valor
  const historicoArr = [];
  if (historico) {
    for (const [key, value] of Object.entries(historico)) {
      if (typeof value === "boolean" && value === true) {
        const readableKey = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        historicoArr.push(readableKey);
      } else if (typeof value === "string" && value.trim() !== "") {
        historicoArr.push(`${key}: ${value}`);
      }
    }
  }

  const senha = atendimentoInfo.senha || "-";
  const sala = atendimentoInfo.sala || "-";
  const medicoNome = atendimentoInfo.medico?.nome || "Não informado";

  // Mapeamento de cores para a classificação de risco (para estilização direta)
  const riskColorMap = {
    Vermelho: "bg-red-600 text-white",
    Laranja: "bg-orange-600 text-white",
    Amarelo: "bg-yellow-500 text-black", // Amarelo geralmente combina melhor com texto escuro
    Verde: "bg-green-600 text-white",
    Azul: "bg-blue-600 text-white",
    gray: "bg-zinc-400 text-zinc-800", // Usando zinc para dark mode compatível
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 pb-8">
      {/* Header de Navegação */}
      <header className="bg-blue-600 dark:bg-blue-900 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/painel-medico" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
            <span className="font-semibold">Voltar ao Painel</span>
          </Link>
          <span className="text-lg font-bold hidden sm:block">Detalhes da Triagem</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden mt-8">
        {/* Header com Título e Classificação de Risco */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-700 dark:to-red-700 text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 sm:mb-0">
            Detalhes da Triagem
          </h1>
          <div
            className={`inline-flex items-center px-5 py-2 rounded-full text-lg font-bold shadow-md ${
              riskColorMap[classificacao.color] || riskColorMap.gray
            }`}
          >
            {classificacao.label} (Atendimento {classificacao.time})
          </div>
        </div>

        {/* Conteúdo Principal com Seções */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações do Paciente */}
          <InfoCard title="Informações do Paciente">
            <p>
              <strong>Nome:</strong> {pacienteNome}
            </p>
            <p>
              <strong>Idade:</strong> {pacienteIdade}
            </p>
            <p>
              <strong>Gênero:</strong> {pacienteGenero}
            </p>
          </InfoCard>

          {/* Sinais Vitais */}
          <InfoCard title="Sinais Vitais">
            <ul className="list-none space-y-1">
              <li>
                <strong>Temperatura:</strong> {temperatura} °C
              </li>
              <li>
                <strong>Pressão:</strong> {pressao} mmHg
              </li>
              <li>
                <strong>Frequência:</strong> {frequencia} bpm
              </li>
              <li>
                <strong>Saturação:</strong> {saturacao} %
              </li>
            </ul>
          </InfoCard>

          {/* Sintomas Relatados */}
          <InfoCard title="Sintomas Relatados" fullWidth>
            <p className="text-base text-gray-700 dark:text-zinc-300 leading-relaxed">
              {sintomasTexto}
            </p>
          </InfoCard>

          {/* Histórico do Paciente */}
          <InfoCard title="Histórico do Paciente">
            <ul className="list-none space-y-1">
              {historicoArr.length > 0 ? (
                historicoArr.map((item, idx) => <li key={idx}>{item}</li>)
              ) : (
                <li>Nenhum histórico relevante informado.</li>
              )}
            </ul>
          </InfoCard>

          {/* Uso de Medicamentos */}
          <InfoCard title="Uso de Medicamentos">
            <ul className="list-none space-y-1">
              {medicamentos && medicamentos.length > 0 ? (
                medicamentos.map((med, index) => <li key={index}>{med}</li>)
              ) : (
                <li>Nenhum medicamento informado.</li>
              )}
            </ul>
          </InfoCard>

          {/* Informações de Atendimento */}
          <InfoCard title="Informações de Atendimento">
            <ul className="list-none space-y-1">
              <li>
                <strong>Senha:</strong> {senha}
              </li>
              <li>
                <strong>Sala:</strong> {sala}
              </li>
              <li>
                <strong>Médico:</strong> {medicoNome}
              </li>
            </ul>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para padronizar o estilo das informações
function InfoCard({ title, children, fullWidth = false }) {
  return (
    <div
      className={`bg-gray-50 dark:bg-zinc-700 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-600 ${
        fullWidth ? "md:col-span-2" : ""
      }`}
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 mb-3 border-b pb-2 border-gray-200 dark:border-zinc-600">
        {title}
      </h2>
      <div className="text-gray-700 dark:text-zinc-300 text-sm">
        {children}
      </div>
    </div>
  );
}