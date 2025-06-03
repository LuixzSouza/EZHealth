// pages/api/dashboard-stats.js

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ezhealth_db';

let clientPromise;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromiseDashboardStats) {
    const client = new MongoClient(uri);
    global._mongoClientPromiseDashboardStats = client.connect();
  }
  clientPromise = global._mongoClientPromiseDashboardStats;
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

    // Coleções que presumimos existir
    const pacientesColl = db.collection('patients');        // pacientes cadastrados
    const consultasColl = db.collection('appointments');    // consultas agendadas
    const triagensColl = db.collection('triagens');         // triagens feitas

    // 1) Pacientes ativos: contar documentos cuja flag 'ativo' seja true,
    //    ou presumir todos que tenham pelo menos uma triagem/consulta
    const pacientesAtivosCount = await pacientesColl.countDocuments({ ativo: true });

    // 2) Consultas hoje: contar documentos em 'appointments' cuja data seja hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    const consultasHojeCount = await consultasColl.countDocuments({
      date: {
        $gte: hoje.toISOString().split('T')[0],
        $lt: amanha.toISOString().split('T')[0],
      },
    });

    // 3) Triagens pendentes: contar triagens onde classificação ainda não processada
    //    (presumindo triagens sem campo 'atendimentoInfo.senha' ou alguma flag pendente)
    const triagensPendentesCount = await triagensColl.countDocuments({
      'atendimentoInfo.senha': { $exists: false },
    });

    // 4) Alertas críticos: por exemplo triagens classificados como "Vermelho"
    const alertasCriticosCount = await triagensColl.countDocuments({
      'classificacaoRisco.color': 'Vermelho',
    });

    return res.status(200).json({
      pacientesAtivos: pacientesAtivosCount,
      consultasHoje: consultasHojeCount,
      triagensPendentes: triagensPendentesCount,
      alertasCriticos: alertasCriticosCount,
    });
  } catch (error) {
    console.error('Erro em /api/dashboard-stats:', error);
    return res.status(500).json({ message: 'Erro interno no servidor', error: error.message });
  }
}
