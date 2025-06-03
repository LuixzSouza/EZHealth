// pages/api/agenda.js
import { MongoClient } from 'mongodb';

// --- Configuração da Conexão com o Banco de Dados ---
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ezhealth_db';

let client;
let clientPromise;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromiseAgenda) {
    client = new MongoClient(uri);
    global._mongoClientPromiseAgenda = client.connect();
  }
  clientPromise = global._mongoClientPromiseAgenda;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// --- Manipulador da API ---
export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection('appointments'); // Coleção de consultas

    if (req.method === 'GET') {
      const { medicoNome } = req.query; // <-- NOVIDADE AQUI: Pega o nome do médico da query string

      let query = {};
      if (medicoNome) {
        // Se medicoNome for fornecido, filtre as consultas por esse médico.
        // ASSUMIR: que seus documentos de consulta têm um campo 'medico.nome'
        // ou 'doctorName' ou similar.
        query['medico.nome'] = medicoNome; // Filtra por 'medico.nome'
        // Ou se fosse um campo direto: query.doctorName = medicoNome;
      }
      
      const appointments = await collection.find(query).sort({ date: 1, time: 1 }).toArray();
      res.status(200).json(appointments);

    } else if (req.method === 'POST') {
      const newAppointment = req.body;
      newAppointment.createdAt = new Date(); 

      const result = await collection.insertOne(newAppointment);
      res.status(201).json({ message: 'Consulta adicionada com sucesso!', id: result.insertedId });
    }
    // Adicione outros métodos (PUT, DELETE) conforme necessário
    else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Erro em /api/agenda:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
}