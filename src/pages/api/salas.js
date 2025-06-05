// pages/api/salas.js
import { MongoClient, ObjectId } from 'mongodb';

// Configurações da conexão com o MongoDB (reutilizando sua lógica)
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ezhealth_db';

let client;
let clientPromiseSalas; // Usar um nome diferente para evitar conflitos com outros caches globais

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromiseSalas) {
    client = new MongoClient(uri);
    global._mongoClientPromiseSalas = client.connect();
  }
  clientPromiseSalas = global._mongoClientPromiseSalas;
} else {
  client = new MongoClient(uri);
  clientPromiseSalas = client.connect();
}

export default async function handler(req, res) {
  try {
    const client = await clientPromiseSalas; // Usar o clientPromise específico para salas

    const db = client.db(dbName);

    const collection = db.collection('salas'); // Nome da sua coleção de salas
    const triagensCollection = db.collection('triagens'); // Para desocupar triagens ao deletar sala

    switch (req.method) {
      case 'GET':
        const salas = await collection.find({}).toArray();
        // Converter ObjectId para string para a resposta
        const formattedSalas = salas.map(sala => ({
          id: sala._id.toString(),
          name: sala.name,
          type: sala.type || 'Geral', // Adicionado: tipo da sala
          doctorId: sala.doctorId ? sala.doctorId.toString() : null, // Garante que o ID do médico é string ou null
          patientId: sala.patientId ? sala.patientId.toString() : null, // patientId pode ser null
        }));
        res.status(200).json(formattedSalas);
        break;

      case 'POST':
        const { name, type, doctorId, patientId } = req.body; // Adicionado: type

        if (!name) {
          console.error('[API /api/salas] Erro POST: Nome da sala ausente.');
          return res.status(400).json({ message: 'O nome da sala é obrigatório.' });
        }

        const newSala = {
          name,
          type: type || 'Geral', // Adicionado: tipo da sala
          doctorId: doctorId && ObjectId.isValid(doctorId) ? new ObjectId(doctorId) : null,
          patientId: patientId && ObjectId.isValid(patientId) ? new ObjectId(patientId) : null, // patientId pode ser null
          createdAt: new Date(),
        };

        const resultPost = await collection.insertOne(newSala);
        res.status(201).json({
          message: 'Sala adicionada com sucesso!',
          id: resultPost.insertedId.toString(),
          ...newSala // Retorna a sala com o ID para a UI
        });
        break;

      case 'PUT':
        const { id, name: updatedName, type: updatedType, doctorId: updatedDoctorId, patientId: updatedPatientId } = req.body; // Adicionado: type

        if (!id || !ObjectId.isValid(id)) {
          console.error('[API /api/salas] Erro PUT: ID da sala inválido ou ausente.');
          return res.status(400).json({ message: 'ID da sala inválido ou ausente.' });
        }

        const filterPut = { _id: new ObjectId(id) };

        // Lógica para desocupar a triagem se o paciente for removido da sala
        const currentRoom = await collection.findOne(filterPut);
        if (currentRoom && currentRoom.patientId && (!updatedPatientId || !ObjectId.isValid(updatedPatientId) || updatedPatientId === '')) {
            // Se o paciente atual está sendo removido (updatedPatientId é null/vazio)
            await triagensCollection.updateOne(
                { _id: currentRoom.patientId },
                { $set: { 'atendimentoInfo.roomId': null, 'atendimentoInfo.sala': 'Não Atribuída', 'atendimentoInfo.medico': null } }
            );
        }
        // Lógica para atribuir paciente à triagem se um paciente for adicionado à sala
        if (updatedPatientId && ObjectId.isValid(updatedPatientId) && currentRoom.patientId !== new ObjectId(updatedPatientId)) {
            // Se um novo paciente está sendo atribuído
            await triagensCollection.updateOne(
                { _id: new ObjectId(updatedPatientId) },
                { $set: { 'atendimentoInfo.roomId': new ObjectId(id), 'atendimentoInfo.sala': updatedName, 'atendimentoInfo.status': 'Em Atendimento' } } // Atualiza status
            );
        }

        const updateDoc = {
          $set: {
            name: updatedName,
            type: updatedType || 'Geral', // Adicionado: tipo da sala
            doctorId: updatedDoctorId && ObjectId.isValid(updatedDoctorId) ? new ObjectId(updatedDoctorId) : null,
            patientId: updatedPatientId && ObjectId.isValid(updatedPatientId) ? new ObjectId(updatedPatientId) : null, // patientId pode ser null
            updatedAt: new Date(),
          },
        };

        const resultPut = await collection.updateOne(filterPut, updateDoc);

        if (resultPut.matchedCount === 0) {
          console.error(`[API /api/salas] Erro PUT: Sala ${id} não encontrada.`);
          return res.status(404).json({ message: 'Sala não encontrada.' });
        }
        res.status(200).json({ message: 'Sala atualizada com sucesso.' });
        break;

      case 'DELETE':
        const { id: deleteId } = req.query;

        if (!deleteId || !ObjectId.isValid(deleteId)) {
          console.error('[API /api/salas] Erro DELETE: ID da sala inválido ou ausente.');
          return res.status(400).json({ message: 'ID da sala inválido ou ausente.' });
        }

        const triagensCollectionForDelete = db.collection('triagens'); // Re-obter coleção aqui
        await triagensCollectionForDelete.updateMany(
            { 'atendimentoInfo.roomId': new ObjectId(deleteId) },
            { $set: { 'atendimentoInfo.roomId': null, 'atendimentoInfo.sala': 'Não Atribuída', 'atendimentoInfo.medico': null } }
        );
        const resultDelete = await collection.deleteOne({ _id: new ObjectId(deleteId) });

        if (resultDelete.deletedCount === 0) {
          console.error(`[API /api/salas] Erro DELETE: Sala ${deleteId} não encontrada.`);
          return res.status(404).json({ message: 'Sala não encontrada.' });
        }
        res.status(200).json({ message: 'Sala removida com sucesso.' });
        break;

      default:
        console.warn(`[API /api/salas] Método ${req.method} não permitido.`);
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('[API /api/salas] Erro crítico ao processar a requisição:', error);
    res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
}
