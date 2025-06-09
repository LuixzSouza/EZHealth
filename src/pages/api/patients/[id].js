// ✅ PASSO 1.1: CRIE UM NOVO ARQUIVO NESTE CAMINHO:
// pages/api/patients/[id].js
// (Dentro da pasta 'pages/api', crie uma nova pasta 'patients', e dentro dela, crie o arquivo '[id].js')

import connectDB from '@/lib/mongodb';
import Patient from '@/model/Patient';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const patient = await Patient.findById(id);
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Paciente não encontrado.' });
      }
      res.status(200).json({ success: true, data: patient });
    } catch (error) {
      res.status(400).json({ success: false, message: 'ID de paciente inválido.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}