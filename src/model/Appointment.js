// src/models/Appointment.js
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
  triageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Triage',
  },
  status: {
    type: String,
    required: true,
    enum: ['Agendado', 'Em Atendimento', 'Concluído', 'Cancelado'],
    default: 'Agendado',
  },
}, {
  timestamps: true,
});

appointmentSchema.index({ doctorId: 1, date: 1 });

export default mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
