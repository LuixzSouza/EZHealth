import connectDB from '@/lib/mongodb';
import Triage from '@/model/Triage'; 
import Room from '@/model/Room';
import Doctor from '@/model/Doctor';
import Patient from '@/model/Patient';
import Appointment from '@/model/Appointment'; // ✅ 1. IMPORT ADICIONADO

// A função de classificação de risco não muda
function classifyRiskBackend(triagemData) {
    const { sinaisVitais = {}, sintomas = {}, sintomasDetalhes = {}, historico = {} } = triagemData;
    function toNumber(value) { const num = parseFloat(value); return isNaN(num) ? undefined : num; }
    const temperatura = toNumber(sinaisVitais.temperatura);
    let pressaoSistolica, pressaoDiastolica;
    if (typeof sinaisVitais.pressao === "string" && sinaisVitais.pressao.includes("/")) {
        const [sist, diast] = sinaisVitais.pressao.split("/");
        pressaoSistolica = toNumber(sist);
        pressaoDiastolica = toNumber(diast);
    }
    const frequencia = toNumber(sinaisVitais.frequencia);
    const saturacao = toNumber(sinaisVitais.saturacao);
    
    let riskLevel = { color: 'blue', label: "Não Urgente", time: "até 4 horas", priority: 5 };
    if ((saturacao < 90) || (frequencia > 130) || (pressaoSistolica >= 180) || (pressaoDiastolica >= 110) || sintomas.dorPeito || sintomas.faltaAr) { return { color: 'red', label: "Emergência", time: "imediato", priority: 1 }; }
    if ((temperatura >= 39) || (frequencia > 100) || (sintomas.tontura && sintomasDetalhes?.tempoSintomas === "menos24h") || (sintomas.nauseaVomito && sintomasDetalhes?.tempoSintomas === "menos24h")) { return { color: 'orange', label: "Muito Urgente", time: "até 10 minutos", priority: 2 }; }
    if ((temperatura >= 38.5) || sintomas.febre || sintomas.dorCabeca || historico.hipertensao || historico.diabetes || historico.cardiaco || historico.respiratorio) { return { color: 'yellow', label: "Urgente", time: "até 60 minutos", priority: 3 }; }
    if ((sintomas.tosse && sintomasDetalhes?.tempoSintomas === "1a3dias") || (sintomas.outros && sintomas.outros.trim() !== "")) { return { color: 'green', label: "Pouco Urgente", time: "até 2 horas", priority: 4 }; }
    return riskLevel;
}

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case 'POST':
      try {
        const { patientId, ...dataBrutaDoFrontend } = req.body;

        if (!patientId) {
            return res.status(400).json({ success: false, message: 'O ID do paciente (patientId) é obrigatório.' });
        }
        const patientExists = await Patient.findById(patientId);
        if (!patientExists) {
            return res.status(404).json({ success: false, message: 'Paciente não encontrado.' });
        }
        
        const classificacao = classifyRiskBackend({ ...dataBrutaDoFrontend, historico: patientExists.historico });

        let assignedRoom = null;
        let assignedDoctor = null;
        
        const room = await Room.findOneAndUpdate(
            { status: 'Livre' }, 
            { $set: { status: 'Ocupada' } },
            { new: true }
        );

        if (room) {
            if (room.doctorId) {
                assignedDoctor = await Doctor.findById(room.doctorId);
            } else {
                const activeDoctors = await Doctor.find({ status: "Ativo" });
                if (activeDoctors.length > 0) {
                    assignedDoctor = activeDoctors[Math.floor(Math.random() * activeDoctors.length)];
                    await Room.findByIdAndUpdate(room._id, { doctorId: assignedDoctor._id });
                }
            }
        }
        
        let statusParaTriagem = 'Aguardando Triagem'; 
        if(room) {
            statusParaTriagem = assignedDoctor ? "Em Atendimento" : "Aguardando Sala";
        }
        
        const newTriageData = {
            patientId,
            ...dataBrutaDoFrontend,
            classificacao,
            atendimentoInfo: {
                senha: room ? `SALA-${room.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}` : "Aguardando",
                sala: room ? room.name : "Não Atribuída",
                roomId: room ? room._id : null,
                medicoId: assignedDoctor ? assignedDoctor._id : null,
                status: statusParaTriagem
            }
        };
        
        const createdTriage = await Triage.create(newTriageData);

        if(room){
            await Room.findByIdAndUpdate(room._id, { patientId: createdTriage.patientId });
        }

        // ✅ 2. BLOCO ADICIONADO PARA CRIAR O AGENDAMENTO AUTOMÁTICO
        if (assignedDoctor && room) { 
            await Appointment.create({
                patientId: createdTriage.patientId,
                doctorId: assignedDoctor._id,
                roomId: room._id,
                triageId: createdTriage._id,
                date: new Date(),
                description: `Atendimento de Triagem - Classificação: ${classificacao.label}`,
                status: 'Em Atendimento'
            });
        }
        
        res.status(201).json({ success: true, data: createdTriage });

      } catch (error) {
        console.error('[API /api/triagem POST]', error);
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'GET':
      try {
        const triagens = await Triage.find({})
                                        .sort({ createdAt: -1 })
                                        .populate('patientId', 'nome')
                                        .populate('atendimentoInfo.medicoId', 'nome');
        res.status(200).json({ success: true, data: triagens });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}