// pages/api/medicos.js

import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ezhealth_db';

let clientPromise;

if (!uri) {
  throw new Error('Por favor defina a variável MONGODB_URI em .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromiseMedicos) {
    const client = new MongoClient(uri);
    global._mongoClientPromiseMedicos = client.connect();
  }
  clientPromise = global._mongoClientPromiseMedicos;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection('medicos');

  if (req.method === 'GET') {
    // Lista todos os médicos
    try {
      const medicos = await collection.find({}).toArray();
      // Converta ObjectId para string na resposta
      const resultados = medicos.map(m => ({
        id: m._id.toString(),
        nome: m.nome,
        especialidade: m.especialidade,
        email: m.email,
        status: m.status,
        foto: m.foto || null, // pode ser undefined ou null
      }));
      return res.status(200).json(resultados);
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
      return res.status(500).json({ mensagem: 'Erro ao buscar médicos.' });
    }
  }

  if (req.method === 'POST') {
    // Adiciona um novo médico
    try {
      const { nome, especialidade, email, status, foto } = req.body;
      if (!nome || !especialidade || !email || !status) {
        return res.status(400).json({ mensagem: 'Dados incompletos.' });
      }
      const novoMedico = { nome, especialidade, email, status, foto: foto || null };
      const result = await collection.insertOne(novoMedico);
      return res.status(201).json({ id: result.insertedId.toString(), ...novoMedico });
    } catch (error) {
      console.error('Erro ao adicionar médico:', error);
      return res.status(500).json({ mensagem: 'Erro ao adicionar médico.' });
    }
  }

  if (req.method === 'PUT') {
    // Edita um médico (espera req.body.id + campos a alterar)
    try {
      const { id, nome, especialidade, email, status, foto } = req.body;
      if (!id) {
        return res.status(400).json({ mensagem: 'ID do médico é obrigatório.' });
      }
      const filtro = { _id: new ObjectId(id) };
      const atualizacao = {
        $set: {
          ...(nome !== undefined && { nome }),
          ...(especialidade !== undefined && { especialidade }),
          ...(email !== undefined && { email }),
          ...(status !== undefined && { status }),
          ...(foto !== undefined && { foto }),
        }
      };
      const result = await collection.updateOne(filtro, atualizacao);
      if (result.matchedCount === 0) {
        return res.status(404).json({ mensagem: 'Médico não encontrado.' });
      }
      return res.status(200).json({ mensagem: 'Médico atualizado.' });
    } catch (error) {
      console.error('Erro ao editar médico:', error);
      return res.status(500).json({ mensagem: 'Erro ao editar médico.' });
    }
  }

  if (req.method === 'DELETE') {
    // Remove um médico (espera ?id=... na query)
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ mensagem: 'ID do médico é obrigatório.' });
      }
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ mensagem: 'Médico não encontrado.' });
      }
      return res.status(200).json({ mensagem: 'Médico removido.' });
    } catch (error) {
      console.error('Erro ao remover médico:', error);
      return res.status(500).json({ mensagem: 'Erro ao remover médico.' });
    }
  }

  res.setHeader('Allow', ['GET','POST','PUT','DELETE']);
  return res.status(405).end(`Método ${req.method} não permitido.`);
}
