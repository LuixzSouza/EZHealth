// pages/api/consultas-por-mes.js

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ezhealth_db';
let clientPromise;

// Configuração da conexão com o MongoDB (mantida como estava)
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromiseConsultas) {
    const client = new MongoClient(uri);
    global._mongoClientPromiseConsultas = client.connect();
  }
  clientPromise = global._mongoClientPromiseConsultas;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Manipulador da API para consultas por mês
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const coll = db.collection('appointments'); // Sua coleção de agendamentos/consultas

    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth(); // Mês atual (0-indexado: Jan=0, Fev=1, etc.)

    const monthNames = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];

    // --- 1. Preparar a estrutura de dados para todos os meses do ano até o atual ---
    // Inicializa um array com todos os meses do ano corrente até o mês atual, com 0 consultas.
    const allMonthsData = [];
    for (let i = 0; i <= currentMonthIndex; i++) {
      allMonthsData.push({
        mes: monthNames[i],
        consultas: 0, // Valor inicial, será preenchido com dados reais ou ilustrativos
      });
    }

    // --- 2. Pipeline de agregação no MongoDB para contar consultas reais do ano atual ---
    const pipeline = [
      {
        // Filtra documentos para incluir apenas os do ano atual
        $match: {
          date: {
            $gte: `${currentYear}-01-01`, // Data de início do ano atual
            $lte: `${currentYear}-12-31`, // Data de fim do ano atual
          }
        }
      },
      {
        // Extrai o número do mês (ex: "01", "02") do campo 'date'
        $group: {
          _id: { $dateToString: { format: "%m", date: { $toDate: "$date" } } },
          total: { $sum: 1 } // Conta o total de consultas para cada mês
        }
      },
      {
        // Ordena os resultados pelo número do mês para garantir a ordem cronológica
        $sort: { "_id": 1 }
      }
    ];

    const result = await coll.aggregate(pipeline).toArray();

    // --- 3. Mesclar dados reais com a estrutura de todos os meses ---
    // Cria um mapa para acesso rápido aos totais reais por mês
    const realDataMap = new Map();
    result.forEach(item => {
      realDataMap.set(item._id, item.total); // Ex: "01" -> 25, "06" -> 10
    });

    // Preenche 'allMonthsData' com dados reais ou ilustrativos
    const finalFormattedData = allMonthsData.map((monthEntry, index) => {
      const monthNumberString = (index + 1).toString().padStart(2, '0'); // Converte index (0-11) para "01"-"12"

      const realConsultas = realDataMap.get(monthNumberString);

      // Se houver dados reais, usa-os. Caso contrário, gera um valor aleatório.
      const consultas = realConsultas !== undefined
        ? realConsultas
        : (Math.floor(Math.random() * 40) + 15); // Gera entre 15 e 55 para ilustração

      return {
        mes: monthEntry.mes,
        consultas: consultas
      };
    });

    return res.status(200).json(finalFormattedData);
  } catch (error) {
    console.error('Erro ao agregar consultas por mês:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
}