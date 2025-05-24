import { connectDB } from '../../lib/mongodb';
import Triagem from '../../model/Triagem';
import PDFDocument from 'pdfkit';

export default async function handler(req, res) {
  try {
    await connectDB();

    const ultimaTriagem = await Triagem.findOne().sort({ data: -1 });

    if (!ultimaTriagem) {
      return res.status(404).json({ sucesso: false, erro: 'Nenhuma triagem encontrada.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=ultima-triagem.pdf');

    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(res);

    // Fonte e cor do título EZHealth
    doc
      .fontSize(30)
      .fillColor('#2E86C1')
      .text('EZHealth', { align: 'center' });

    doc.moveDown(0.5);

    // Subtítulo
    doc
      .fontSize(18)
      .fillColor('#34495E')
      .text('Relatório da Última Triagem', { align: 'center' });

    doc.moveDown(2);

    // Função para formatar a data em dd/mm/yyyy hh:mm
    function formatarData(data) {
      const d = new Date(data);
      return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    // Conteúdo
    doc
      .fontSize(14)
      .fillColor('#000000')
      .text(`Nome: ${ultimaTriagem.nome}`, { continued: false })
      .moveDown(0.5)
      .text(`Telefone: ${ultimaTriagem.telefone}`)
      .moveDown(0.5)
      .text(`Email: ${ultimaTriagem.email}`)
      .moveDown(0.5)
      .text(`Sintomas: ${ultimaTriagem.sintomas}`)
      .moveDown(0.5)
      .text(`Data da Triagem: ${formatarData(ultimaTriagem.data)}`);

    doc.moveDown(3);

    // Rodapé simples
    doc
      .fontSize(10)
      .fillColor('#95A5A6')
      .text('© 2025 EZHealth - Todos os direitos reservados', { align: 'center' });

    doc.end();

  } catch (error) {
    res.status(500).json({ sucesso: false, erro: error.message });
  }
}
