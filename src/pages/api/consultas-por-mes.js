// pages/api/consultas-por-mes.js (VERSÃO REATORADA COM MONGOOSE)

import connectDB from '@/lib/mongodb';
import Appointment from '@/model/Appointment';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await connectDB();

    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth(); // Mês atual (0-indexado: Jan=0)

    // ANTES: O pipeline usava $match com datas em formato string.
    // DEPOIS: Usamos datas do tipo ISODate, que é mais correto e performático.
    const pipeline = [
      {
        $match: {
          date: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$date" }, // Agrupa pelo número do mês (1-12)
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id": 1 }, // Ordena pelo mês
      },
    ];
    
    // ANTES: coll.aggregate(pipeline).toArray();
    // DEPOIS: Usamos o modelo do Mongoose diretamente.
    const monthlyData = await Appointment.aggregate(pipeline);

    // --- Lógica para formatar os dados para o gráfico (mantida e adaptada) ---
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    
    // Cria um mapa para acesso rápido aos dados reais (ex: 1 -> 25, 6 -> 10)
    const realDataMap = new Map(monthlyData.map(item => [item._id, item.count]));

    const finalChartData = [];
    // Gera dados para cada mês, do início do ano até o mês atual
    for (let i = 0; i <= currentMonthIndex; i++) {
        const monthNumber = i + 1;
        const realCount = realDataMap.get(monthNumber);

        // Se houver dados reais, usa. Senão, usa 0 (ou um valor ilustrativo em dev)
        const consultas = realCount !== undefined 
            ? realCount 
            : (process.env.NODE_ENV === 'development' ? Math.floor(Math.random() * 20) + 5 : 0);

        finalChartData.push({
            mes: monthNames[i],
            consultas: consultas,
        });
    }

    return res.status(200).json({ success: true, data: finalChartData });
    
  } catch (error) {
    console.error('Erro ao agregar consultas por mês:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor.', error: error.message });
  }
}