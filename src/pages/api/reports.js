// pages/api/reports.js (VERSÃO REATORADA COM MONGOOSE)

import connectDB from '@/lib/mongodb';
import Triage from '@/model/Triage'; // Usamos o modelo Triage como base para os relatórios

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await connectDB();

    // ANTES: db.collection('triagens').find({})
    // DEPOIS: Usamos Triage.find() e populamos o nome do paciente.
    const triages = await Triage.find({})
      .populate('patientId', 'nome') // A MÁGICA ACONTECE AQUI: busca o nome do paciente relacionado
      .sort({ createdAt: -1 })
      .limit(50);

    // ANTES: Mapeamento acessando 'triagem.dadosPessoalPaciente.nome'
    // DEPOIS: Acessamos 'triagem.patientId.nome', que é mais limpo e garantido pelo populate.
    const reports = triages.map((triagem) => ({
      id: triagem._id.toString(),
      type: 'Relatório de Triagem',
      patient: triagem.patientId?.nome || 'Paciente Desconhecido', // Acesso direto ao nome do paciente
      date: triagem.createdAt
        ? new Date(triagem.createdAt).toISOString().split('T')[0]
        : 'N/A',
      file: `/api/generate-report?id=${triagem._id.toString()}`, // O link para o gerador de PDF continua igual
    }));

    res.status(200).json({ success: true, data: reports });
    
  } catch (error) {
    console.error('Erro em /api/reports:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor', error: error.message });
  }
}
