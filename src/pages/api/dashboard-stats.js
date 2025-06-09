// pages/api/dashboard-stats.js (VERSÃO REATORADA COM MONGOOSE)

import connectDB from '@/lib/mongodb';
import Patient from '@/model/Patient';
import Appointment from '@/model/Appointment';
import Triage from '@/model/Triage';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await connectDB();

    // --- Consultas em Paralelo para Máxima Eficiência ---
    // Em vez de esperar cada contagem terminar, disparamos todas de uma vez.
    
    // ANTES: pacientesColl.countDocuments({ ativo: true })
    // DEPOIS: Contamos todos os pacientes. Se precisar, adicione um campo 'status' ao modelo Patient.
    const pacientesPromise = Patient.countDocuments();

    // ANTES: Query com data como string 'YYYY-MM-DD'.
    // DEPOIS: Query correta usando ISODate, que é o tipo no nosso modelo.
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    const consultasHojePromise = Appointment.countDocuments({
      date: { $gte: hoje, $lt: amanha }
    });

    // ANTES: Contagem por 'atendimentoInfo.senha': { $exists: false }, que é frágil.
    // DEPOIS: Contagem por status, que é muito mais confiável.
    const triagensPendentesPromise = Triage.countDocuments({
      'atendimentoInfo.status': { $in: ['Aguardando Triagem', 'Pendente', 'Aguardando Sala'] }
    });

    // ANTES: Contagem por 'classificacaoRisco.color': 'Vermelho', que é um rgba().
    // DEPOIS: Contagem por prioridade, que é um número fixo e seguro.
    const alertasCriticosPromise = Triage.countDocuments({
      'classificacao.priority': 1 // Nível 1 = Emergência (Vermelho)
    });

    // Executa todas as promessas de contagem simultaneamente
    const [
      pacientesCount,
      consultasHojeCount,
      triagensPendentesCount,
      alertasCriticosCount
    ] = await Promise.all([
      pacientesPromise,
      consultasHojePromise,
      triagensPendentesPromise,
      alertasCriticosPromise
    ]);

    // Mantemos sua lógica inteligente de valores ilustrativos para desenvolvimento
    const finalStats = {
      pacientesAtivos: pacientesCount > 0 ? pacientesCount : (process.env.NODE_ENV === 'development' ? 50 : 0),
      consultasHoje: consultasHojeCount > 0 ? consultasHojeCount : (process.env.NODE_ENV === 'development' ? 5 : 0),
      triagensPendentes: triagensPendentesCount > 0 ? triagensPendentesCount : (process.env.NODE_ENV === 'development' ? 3 : 0),
      alertasCriticos: alertasCriticosCount > 0 ? alertasCriticosCount : (process.env.NODE_ENV === 'development' ? 1 : 0),
    };

    return res.status(200).json({ success: true, data: finalStats });

  } catch (error) {
    console.error('Erro em /api/dashboard-stats:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor', error: error.message });
  }
}