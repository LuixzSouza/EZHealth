// ✅ ARQUIVO 1: Substitua o conteúdo deste arquivo:
// pages/api/patients.js

import connectDB from '@/lib/mongodb';
import Patient from '@/model/Patient';
import Appointment from '@/model/Appointment'; 
import Triage from '@/model/Triage';       

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const { id, cpf } = req.query;

        // Para busca por CPF, que é o caso do formulário de triagem
        if (cpf) {
          // CORREÇÃO 1: Limpamos o CPF de espaços em branco antes de buscar.
          // Isso garante que " 21 " seja tratado da mesma forma que "21".
          const trimmedCpf = cpf.trim();
          const patient = await Patient.findOne({ cpf: trimmedCpf });
          
          if (!patient) {
            return res.status(404).json({ success: false, message: 'Paciente não encontrado com este CPF.' });
          }
          return res.status(200).json({ success: true, data: patient });
        }
        
        // Lógica para busca por ID (sem alterações)
        if (id) {
          const patient = await Patient.findById(id);
          if (!patient) {
            return res.status(404).json({ success: false, message: 'Paciente não encontrado.' });
          }
          return res.status(200).json({ success: true, data: patient });
        }
        
        // Se nenhum parâmetro, lista todos (sem alterações)
        const patients = await Patient.find({}).sort({ nome: 1 });
        return res.status(200).json({ success: true, data: patients });

      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    // ... (Os métodos POST, PUT, DELETE não precisam de alteração)
    case 'POST':
      try {
        const newPatient = await Patient.create(req.body);
        res.status(201).json({ success: true, data: newPatient });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'PUT':
      try {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ success: false, message: 'O ID do paciente é obrigatório.' });
        }
        const updatedPatient = await Patient.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updatedPatient) {
          return res.status(404).json({ success: false, message: 'Paciente não encontrado.' });
        }
        res.status(200).json({ success: true, data: updatedPatient });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ success: false, message: 'O ID do paciente é obrigatório.' });
        }
        const relatedAppointments = await Appointment.countDocuments({ patientId: id });
        const relatedTriages = await Triage.countDocuments({ patientId: id });
        if (relatedAppointments > 0 || relatedTriages > 0) {
          return res.status(400).json({ 
            success: false, 
            message: 'Este paciente não pode ser removido pois possui agendamentos ou triagens associadas.' 
          });
        }
        const deletedPatient = await Patient.findByIdAndDelete(id);
        if (!deletedPatient) {
          return res.status(404).json({ success: false, message: 'Paciente não encontrado.' });
        }
        res.status(200).json({ success: true, message: 'Paciente removido com sucesso.' });
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
