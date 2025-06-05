import { MongoClient, ObjectId } from 'mongodb';

// Configurações da conexão (sem alterações)
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ezhealth_db';
let client;
let clientPromise;
if (!uri) { throw new Error('Please define the MONGODB_URI environment variable inside .env.local'); }
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromiseTriagens) {
    client = new MongoClient(uri);
    global._mongoClientPromiseTriagens = client.connect();
  }
  clientPromise = global._mongoClientPromiseTriagens;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

function classifyRiskBackend(triagemData) { // Sem alterações
  const { sinaisVitais = {}, sintomas = {}, sintomasDetalhes = {}, historico = {} } = triagemData;
  function toNumber(value) { const num = parseFloat(value); return isNaN(num) ? undefined : num; }
  const temperatura = toNumber(sinaisVitais.temperatura);
  let pressaoSistolica, pressaoDiastolica;
  if (typeof sinaisVitais.pressao === "string" && sinaisVitais.pressao.includes("/")) {
    const [sist, diast] = sinaisVitais.pressao.split("/");
    const ps = toNumber(sist); const pd = toNumber(diast);
    if (ps !== undefined && pd !== undefined) { pressaoSistolica = ps; pressaoDiastolica = pd; }
  }
  const frequencia = toNumber(sinaisVitais.frequencia);
  const saturacao = toNumber(sinaisVitais.saturacao);
  const opacity = 0.5;
  let riskLevel = { color: `rgba(0, 0, 255, ${opacity})`, label: "Não Urgente", time: "até 4 horas", priority: 5 };
  if ((saturacao !== undefined && saturacao < 90) || (frequencia !== undefined && frequencia > 130) || (pressaoSistolica !== undefined && pressaoSistolica >= 180) || (pressaoDiastolica !== undefined && pressaoDiastolica >= 110) || (sintomas.dorPeito === true) || (sintomas.faltaAr === true)) { return { color: `rgba(255, 0, 0, ${opacity})`, label: "Emergência", time: "imediato", priority: 1 }; }
  if ((temperatura !== undefined && temperatura >= 39) || (frequencia !== undefined && frequencia > 100 && frequencia <= 130) || (sintomas.tontura === true && sintomasDetalhes.tempoSintomas === "menos24h") || (sintomas.nauseaVomito === true && sintomasDetalhes.tempoSintomas === "menos24h")) { return { color: `rgba(255, 140, 0, ${opacity})`, label: "Muito Urgente", time: "até 10 minutos", priority: 2 }; }
  if ((temperatura !== undefined && temperatura >= 38.5 && temperatura < 39) || (sintomas.febre === true) || (sintomas.dorCabeca === true) || (historico.hipertensao === true) || (historico.diabetes === true) || (historico.cardiaco === true) || (historico.respiratorio === true)) { return { color: `rgba(255, 215, 0, ${opacity})`, label: "Urgente", time: "até 60 minutos", priority: 3 }; }
  if ((sintomas.tosse === true && sintomasDetalhes.tempoSintomas === "1a3dias") || (sintomas.outros && sintomas.outros.trim() !== "")) { return { color: `rgba(0, 128, 0, ${opacity})`, label: "Pouco Urgente", time: "até 2 horas", priority: 4 }; }
  return riskLevel;
}

