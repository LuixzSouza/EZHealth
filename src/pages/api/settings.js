// ✅ PASSO 1.2: CRIE ESTE NOVO ARQUIVO DE API EM:
// pages/api/settings.js

import connectDB from '@/lib/mongodb';
import Setting from '@/model/Setting'; // Importa o novo modelo

export default async function handler(req, res) {
  await connectDB();

  // Usaremos uma chave fixa para sempre encontrar o mesmo documento de configurações
  const filter = { key: 'main_settings' };

  switch (req.method) {
    case 'GET':
      try {
        // Tenta encontrar as configurações. Se não encontrar, cria com valores padrão.
        let settings = await Setting.findOne(filter);
        if (!settings) {
            settings = await Setting.create({}); // Cria um novo com os defaults do schema
        }
        res.status(200).json({ success: true, data: settings });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'PUT':
      try {
        const updateData = req.body;
        
        // Encontra o documento de configuração e o atualiza.
        // `upsert: true` garante que se o documento não existir, ele será criado.
        // `new: true` garante que o documento retornado seja a versão atualizada.
        const updatedSettings = await Setting.findOneAndUpdate(filter, updateData, {
          new: true,
          upsert: true, 
          runValidators: true,
        });

        res.status(200).json({ success: true, data: updatedSettings });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}