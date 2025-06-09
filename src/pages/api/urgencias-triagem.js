// pages/api/urgencias-triagem.js (VERSÃO REATORADA COM MONGOOSE)

import connectDB from '@/lib/mongodb';
import Triage from '@/model/Triage';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await connectDB();

    // ANTES: Agregação por `classificacaoRisco.color`, que é um valor rgba(...)
    // DEPOIS: Agregamos por `classificacao.label`, que é o nome da classificação. É mais robusto.
    const pipeline = [
      {
        $group: {
          _id: "$classificacao.label", // Ex: "Emergência", "Urgente", etc.
          count: { $sum: 1 }
        }
      }
    ];

    const aggregationResult = await Triage.aggregate(pipeline);

    // Mapeamento dos labels (do banco) para as cores (para o gráfico/UI)
    const labelToColorMap = {
      'Emergência': 'Vermelho',
      'Muito Urgente': 'Laranja',
      'Urgente': 'Amarelo',
      'Pouco Urgente': 'Verde',
      'Não Urgente': 'Azul',
    };

    // Estrutura padrão para garantir que todas as cores apareçam no resultado
    const urgenciasCount = {
      'Vermelho': { tipo: 'Vermelho', valor: 0 },
      'Laranja': { tipo: 'Laranja', valor: 0 },
      'Amarelo': { tipo: 'Amarelo', valor: 0 },
      'Verde': { tipo: 'Verde', valor: 0 },
      'Azul': { tipo: 'Azul', valor: 0 },
    };

    // Preenche a contagem com os dados reais do banco
    aggregationResult.forEach(item => {
      const label = item._id; // O label, ex: "Emergência"
      const colorName = labelToColorMap[label]; // Converte o label para a cor, ex: "Vermelho"
      if (colorName) {
        urgenciasCount[colorName].valor = item.count;
      }
    });

    // Converte o objeto para o formato de array esperado pelo frontend
    let finalData = Object.values(urgenciasCount);
    
    // Mantém a sua lógica para exibir dados ilustrativos em ambiente de desenvolvimento
    if (process.env.NODE_ENV === 'development' && finalData.every(item => item.valor === 0)) {
        finalData[0].valor = 15; // Vermelho
        finalData[1].valor = 30; // Laranja
        finalData[2].valor = 45; // Amarelo
        finalData[3].valor = 60; // Verde
        finalData[4].valor = 20; // Azul
    }

    res.status(200).json({ success: true, data: finalData });

  } catch (error) {
    console.error('Erro em /api/urgencias-triagem:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor', error: error.message });
  }
}
