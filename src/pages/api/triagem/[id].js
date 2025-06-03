// pages/api/triagem/[id].js
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ezhealth_db';

let client;
let clientPromise;

if (!uri) {
  throw new Error('Defina a variável MONGODB_URI no .env.local');
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
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db(dbName);
      const collection = db.collection('triagens');

      // Converte o id para ObjectId e busca no MongoDB
      const triagem = await collection.findOne({ _id: new ObjectId(id) });
      if (!triagem) {
        return res.status(404).json({ message: 'Triagem não encontrada' });
      }
      return res.status(200).json(triagem);
    } catch (err) {
      console.error('Erro ao buscar triagem por ID:', err);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Método ${req.method} não permitido` });
  }
}
