// pages/api/triagem.js
import { MongoClient, ObjectId } from 'mongodb'; // Import ObjectId

// Configurações da conexão com o MongoDB
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ezhealth_db';

let client;
let clientPromise;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// --- Funções Auxiliares de Backend (Lógica de Negócio Exclusiva do Backend) ---
// Estas funções serão chamadas DENTRO do método POST

// Dados para geração aleatória (APENAS NO BACKEND)
const medicos = [
    { nome: "Dr. João Silva", foto: "/images/doctors/dr_joao_silva.png" },
    { nome: "Dra. Ana Paula", foto: "/images/doctors/dra_ana_paula.png" },
    { nome: "Dr. Marcos Vinícius", foto: "/images/doctors/dr_marcos_vinicius.png" },
    { nome: "Dra. Camila Ribeiro", foto: "/images/doctors/dra_camila_ribeiro.png" },
    { nome: "Dra. Larissa Mendes", foto: "/images/doctors/dra_larissa_mendes.png" },
    { nome: "Dr. Rafael Albuquerque", foto: "/images/doctors/dr_rafael_albuquerque.png" },
    { nome: "Dra. Beatriz Costa", foto: "/images/doctors/dra_beatriz_cota.png" },
    { nome: "Dr. Henrique Souza", foto: "/images/doctors/dr_henrique_souza.png" },
];

const senhas = ["A123", "B456", "C789", "D321", "E654"];
const salas = ["01", "02", "03", "04", "05"];

function gerarDadosAleatoriosAtendimento() {
    return {
        senha: senhas[Math.floor(Math.random() * senhas.length)],
        sala: salas[Math.floor(Math.random() * salas.length)],
        medico: medicos[Math.floor(Math.random() * medicos.length)],
    };
}

// Função para classificar o risco (APENAS NO BACKEND)
function classifyRiskBackend(triagemData) {
  const { sinaisVitais = {}, sintomas = {}, sintomasDetalhes = {}, historico = {} } = triagemData;

  // Função auxiliar para validar e converter número (ou retornar undefined)
  function toNumber(value) {
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  }

  // 1. Extrair e validar sinais vitais
  const temperatura = toNumber(sinaisVitais.temperatura);
  // Para pressão, só converte se tiver exatamente "X/Y" e ambos forem numéricos
  let pressaoSistolica, pressaoDiastolica;
  if (typeof sinaisVitais.pressao === "string" && sinaisVitais.pressao.includes("/")) {
    const [sist, diast] = sinaisVitais.pressao.split("/");
    const ps = toNumber(sist);
    const pd = toNumber(diast);
    if (ps !== undefined && pd !== undefined) {
      pressaoSistolica = ps;
      pressaoDiastolica = pd;
    }
  }
  // Caso não tenha formato válido, ficam undefined e não entram nas comparações
  const frequencia = toNumber(sinaisVitais.frequencia);
  const saturacao = toNumber(sinaisVitais.saturacao);

  // 2. Inicializa nível padrão (Azul: não urgente)
  let riskLevel = {
    color: "Azul",
    label: "Não Urgente",
    time: "até 4 horas",
    priority: 5
  };

  // 3. VERIFICAÇÕES DE “VERMELHO” (Emergência, prioridade 1)
  //  - saturação < 90%
  //  - frequência cardíaca > 130 bpm
  //  - pressão arterial sistólica ≥ 180 ou diastólica ≥ 110
  //  - dor no peito ou falta de ar
  if (
    (saturacao !== undefined && saturacao < 90) ||
    (frequencia  !== undefined && frequencia  > 130) ||
    (pressaoSistolica !== undefined && pressaoSistolica >= 180) ||
    (pressaoDiastolica !== undefined && pressaoDiastolica >= 110) ||
    (sintomas.dorPeito === true) ||
    (sintomas.faltaAr === true)
  ) {
    return { color: "Vermelho", label: "Emergência", time: "imediato", priority: 1 };
  }

  // 4. VERIFICAÇÕES DE “LARANJA” (Muito urgente, prioridade 2)
  //  - temperatura ≥ 39 °C (sinal de febre alta)
  //  - frequência entre 100 e 130 bpm (se maior que 100 mas ≤ 130)
  //  - tontura com menos de 24h (sintomasDetalhes.tempoSintomas === "menos24h")
  //  - náusea/vômito nas últimas 24h (sintomas.nauseaVomito === true && tempoSintomas === "menos24h")
  if (
    (temperatura !== undefined && temperatura >= 39) ||
    (frequencia  !== undefined && frequencia  > 100 && frequencia <= 130) ||
    (sintomas.tontura === true && sintomasDetalhes.tempoSintomas === "menos24h") ||
    (sintomas.nauseaVomito === true && sintomasDetalhes.tempoSintomas === "menos24h")
  ) {
    return { color: "Laranja", label: "Muito Urgente", time: "até 10 minutos", priority: 2 };
  }

  // 5. VERIFICAÇÕES DE “AMARELO” (Urgente, prioridade 3)
  //  - febre moderada (≥ 38,5 °C e < 39 °C)
  //  - dor de cabeça intensa (sintomas.dorCabeca === true)
  //  - histórico de comorbidades relevantes (hipertensão, diabetes, cardiaco, respiratorio)
  if (
    (temperatura !== undefined && temperatura >= 38.5 && temperatura < 39) ||
    (sintomas.febre === true) ||
    (sintomas.dorCabeca === true) ||
    (historico.hipertensao === true) ||
    (historico.diabetes === true) ||
    (historico.cardiaco === true) ||
    (historico.respiratorio === true)
  ) {
    return { color: "Amarelo", label: "Urgente", time: "até 60 minutos", priority: 3 };
  }

  // 6. VERIFICAÇÕES DE “VERDE” (Pouco urgente, prioridade 4)
  //  - tosse leve sem comorbidades ou dor leve, com tempo de sintomas entre 1 e 3 dias
  if (
    (sintomas.tosse === true && sintomasDetalhes.tempoSintomas === "1a3dias") ||
    // Exemplo adicional: dor de garganta ou mal-estar leve pode entrar aqui
    (sintomas.outros && sintomas.outros.trim() !== "")
  ) {
    return { color: "Verde", label: "Pouco Urgente", time: "até 2 horas", priority: 4 };
  }

  // 7. SE NENHUMA DAS CONDIÇÕES ASIMA FOI ATENDIDA → “AZUL” (Não urgente, prioridade 5)
  return riskLevel;
}

