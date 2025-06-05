// app/api/patients.js
import { MongoClient, ObjectId } from 'mongodb'; // Import ObjectId

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ezhealth_db';

let client;
let clientPromisePatients; // Usar um nome diferente para evitar conflitos com outros caches globais

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromisePatients) {
    client = new MongoClient(uri);
    global._mongoClientPromisePatients = client.connect();
  }
  clientPromisePatients = global._mongoClientPromisePatients;
} else {
  client = new MongoClient(uri);
  clientPromisePatients = client.connect();
}

export default async function handler(req, res) {
  try {
    const client = await clientPromisePatients; // Usar o clientPromise específico para pacientes
    const db = client.db(dbName);
    // CORREÇÃO AQUI: Buscar da coleção 'triagens' onde os dados do paciente realmente estão
    const collection = db.collection('triagens'); 

    if (req.method === 'GET') {
      const triagens = await collection.find({}).toArray();
      
      // Mapear os dados das triagens para o formato de paciente esperado pelo frontend
      const formattedPatients = triagens.map(triage => ({
        id: triage._id.toString(), // O ID do paciente é o ID da triagem
        name: triage.dadosPessoalPaciente?.nome || 'Paciente sem nome', // Nome do paciente da triagem
        // Você pode adicionar outros campos aqui se precisar no frontend (ex: cpf, telefone)
        cpf: triage.dadosPessoalPaciente?.cpf || null,
        telefone: triage.dadosPessoalPaciente?.telefone || null,
      }));
      res.status(200).json(formattedPatients);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Erro ao processar a requisição de pacientes:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar pacientes.', error: error.message });
  }
}
