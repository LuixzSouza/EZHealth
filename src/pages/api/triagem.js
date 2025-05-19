// pages/api/triagem.js
import { connectDB } from '@/lib/mongodb';
import Triagem from '@/model/Triagem';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectDB();
      const novaTriagem = await Triagem.create(req.body);
      res.status(200).json({ sucesso: true, triagem: novaTriagem });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  } else {
    res.status(405).json({ erro: 'Método não permitido' });
  }
}