// pages/api/agenda.js (VERSÃO REATORADA COM MONGOOSE)

import connectDB from '@/lib/mongodb';
import Appointment from '@/model/Appointment';
import Doctor from '@/model/Doctor'; // Necessário para a lógica de filtro
import Patient from '@/model/Patient'; // Necessário para popular os dados

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const { doctorId, patientId, month, year } = req.query;

        // Monta o objeto de query dinamicamente
        const query = {};
        if (doctorId) {
          query.doctorId = doctorId; // Filtra pela referência do médico (ObjectId)
        }
        if (patientId) {
            query.patientId = patientId; // Filtra pela referência do paciente (ObjectId)
        }
        // Filtro por mês e ano
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59); // Último dia do mês
            query.date = { $gte: startDate, $lte: endDate };
        }
        
        // ANTES: collection.find({ 'medico.nome': medicoNome }).sort({ date: 1, time: 1 })
        // DEPOIS: Usamos a query por ID e populamos com dados relevantes.
        const appointments = await Appointment.find(query)
          .populate('doctorId', 'nome especialidade foto') // Traz nome, especialidade e foto do Doutor
          .populate('patientId', 'nome cpf') // Traz nome e CPF do Paciente
          .sort({ date: 1 }); // Ordena pela data/hora do agendamento

        res.status(200).json({ success: true, data: appointments });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'POST':
      try {
        // ANTES: Inserção manual com collection.insertOne(newAppointment)
        // DEPOIS: Mongoose valida os dados do req.body contra o Schema antes de criar.
        const appointment = await Appointment.create(req.body);
        res.status(201).json({ success: true, data: appointment });
      } catch (error) {
        // Retorna um erro claro se campos obrigatórios (doctorId, patientId, date) faltarem.
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    
    case 'PUT':
        try {
            const { id } = req.query;
            const updateData = req.body;

            if (!id) {
                return res.status(400).json({ success: false, message: 'O ID do agendamento é obrigatório.' });
            }

            const updatedAppointment = await Appointment.findByIdAndUpdate(id, updateData, {
                new: true, // Retorna o documento já atualizado
                runValidators: true, // Garante que os dados da atualização são válidos
            });

            if (!updatedAppointment) {
                return res.status(404).json({ success: false, message: 'Agendamento não encontrado.' });
            }

            res.status(200).json({ success: true, data: updatedAppointment });
        } catch(error) {
            res.status(400).json({ success: false, message: error.message });
        }
        break;

    case 'DELETE':
        try {
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ success: false, message: 'O ID do agendamento é obrigatório.' });
            }

            const deletedAppointment = await Appointment.findByIdAndDelete(id);

            if (!deletedAppointment) {
                return res.status(404).json({ success: false, message: 'Agendamento não encontrado.' });
            }

            res.status(200).json({ success: true, message: 'Agendamento removido com sucesso.' });
        } catch(error) {
            res.status(400).json({ success: false, message: error.message });
        }
        break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
