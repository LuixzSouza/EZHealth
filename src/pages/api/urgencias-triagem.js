import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ezhealth_db';
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromiseUrgencias) {
    const client = new MongoClient(uri);
    global._mongoClientPromiseUrgencias = client.connect();
  }
  clientPromise = global._mongoClientPromiseUrgencias;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const coll = db.collection('triagens');

    // Agrupa por classificação de risco.color
    const pipeline = [
      {
        $group: {
          _id: "$classificacaoRisco.color",
          valor: { $sum: 1 }
        }
      }
    ];
    const result = await coll.aggregate(pipeline).toArray();

    // Mapeia cores inesperadas para “Baixa” ou “Média” ou “Alta” se necessário,
    // mas vamos retornar exatamente o `_id` obtido (ex.: "Vermelho", "Amarelo", "Verde")
    const formatado = result.map(item => ({
      tipo: item._id || "N/A",
      valor: item.valor
    }));

    return res.status(200).json(formatado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao agregar urgências de triagem.' });
  }
}
