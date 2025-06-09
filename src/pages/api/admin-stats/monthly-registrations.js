// ✅ Substitua o conteúdo do seu arquivo por este:
// pages/api/admin-stats/monthly-registrations.js (VERSÃO COM O CAMINHO CORRIGIDO)

import connectDB from '@/lib/mongodb';
// ✅ CORREÇÃO FINAL: O caminho agora aponta para a pasta 'model' (singular),
// que é a estrutura correta do seu projeto.
import Patient from '@/model/Patient';
import Doctor from '@/model/Doctor';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  try {
    await connectDB();
    const currentYear = new Date().getFullYear();

    const createPipeline = (model) => [
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ];

    const [patientRegistrations, doctorRegistrations] = await Promise.all([
        Patient.aggregate(createPipeline(Patient)),
        Doctor.aggregate(createPipeline(Doctor))
    ]);
    
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const chartData = monthNames.map((mes, index) => {
        const monthNumber = index + 1;
        const patientData = patientRegistrations.find(item => item._id === monthNumber);
        const doctorData = doctorRegistrations.find(item => item._id === monthNumber);

        return {
            mes,
            pacientes: patientData?.count || 0,
            medicos: doctorData?.count || 0,
        };
    });

    res.status(200).json({ success: true, data: chartData });

  } catch (error) {
    console.error('Erro ao agregar cadastros por mês:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
}
