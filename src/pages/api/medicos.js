// ✅ SUBSTITUA O CONTEÚDO DO SEU ARQUIVO POR ESTE:
// pages/api/medicos.js

import connectDB from '@/lib/mongodb';
import Doctor from '@/model/Doctor';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const doctors = await Doctor.find({}).select('-password');
        res.status(200).json({ success: true, data: doctors });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'POST':
      // A lógica de POST já está correta e funcionando.
      try {
        const { email, password, nome, especialidade, foto, status } = req.body;
        if (!email || !password || !nome || !especialidade) {
          return res.status(400).json({ success: false, message: 'Todos os campos, incluindo a senha, são obrigatórios.' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const doctor = await Doctor.create({
          nome, especialidade, email, status, foto,
          password: hashedPassword,
        });
        
        const doctorResponse = doctor.toObject();
        delete doctorResponse.password;
        res.status(201).json({ success: true, data: doctorResponse });

      } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: `O email '${req.body.email}' já está em uso.` });
        }
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    case 'PUT':
      try {
        const { id } = req.query;
        // ✅ CORREÇÃO FINAL AQUI:
        // Desestruturamos e ignoramos _id e __v que vêm do formulário,
        // garantindo que eles não sejam enviados na atualização.
        const { _id, __v, password, ...updateData } = req.body;

        if (!id) {
          return res.status(400).json({ success: false, message: 'O ID do médico é obrigatório.' });
        }
        
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }
        
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
        if (!updatedDoctor) {
            return res.status(404).json({ success: false, message: 'Médico não encontrado.' });
        }
        
        res.status(200).json({ success: true, data: updatedDoctor });
      } catch (error) {
        // Agora o erro de "immutable field" não vai mais acontecer.
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ success: false, message: 'O ID é obrigatório.' });
        const deletedDoctor = await Doctor.findByIdAndDelete(id);
        if (!deletedDoctor) return res.status(404).json({ success: false, message: 'Médico não encontrado.' });
        res.status(200).json({ success: true, message: 'Médico removido.' });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
