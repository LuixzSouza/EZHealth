import connectDB from '@/lib/mongodb';
import Triage from '@/model/Triage';
import Room from '@/model/Room';
import Appointment from '@/model/Appointment';
import Patient from '@/model/Patient';
import Doctor from '@/model/Doctor';

export default async function handler(req, res) {
    await connectDB();
    const { id } = req.query;

    switch (req.method) {
        case 'GET':
            try {
                const triage = await Triage.findById(id)
                    .populate('patientId')
                    .populate({ path: 'atendimentoInfo.medicoId', model: Doctor, select: 'nome especialidade' });

                if (!triage) {
                    return res.status(404).json({ success: false, message: 'Triagem não encontrada' });
                }

                // --- Lógica da Fila ---
                let posicaoFila = null;
                const statusAguardando = ['Aguardando Triagem', 'Aguardando Sala'];

                if (statusAguardando.includes(triage.atendimentoInfo.status)) {
                    const prioridadeAtual = triage.classificacao.priority;
                    const createdAtAtual = triage.createdAt;
                    const triagensComMaiorPrioridade = await Triage.countDocuments({
                        "atendimentoInfo.status": { $in: statusAguardando },
                        "classificacao.priority": { $lt: prioridadeAtual },
                    });
                    const triagensComMesmaPrioridadeMaisAntigas = await Triage.countDocuments({
                        "atendimentoInfo.status": { $in: statusAguardando },
                        "classificacao.priority": prioridadeAtual,
                        "createdAt": { $lt: createdAtAtual },
                    });
                    posicaoFila = triagensComMaiorPrioridade + triagensComMesmaPrioridadeMaisAntigas + 1;
                }

                const responseData = { ...triage.toObject(), posicaoFila };
                return res.status(200).json({ success: true, data: responseData });

            } catch (err) {
                console.error('Erro ao buscar triagem por ID:', err);
                return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
            }
            break;

        case 'PATCH':
            try {
                const body = req.body;
                
                const updatedTriage = await Triage.findByIdAndUpdate(id, { $set: body }, { new: true });

                if (!updatedTriage) {
                    return res.status(404).json({ success: false, message: 'Triagem não encontrada para atualização.' });
                }

                // --- Lógica de Finalização ---
                if (body['atendimentoInfo.status'] === 'Finalizado') {
                    
                    // 1. Atualiza o Agendamento (Appointment)
                    await Appointment.findOneAndUpdate(
                        { triageId: id },
                        { 
                            $set: { 
                                status: 'Finalizado', 
                                diagnosis: body.diagnostico,
                                prescription: body.prescricao,
                            } 
                        }
                    );

                    // 2. Libera a Sala (Room)
                    if (updatedTriage.atendimentoInfo.roomId) {
                        await Room.findByIdAndUpdate(updatedTriage.atendimentoInfo.roomId, {
                            $set: { status: 'Livre' },
                            $unset: { patientId: "" }
                        });
                    }
                }

                return res.status(200).json({ success: true, data: updatedTriage });
            } catch (error) {
                console.error('[API PATCH /api/triagem/[id]]', error);
                return res.status(400).json({ success: false, message: error.message });
            }
            break;

        case 'DELETE':
            try {
                const triageToDelete = await Triage.findById(id);
                if (!triageToDelete) {
                    return res.status(404).json({ success: false, message: 'Triagem não encontrada.' });
                }
                if (triageToDelete.atendimentoInfo && triageToDelete.atendimentoInfo.roomId) {
                    await Room.findByIdAndUpdate(triageToDelete.atendimentoInfo.roomId, { status: 'Livre', $unset: { patientId: "", doctorId: "" } });
                }
                await Triage.findByIdAndDelete(id);
                return res.status(200).json({ success: true, message: 'Triagem removida com sucesso.' });
            } catch (error) {
                return res.status(400).json({ success: false, message: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
            break;
    }
}