// pages/api/notifications.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ezhealth_db';
let clientPromise;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromiseNotifications) {
    const client = new MongoClient(uri);
    global._mongoClientPromiseNotifications = client.connect();
  }
  clientPromise = global._mongoClientPromiseNotifications;
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
    const appointmentsColl = db.collection('appointments');
    // const messagesColl = db.collection('messages'); // Removido por não estar no escopo atual

    const now = new Date();
    // Buscar eventos das últimas 24 horas (ou outro período relevante)
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

    let notifications = [];

    // --- Notificações de Novas Triagens Pendentes (últimos 24h) ---
    const newTriages = await triagensColl.find(
      {
        createdAt: { $gte: twentyFourHoursAgo },
        'atendimentoInfo.status': { $ne: 'Finalizado' } // Triagens não finalizadas
      },
      { projection: { _id: 1, 'dadosPessoalPaciente.nome': 1, 'classificacaoRisco.color': 1, createdAt: 1, 'atendimentoInfo.medico.nome': 1 } } // Adicionado atendimentoInfo.medico.nome
    ).sort({ createdAt: -1 }).limit(5).toArray();

    newTriages.forEach(triage => {
      const patientName = triage.dadosPessoalPaciente?.nome || 'Paciente Desconhecido';
      const color = triage.classificacaoRisco?.color;
      const assignedMedico = triage.atendimentoInfo?.medico?.nome; // Nome do médico atribuído
      let icon = "🔔";
      let colorClass = "text-yellow-600"; // Padrão para triagens pendentes

      if (color === 'Vermelho') {
        icon = "🚨";
        colorClass = "text-red-600";
      } else if (color === 'Laranja') {
        icon = "⚠️";
        colorClass = "text-orange-600";
      }

      let notificationText = `Nova triagem pendente: ${patientName}`;
      if (assignedMedico) {
        notificationText += ` (Médico: ${assignedMedico})`;
      }

      notifications.push({
        id: triage._id.toString(),
        type: 'new_triage',
        icon: icon,
        text: notificationText, // Texto com nome do médico
        color: colorClass,
        timestamp: triage.createdAt,
        link: `/painel-medico/${triage._id.toString()}` // Link para detalhes da triagem
      });
    });

    // --- Notificações de Consultas Agendadas para Hoje (Exemplo) ---
    // Ajustado para buscar 'patientName' e 'time' diretamente, se aplicável na sua coleção.
    // Se o nome do paciente estiver dentro de 'dadosPessoalPaciente.nome', ajuste a projeção.
    // Se a consulta também tiver um médico atribuído, pode adicionar aqui.
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const newAppointmentsToday = await appointmentsColl.find(
        {
            // Assumindo que 'date' é string 'YYYY-MM-DD'
            date: { $gte: todayStart.toISOString().split('T')[0], $lt: todayEnd.toISOString().split('T')[0] },
            // Se você tiver um campo `createdAt` para agendamento, pode usar
            // createdAt: { $gte: twentyFourHoursAgo }
        },
        { projection: { _id: 1, 'patientName': 1, 'date': 1, 'time': 1, 'medico.nome': 1 } } // Adicione 'medico.nome' se consultas tiverem
    ).sort({ date: 1, time: 1 }).limit(3).toArray();

    newAppointmentsToday.forEach(appointment => {
        const appointmentTime = appointment.time || 'horário não definido';
        const appointedMedico = appointment.medico?.nome; // Se consultas também tiverem médico

        let notificationText = `Consulta agendada com ${appointment.patientName || 'Paciente'} às ${appointmentTime}`;
        if (appointedMedico) {
          notificationText += ` (Médico: ${appointedMedico})`;
        }

        notifications.push({
            id: appointment._id.toString(),
            type: 'new_appointment',
            icon: "📅",
            text: notificationText,
            color: "text-blue-600",
            timestamp: new Date(appointment.date),
            link: `/painel-medico/consultas/${appointment._id.toString()}`
        });
    });

    // --- Ordenar notificações por timestamp (mais recente primeiro) ---
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Limitar o número total de notificações a serem exibidas
    const MAX_NOTIFICATIONS = 10;
    const finalNotifications = notifications.slice(0, MAX_NOTIFICATIONS);

    return res.status(200).json(finalNotifications);

  } catch (error) {
    console.error('Erro em /api/notifications:', error);
    return res.status(500).json({ message: 'Erro interno no servidor', error: error.message });
  }
}