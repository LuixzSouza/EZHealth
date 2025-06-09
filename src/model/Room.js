// ✅ ARQUIVO 1: O MODELO CORRETO E COMPLETO
// Substitua todo o conteúdo do seu arquivo em 'src/model/Room.js' por este:

import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome da sala é obrigatório.'],
    unique: true,
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'O tipo da sala é obrigatório.'],
    enum: ['Geral', 'UTI', 'Consultório', 'Triagem', 'Emergência'],
  },
  // O campo para o médico
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  // ✅ GARANTIA DEFINITIVA: Este campo DEVE estar no seu modelo.
  // Se o erro "Cannot populate" persistir, o problema é 100% cache.
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  },
  status: {
    type: String,
    enum: ['Livre', 'Ocupada', 'Em Limpeza'],
    default: 'Livre'
  }
}, {
  timestamps: true,
});

export default mongoose.models.Room || mongoose.model('Room', roomSchema);

