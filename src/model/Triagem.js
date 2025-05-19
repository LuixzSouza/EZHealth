// models/Triagem.js
import mongoose from 'mongoose';

const TriagemSchema = new mongoose.Schema({
  nome: String,
  telefone: String,
  email: String,
  sintomas: String,
  data: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Triagem || mongoose.model('Triagem', TriagemSchema);
