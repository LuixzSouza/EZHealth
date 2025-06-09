// pages/api/notifications.js (VERSÃO REATORADA COM MONGOOSE)

import connectDB from '@/lib/mongodb';
import Triage from '@/model/Triage';
import Appointment from '@/model/Appointment';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await connectDB();
    let notifications = [];
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

    // --- Notificações de Novas Triagens Pendentes ---
    // ANTES: find com projection e acesso a 'dadosPessoalPaciente.nome'
    // DEPOIS: find com .populate() para buscar os dados do paciente e do médico diretamente
    const newTriages = await Triage.find({
      createdAt: { $gte: twentyFourHoursAgo },
      'atendimentoInfo.status': { $in: ['Aguardando Triagem', 'Aguardando Atendimento', 'Pendente'] }
    })
    .populate('patientId', 'nome') // Popula o nome do paciente
    .populate('atendimentoInfo.medicoId', 'nome') // Popula o nome do médico
    .sort({ createdAt: -1 })
    .limit(5);

    newTriages.forEach(triage => {
      const patientName = triage.patientId?.nome || 'Paciente Desconhecido';
      const assignedMedico = triage.atendimentoInfo.medicoId?.nome;
      const color = triage.classificacao?.color || 'rgba(0, 0, 255, 0.5)'; // Pega a cor diretamente
      
      let icon = "🔔";
      let colorClass = "text-yellow-600";
      
      // Simplificando a lógica de cores
      if (triage.classificacao?.priority === 1) { // Emergência
        icon = "🚨";
        colorClass = "text-red-600";
      } else if (triage.classificacao?.priority === 2) { // Muito Urgente
        icon = "⚠️";
        colorClass = "text-orange-600";
      }
      
      let notificationText = `Nova triagem para ${patientName}`;
      if (assignedMedico) {
        notificationText += ` com Dr(a). ${assignedMedico}`;
      }

      notifications.push({
        id: triage._id.toString(),
        type: 'new_triage',
        icon,
        text: notificationText,
        color: colorClass,
        timestamp: triage.createdAt,
        link: `/painel-medico/triagens/${triage._id.toString()}`
      });
    });

    // --- Notificações de Consultas Agendadas para Hoje ---
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayStart.getDate() + 1);

    // ANTES: find com 'date' como string e projection manual
    // DEPOIS: find com 'date' como ISODate (correto) e .populate()
    const newAppointmentsToday = await Appointment.find({
      date: { $gte: todayStart, $lt: todayEnd },
      status: 'Agendado'
    })
    .populate('patientId', 'nome')
    .populate('doctorId', 'nome')
    .sort({ date: 1 })
    .limit(5);

    newAppointmentsToday.forEach(appointment => {
        const patientName = appointment.patientId?.nome || 'Paciente';
        const doctorName = appointment.doctorId?.nome;
        const appointmentTime = new Date(appointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        let notificationText = `Consulta com ${patientName} às ${appointmentTime}`;
        if (doctorName) {
            notificationText += ` (Dr(a). ${doctorName})`;
        }

        notifications.push({
            id: appointment._id.toString(),
            type: 'new_appointment',
            icon: "📅",
            text: notificationText,
            color: "text-blue-600",
            timestamp: appointment.date,
            link: `/painel-medico/consultas/${appointment._id.toString()}`
        });
    });

    // --- Ordenar e Limitar Notificações ---
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const finalNotifications = notifications.slice(0, 10);

    return res.status(200).json({ success: true, data: finalNotifications });

  } catch (error) {
    console.error('Erro em /api/notifications:', error);
    return res.status(500).json({ success: false, message: 'Erro interno no servidor', error: error.message });
  }
}
