// pages/api/urgencias-triagem.js

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ezhealth_db';

let clientPromise;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

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
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const triagensColl = db.collection('triagens');

    // Mapeamento das cores e valores ilustrativos padrão (se não houver dados)
    const defaultUrgencias = {
      'Vermelho': { tipo: 'Vermelho', valor: 0 }, // Ou 15 para ilustração
      'Laranja': { tipo: 'Laranja', valor: 0 },   // Ou 30 para ilustração
      'Amarelo': { tipo: 'Amarelo', valor: 0 },   // Ou 45 para ilustração
      'Verde': { tipo: 'Verde', valor: 0 },     // Ou 60 para ilustração
      'Azul': { tipo: 'Azul', valor: 0 },       // Ou 20 para ilustração
    };

    // Agrega os dados existentes no banco
    const pipeline = [
      {
        $group: {
          _id: "$classificacaoRisco.color",
          valor: { $sum: 1 }
        }
      }
    ];
    const result = await triagensColl.aggregate(pipeline).toArray();

    // Atualiza os valores padrão com os dados reais do banco de dados
    result.forEach(item => {
      if (defaultUrgencias[item._id]) {
        defaultUrgencias[item._id].valor = item.valor;
      }
    });

    // Converte o objeto de volta para um array na ordem desejada
    const finalData = [
      defaultUrgencias['Vermelho'],
      defaultUrgencias['Laranja'],
      defaultUrgencias['Amarelo'],
      defaultUrgencias['Verde'],
      defaultUrgencias['Azul'],
    ].filter(item => item.valor > 0 || (process.env.NODE_ENV === 'development' && item.valor === 0)); // Filtra apenas se tiver valor, ou mantém todos em dev para ilustração

    // Se quiser manter os valores ilustrativos quando a contagem for 0, altere as linhas acima
    // Ou, para valores sempre ilustrativos em dev:
    if (process.env.NODE_ENV === 'development' && finalData.every(item => item.valor === 0)) {
        finalData[0].valor = 15; // Vermelho
        finalData[1].valor = 30; // Laranja
        finalData[2].valor = 45; // Amarelo
        finalData[3].valor = 60; // Verde
        finalData[4].valor = 20; // Azul
    }


    return res.status(200).json(finalData);
  } catch (error) {
    console.error('Erro em /api/urgencias-triagem:', error);
    return res.status(500).json({ message: 'Erro interno no servidor', error: error.message });
  }
}