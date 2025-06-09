// ✅ PASSO 1: CRIE UM NOVO ARQUIVO NESTE CAMINHO:
// pages/api/patients/find-or-create.js

import connectDB from '@/lib/mongodb';
import Patient from '@/model/Patient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  await connectDB();

  try {
    const patientData = req.body;
    if (!patientData || !patientData.cpf) {
      return res.status(400).json({ success: false, message: 'Dados do paciente ou CPF ausentes.' });
    }

    // Garante que o CPF não tenha espaços extras
    const trimmedCpf = patientData.cpf.trim();

    // Tenta encontrar o paciente pelo CPF limpo
    let patient = await Patient.findOne({ cpf: trimmedCpf });

    // Se o paciente foi encontrado, retorna ele imediatamente.
    if (patient) {
      return res.status(200).json({ success: true, data: patient, message: 'Paciente encontrado.' });
    }

    // Se não encontrou, cria um novo paciente.
    // O Mongoose vai garantir a unicidade. Se houver uma "race condition"
    // e outro processo criar o paciente um milissegundo antes, o 'catch' abaixo vai lidar com isso.
    patient = await Patient.create(patientData);
    
    // Retorna o paciente recém-criado.
    return res.status(201).json({ success: true, data: patient, message: 'Paciente criado com sucesso.' });

  } catch (error) {
    // Tratamento de erro específico para chave duplicada
    if (error.code === 11000) {
        // Se a criação falhou por duplicidade, significa que o paciente JÁ EXISTE.
        // Então, simplesmente o buscamos novamente e o retornamos. Isso torna a API super robusta.
        console.log("Corrida de condição detectada, buscando paciente existente...");
        const existingPatient = await Patient.findOne({ cpf: req.body.cpf.trim() });
        return res.status(200).json({ success: true, data: existingPatient, message: 'Paciente encontrado após condição de corrida.' });
    }
    
    // Outros erros
    console.error('Erro em find-or-create:', error);
    return res.status(400).json({ success: false, message: error.message });
  }
}
