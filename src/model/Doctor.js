// ✅ ARQUIVO 1: O MODELO SIMPLES
// Verifique se o seu arquivo em 'src/model/Doctor.js' está assim:

import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  nome: { type: String, required: [true, 'O nome é obrigatório.'], trim: true },
  especialidade: { type: String, required: [true, 'A especialidade é obrigatória.'], trim: true },
  email: { type: String, required: [true, 'O email é obrigatório.'], unique: true, trim: true, lowercase: true },
  // A senha é apenas um campo de texto obrigatório no "molde".
  password: { type: String, required: [true, 'A senha é obrigatória.'] },
  foto: { type: String, trim: true },
  status: { type: String, required: true, enum: ['Ativo', 'Inativo', 'De Férias'], default: 'Ativo' },
}, { timestamps: true });

// Nenhum hook de criptografia aqui. O modelo é apenas a estrutura.

export default mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);