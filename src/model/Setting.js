// ✅ PASSO 1.1: CRIE ESTE NOVO ARQUIVO DE MODELO EM:
// src/model/Setting.js

import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  // Usamos uma chave fixa para garantir que haverá apenas um documento de configuração
  key: {
    type: String,
    default: 'main_settings',
    unique: true,
  },
  clinicName: {
    type: String,
    required: [true, 'O nome da clínica é obrigatório.'],
    trim: true,
    default: 'EZHealth Clínica Padrão'
  },
  supportEmail: {
    type: String,
    required: [true, 'O email de suporte é obrigatório.'],
    trim: true,
    lowercase: true,
    default: 'suporte@ezhealth.com'
  },
  systemVersion: {
    type: String,
    default: '1.0.0'
  }
}, { timestamps: true });

export default mongoose.models.Setting || mongoose.model('Setting', settingSchema);

