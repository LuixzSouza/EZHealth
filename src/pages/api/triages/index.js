// ✅ SUBSTITUA O CONTEÚDO DO SEU ARQUIVO POR ESTE:
// pages/api/triages/index.js

import connectDB from '@/lib/mongodb';
// ✅ CORREÇÃO: O caminho agora aponta para a pasta 'model' (singular),
// que corresponde à estrutura do seu projeto.
import Triage from '@/model/Triage';

export default async function handler(req, res) {
  await connectDB();
  
  if (req.method === 'GET') {
    try {
      const { patientId } = req.query;
      let query = {};
      
      if (patientId) {
        query.patientId = patientId;
      }

      const triages = await Triage.find(query)
                                    .sort({ createdAt: -1 })
                                    .populate('patientId', 'nome')
                                    .populate('atendimentoInfo.medicoId', 'nome');
      
      res.status(200).json({ success: true, data: triages });
    } catch (error) {
      // Adicionado log para ver o erro detalhado no terminal do servidor
      console.error("ERRO na API /api/triages:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}