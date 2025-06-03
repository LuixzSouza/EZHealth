import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ezhealth_db';
let clientPromise;

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

// Agrupa por mês do campo "date" de agenda
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const coll = db.collection('appointments');

    // Pipeline de agregação no MongoDB para contar quantas consultas por mês
    const pipeline = [
      {
        $group: {
          _id: { $dateToString: { format: "%m", date: { $toDate: "$date" } } },
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ];
    const result = await coll.aggregate(pipeline).toArray();

    // Converter "_id" (string "MM") para nome do mês abreviado
    const mesesMapa = {
      "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr",
      "05": "Mai", "06": "Jun", "07": "Jul", "08": "Ago",
      "09": "Set", "10": "Out", "11": "Nov", "12": "Dez"
    };

    const formatado = result.map(item => ({
      mes: mesesMapa[item._id] || item._id,
      consultas: item.total
    }));

    return res.status(200).json(formatado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao agregar consultas por mês.' });
  }
}
