// app/api/patients.js
import { MongoClient } from 'mongodb';

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

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection('patients'); // Ensure this matches your MongoDB collection name

    if (req.method === 'GET') {
      const patients = await collection.find({}).toArray();
      res.status(200).json(patients);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Erro ao processar a requisição de pacientes:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar pacientes.', error: error.message });
  }
}