// src/models/Patient.js
import mongoose from 'mongoose';

const historicoSchema = new mongoose.Schema({
  hipertensao: { type: Boolean, default: false },
  diabetes: { type: Boolean, default: false },
  alergias: { type: Boolean, default: false },
  cardiaco: { type: Boolean, default: false },
  respiratorio: { type: Boolean, default: false },
  gravidez: { type: Boolean, default: false },
}, { _id: false });

const patientSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome do paciente é obrigatório.'],
    trim: true,
  },
  dataNascimento: {
    type: Date,
    required: [true, 'A data de nascimento é obrigatória.'],
  },
  cpf: {
    type: String,
    required: [true, 'O CPF é obrigatório.'],
    unique: true,
    trim: true,
  },
  telefone: {
    type: String,
    trim: true,
  },
  sexo: {
    type: String,
    enum: ['M', 'F', 'Outro'],
  },
  temConvenio: {
    type: Boolean,
    default: false,
  },
  historico: historicoSchema,
}, {
  timestamps: true,
});

export default mongoose.models.Patient || mongoose.model('Patient', patientSchema);
