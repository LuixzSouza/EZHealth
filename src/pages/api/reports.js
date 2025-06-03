import { MongoClient } from 'mongodb';

// Configurações da conexão com o MongoDB
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ezhealth_db';

let clientPromise;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromiseReports) {
    const client = new MongoClient(uri);
    global._mongoClientPromiseReports = client.connect();
  }
  clientPromise = global._mongoClientPromiseReports;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const clientConn = await clientPromise;   // << corrigido aqui
    const db = clientConn.db(dbName);
    const collection = db.collection('triagens');

    // Pega até 50 triagens mais recentes para listar como relatórios
    const triagens = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    const reports = triagens.map((triagem) => ({
      id: triagem._id.toString(),
      type: 'Relatório de Triagem',
      patient: triagem.dadosPessoalPaciente?.nome || 'Paciente Desconhecido',
      date: triagem.createdAt
        ? new Date(triagem.createdAt).toISOString().split('T')[0]
        : 'N/A',
      file: `/api/generate-report?id=${triagem._id.toString()}`,
    }));

    res.status(200).json(reports);
  } catch (error) {
    console.error('Erro em /api/reports:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
}
