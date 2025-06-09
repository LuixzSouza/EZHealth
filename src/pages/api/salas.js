// ✅ PASSO 1: SUBSTITUA O CONTEÚDO DA SUA API POR ESTE:
// pages/api/salas.js

import connectDB from '@/lib/mongodb';
import Room from '@/model/Room';
import Triage from '@/model/Triage';

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case 'POST':
      try {
        let roomData = req.body;
        // ✅ CORREÇÃO: Se o frontend enviar um doctorId vazio, define como null.
        if (roomData.doctorId === '') {
          roomData.doctorId = null;
        }
        if (roomData.patientId === '') {
          roomData.patientId = null;
        }
        const room = await Room.create(roomData);
        res.status(201).json({ success: true, data: room });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'PUT':
      try {
        const { id } = req.query;
        let updateData = req.body;
        if (!id) return res.status(400).json({ success: false, message: 'O ID da sala é obrigatório.' });
        
        // ✅ CORREÇÃO: Se o frontend enviar um doctorId vazio, remove a propriedade
        // para que ela seja definida como null ou não alterada.
        if (updateData.doctorId === '') {
          updateData.doctorId = null;
        }
        if (updateData.patientId === '') {
            updateData.patientId = null;
        }

        const updatedRoom = await Room.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedRoom) return res.status(404).json({ success: false, message: 'Sala não encontrada.' });
        
        // Popula os dados antes de retornar para a UI ter os nomes corretos
        await updatedRoom.populate(['doctorId', 'patientId']);
        
        res.status(200).json({ success: true, data: updatedRoom });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    // ... (Seus outros métodos GET e DELETE permanecem como estão)
    case 'GET':
      try {
        const rooms = await Room.find({}).populate('doctorId', 'nome').populate('patientId', 'nome');
        res.status(200).json({ success: true, data: rooms });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;
    case 'DELETE':
      try {
        const { id } = req.query;
        await Triage.updateMany({ 'atendimentoInfo.roomId': id }, { $set: { 'atendimentoInfo.roomId': null, 'atendimentoInfo.sala': 'Não Atribuída' } });
        const deletedRoom = await Room.findByIdAndDelete(id);
        if (!deletedRoom) return res.status(404).json({ success: false, message: 'Sala não encontrada.' });
        res.status(200).json({ success: true, message: 'Sala removida com sucesso.' });
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