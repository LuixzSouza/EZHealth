// ✅ PASSO 1: CRIE UM NOVO ARQUIVO NESTE CAMINHO:
// pages/api/auth/login.js

import connectDB from '@/lib/mongodb';
import Doctor from '@/model/Doctor'; // Usaremos o modelo Doctor
import bcrypt from 'bcryptjs';     // Usaremos para comparar a senha

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  await connectDB();

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // --- Lógica para o Login do Administrador ---
    // Mantendo o seu login de admin, como solicitado.
    if (email.toLowerCase() === 'admin@ezhealt.com' && password === '4321') {
      const adminUser = {
        nome: "Administrador",
        email: "admin",
        role: "admin", // Adicionamos uma 'role' para diferenciar
        foto: "/icons/admin-avatar.png"
      };
      return res.status(200).json({ success: true, data: adminUser });
    }

    // --- Lógica para o Login do Médico ---
    // 1. Encontra o médico pelo email no banco de dados.
    const doctor = await Doctor.findOne({ email: email.toLowerCase() });
    if (!doctor) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' }); // Mensagem genérica por segurança
    }

    // 2. Compara a senha enviada com a senha criptografada no banco.
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }

    // 3. Login bem-sucedido! Retorna os dados do médico (sem a senha).
    const doctorResponse = doctor.toObject();
    delete doctorResponse.password;

    res.status(200).json({ success: true, data: doctorResponse });

  } catch (error) {
    console.error("Erro na API de login:", error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
}