export default async function handler(req, res) {
  console.log(`[API /api/triagem] Requisição recebida: ${req.method}`);
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const triagensCollection = db.collection('triagens');
    const salasCollection = db.collection('salas');
    const medicosCollection = db.collection('medicos');

    if (req.method === 'POST') {
      const dataBrutaDoFrontend = req.body;
      const classificacao = classifyRiskBackend(dataBrutaDoFrontend);

      let assignedSala = null;
      let assignedMedico = null;
      let generatedSenha = "Aguardando";
      let roomDocument = null; // Para armazenar o documento da sala encontrada

      console.log('[API /api/triagem] Método POST. Tentando encontrar uma sala disponível...');
      const querySalaDisponivel = { patientId: null }; // Condição para sala disponível
      
      // Tenta encontrar e "reservar" uma sala atomicamente (ou apenas encontrar, se preferir não reservar aqui)
      // Usar findOneAndUpdate pode "reservar" a sala se você mudar um campo nela.
      // Se for apenas para checar disponibilidade sem alterar, um findOne simples seria suficiente.
      // A lógica atual com findOneAndUpdate e $set: {updatedAt} não "reserva" a sala para o patientId ainda.
      roomDocument = await salasCollection.findOneAndUpdate(
        querySalaDisponivel,
        { $set: { updatedAt: new Date() } }, // Apenas atualiza o timestamp da sala encontrada
        { returnDocument: 'after' }
      );
      console.log('[API /api/triagem] Documento da sala retornado por findOneAndUpdate:', roomDocument);


      if (roomDocument) {
        assignedSala = {
          id: roomDocument._id.toString(),
          name: roomDocument.name,
          type: roomDocument.type || 'Geral'
        };
        generatedSenha = `SALA-${assignedSala.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`;
        console.log('[API /api/triagem] Sala encontrada para atribuição:', assignedSala.name);

        let doctorToAssign = null;
        if (roomDocument.doctorId) {
          try {
            doctorToAssign = await medicosCollection.findOne({ _id: new ObjectId(roomDocument.doctorId) });
            if (doctorToAssign) console.log('[API /api/triagem] Médico fixo da sala encontrado:', doctorToAssign.nome);
            else console.log(`[API /api/triagem] Médico fixo da sala (ID: ${roomDocument.doctorId}) não encontrado.`);
          } catch (e) { console.error(`Erro ao buscar médico fixo ${roomDocument.doctorId}: ${e.message}`);}
        }

        if (!doctorToAssign) {
          const activeDoctors = await medicosCollection.find({ status: "Ativo" }).toArray();
          if (activeDoctors.length > 0) {
            doctorToAssign = activeDoctors[Math.floor(Math.random() * activeDoctors.length)];
            console.log('[API /api/triagem] Médico aleatório ativo atribuído:', doctorToAssign.nome);
            // Atualiza a sala com o doctorId do médico aleatório atribuído
            // Esta atualização é importante para refletir o médico na sala.
             await salasCollection.updateOne(
               { _id: roomDocument._id },
               { $set: { doctorId: new ObjectId(doctorToAssign._id), updatedAt: new Date() } }
             );
          } else {
            console.log('[API /api/triagem] Nenhum médico ativo disponível.');
          }
        }
        if (doctorToAssign) {
          assignedMedico = {
            id: doctorToAssign._id.toString(),
            nome: doctorToAssign.nome,
            foto: doctorToAssign.foto || "/icons/medico-avatar.svg",
            statusDoMedicoNoMomentoDaTriagem: doctorToAssign.status
          };
        }
      } else {
        console.log('[API /api/triagem] Nenhuma sala disponível encontrada.');
      }

      // Define o status da triagem inteligentemente
      let statusParaTriagem = "Pendente"; // Default
      if (dataBrutaDoFrontend.atendimentoInfo && dataBrutaDoFrontend.atendimentoInfo.status) {
          statusParaTriagem = dataBrutaDoFrontend.atendimentoInfo.status; // Usa status do frontend se fornecido (ex: admin adicionando)
      } else if (assignedSala) { // Se não veio do frontend, mas uma sala foi designada
          statusParaTriagem = assignedMedico ? "Em Atendimento" : "Aguardando Sala";
      }

      const triagemFinalParaSalvar = {
        ...dataBrutaDoFrontend,
        classificacaoRisco: classificacao,
        atendimentoInfo: {
          ...(dataBrutaDoFrontend.atendimentoInfo || {}),
          senha: generatedSenha,
          sala: assignedSala ? assignedSala.name : "Não Atribuída",
          roomId: assignedSala ? new ObjectId(assignedSala.id) : null,
          medico: assignedMedico || null,
          status: statusParaTriagem // Status definido inteligentemente
        },
        createdAt: new Date(),
        updatedAt: new Date() // Adiciona updatedAt na criação
      };

      const resultInsertTriage = await triagensCollection.insertOne(triagemFinalParaSalvar);
      const newTriageId = resultInsertTriage.insertedId;

      if (assignedSala && roomDocument) { // Se uma sala foi efetivamente designada
       await salasCollection.updateOne(
          { _id: roomDocument._id },
          { $set: { patientId: newTriageId, updatedAt: new Date() } } // Agora atribui o patientId à sala
        );
      }

      // Retorna a triagem completa, incluindo o status potencialmente ajustado
      const triagemCompletaRetorno = await triagensCollection.findOne({_id: newTriageId});

      res.status(201).json({
        message: 'Triagem salva e processada com sucesso!',
        id: newTriageId.toString(),
        triagemCompleta: triagemCompletaRetorno 
      });

    } else if (req.method === 'GET') {
      // Lógica do GET (sem alterações diretas de status aqui, mas pode precisar de uma rota específica para /api/triagem?id=...)
      const { id } = req.query;
      if (id) { // Se um ID específico é solicitado
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'ID da triagem inválido.' });
        }
        const triagem = await triagensCollection.findOne({ _id: new ObjectId(id) });
        if (!triagem) {
          return res.status(404).json({ message: 'Triagem não encontrada.' });
        }
        // Calcular posição na fila para esta triagem específica
        let positionInQueue = null;
        const statusAguardando = ["Pendente", "Aguardando Sala"];
        if (triagem.atendimentoInfo && statusAguardando.includes(triagem.atendimentoInfo.status)) {
          const prioridadeAtual = triagem.classificacaoRisco?.priority;
          const createdAtAtual = new Date(triagem.createdAt);
          if (prioridadeAtual !== undefined && !isNaN(createdAtAtual.getTime())) {
            const higherPriorityCount = await triagensCollection.countDocuments({
              "atendimentoInfo.status": { $in: statusAguardando },
              "classificacaoRisco.priority": { $lt: prioridadeAtual },
              "_id": { $ne: new ObjectId(id) }
            });
            const samePriorityOlderCount = await triagensCollection.countDocuments({
              "atendimentoInfo.status": { $in: statusAguardando },
              "classificacaoRisco.priority": prioridadeAtual,
              "createdAt": { $lt: createdAtAtual },
              "_id": { $ne: new ObjectId(id) }
            });
            positionInQueue = higherPriorityCount + samePriorityOlderCount + 1;
          }
        }
        return res.status(200).json({ ...triagem, posicaoFila: positionInQueue });
      } else { // Se nenhum ID é solicitado, retorna todas as triagens
        const triagens = await triagensCollection.find({}).sort({ createdAt: -1 }).toArray();
        return res.status(200).json(triagens);
      }

    } else if (req.method === 'PUT') {
      const triageIdFromQuery = req.query.id; // ID vem da query string
      const updatePayload = req.body;       // Dados para atualização vêm do corpo

      if (!triageIdFromQuery || !ObjectId.isValid(triageIdFromQuery)) {
        return res.status(400).json({ message: 'ID da triagem inválido ou ausente na query string.' });
      }

      const filter = { _id: new ObjectId(triageIdFromQuery) };
      const updateDoc = { $set: {} };
      let fieldsToUpdateCount = 0;

      // Atualiza campos em dadosPessoalPaciente, se fornecido
      if (updatePayload.dadosPessoalPaciente) {
        for (const key in updatePayload.dadosPessoalPaciente) {
          if (updatePayload.dadosPessoalPaciente[key] !== undefined) {
            updateDoc.$set[`dadosPessoalPaciente.${key}`] = updatePayload.dadosPessoalPaciente[key];
            fieldsToUpdateCount++;
          }
        }
      }
      // Atualiza status em atendimentoInfo, se fornecido
      if (updatePayload.atendimentoInfo && updatePayload.atendimentoInfo.status !== undefined) {
        updateDoc.$set["atendimentoInfo.status"] = updatePayload.atendimentoInfo.status;
        fieldsToUpdateCount++;
      }
      // Você pode adicionar outras lógicas para atualizar mais campos de atendimentoInfo aqui se necessário

      if (fieldsToUpdateCount === 0) {
        return res.status(400).json({ message: 'Nenhum campo válido para atualização foi fornecido.' });
      }
      updateDoc.$set["updatedAt"] = new Date();

      const result = await triagensCollection.updateOne(filter, updateDoc);

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Triagem não encontrada para atualização.' });
      }
      if (result.modifiedCount === 0 && result.matchedCount === 1) {
        // Encontrou mas nada mudou (talvez os dados enviados eram os mesmos já existentes)
        return res.status(200).json({ message: 'Nenhuma alteração aplicada, os dados podem já estar atualizados.' });
      }
      res.status(200).json({ message: 'Triagem atualizada com sucesso.' });

    } else if (req.method === 'DELETE') { // Sem alterações na lógica DELETE, mas confirmando que usa req.query.id
      const { id } = req.query;
      if (!id || !ObjectId.isValid(id)) { return res.status(400).json({ message: 'Invalid or missing triage ID for deletion.' }); }
      const triageToDelete = await triagensCollection.findOne({ _id: new ObjectId(id) });
      if (!triageToDelete) { return res.status(404).json({ message: 'Triage not found for deletion.' }); }
      if (triageToDelete.atendimentoInfo && triageToDelete.atendimentoInfo.roomId) {
        try {
            await salasCollection.updateOne(
              { _id: new ObjectId(triageToDelete.atendimentoInfo.roomId) },
              { $set: { patientId: null, doctorId: null, updatedAt: new Date() } }
            );
        } catch (e) {
            console.error(`Erro ao tentar liberar sala ${triageToDelete.atendimentoInfo.roomId}: ${e.message}`);
        }
      }
      const result = await triagensCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) { return res.status(404).json({ message: 'Triage not found during deletion attempt.' }); }
      res.status(200).json({ message: 'Triage deleted successfully.' });
    } else {
      res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('[API /api/triagem] Erro crítico ao processar a requisição:', error);
    res.status(500).json({ message: 'Erro interno crítico do servidor.', error: error.message });
  }
}