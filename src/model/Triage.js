// src/models/Triage.js
import mongoose from 'mongoose';

const sinaisVitaisSchema = new mongoose.Schema({
  temperatura: Number,
  pressao: String,
  frequencia: Number,
  saturacao: Number,
}, { _id: false });

const sintomasSchema = new mongoose.Schema({
  febre: { type: Boolean, default: false },
  dorCabeca: { type: Boolean, default: false },
  tosse: { type: Boolean, default: false },
  faltaAr: { type: Boolean, default: false },
  outros: String,
}, { _id: false });

const classificacaoSchema = new mongoose.Schema({
  label: String,
  color: String,
  time: String,
  priority: Number,
}, { _id: false });

const atendimentoInfoSchema = new mongoose.Schema({
    senha: String,
    sala: String,
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    medicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    status: { 
        type: String, 
        enum: ['Aguardando Triagem', 'Aguardando Atendimento', 'Em Atendimento', 'Finalizado'],
        default: 'Aguardando Triagem'
    }
}, { _id: false });

const triageSchema = new mongoose.mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  sinaisVitais: sinaisVitaisSchema,
  sintomas: sintomasSchema,
  tempoSintomas: String,
  classificacao: classificacaoSchema,
  atendimentoInfo: atendimentoInfoSchema,
}, {
  timestamps: true,
});

export default mongoose.models.Triage || mongoose.model('Triage', triageSchema);