// --- Manipulador da API ---

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection('triagens'); // Nome da sua coleção

    if (req.method === 'POST') {
      const dataBrutaDoFrontend = req.body;

      // 1. Executa a lógica de classificação de risco (APENAS NO BACKEND)
      const classificacao = classifyRiskBackend(dataBrutaDoFrontend);

      // 2. Executa a lógica de geração de dados de atendimento (APENAS NO BACKEND)
      const infoAtendimento = gerarDadosAleatoriosAtendimento();

      // 3. Combina todos os dados antes de salvar no MongoDB
      const triagemFinalParaSalvar = {
        ...dataBrutaDoFrontend, // Dados brutos do frontend
        classificacaoRisco: classificacao, // Classificação gerada no backend
        atendimentoInfo: { // Informações de atendimento geradas no backend
            // Preserve existing atendimentoInfo if present, then add/overwrite generated ones
            ...dataBrutaDoFrontend.atendimentoInfo,
            senha: infoAtendimento.senha,
            sala: infoAtendimento.sala,
            medico: infoAtendimento.medico,
            status: dataBrutaDoFrontend.atendimentoInfo?.status || "Pendente" // Ensure status is set
        },
        createdAt: new Date(), // Timestamp de criação
      };

      const result = await collection.insertOne(triagemFinalParaSalvar);

      res.status(201).json({
        message: 'Triagem salva e processada com sucesso!',
        id: result.insertedId,
        triagemCompleta: triagemFinalParaSalvar
      });

    } else if (req.method === 'GET') {
      const triagens = await collection.find({}).toArray();
      res.status(200).json(triagens);

    } else if (req.method === 'PUT') {
      // Logic for updating an existing triage record
      const { id, dadosPessoalPaciente, atendimentoInfo } = req.body;

      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid or missing triage ID for update.' });
      }

      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          "dadosPessoalPaciente.nome": dadosPessoalPaciente?.nome,
          "dadosPessoalPaciente.dataNascimento": dadosPessoalPaciente?.dataNascimento,
          "dadosPessoalPaciente.idade": dadosPessoalPaciente?.idade,
          "dadosPessoalPaciente.cpf": dadosPessoalPaciente?.cpf,
          "dadosPessoalPaciente.telefone": dadosPessoalPaciente?.telefone,
          "dadosPessoalPaciente.sexo": dadosPessoalPaciente?.sexo,
          "dadosPessoalPaciente.temConvenio": dadosPessoalPaciente?.temConvenio,
          "atendimentoInfo.status": atendimentoInfo?.status,
          // Add other specific fields from triage you want to allow updating here
        },
      };

      const result = await collection.updateOne(filter, updateDoc);

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Triage not found.' });
      }
      res.status(200).json({ message: 'Triage updated successfully.' });

    } else if (req.method === 'DELETE') {
      // Logic for deleting a triage record
      const { id } = req.query; // ID comes from query parameter for DELETE

      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid or missing triage ID for deletion.' });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Triage not found.' });
      }
      res.status(200).json({ message: 'Triage deleted successfully.' });

    } else {
      res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Erro ao processar a requisição:', error);
    res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
}

// Remove or rename app/api/patients.js if not used
// For now, it's fine to keep it if it serves another purpose,
// but it's not directly related to the UsuariosAdminTab's current functionality.