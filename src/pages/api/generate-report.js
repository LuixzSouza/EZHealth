// pages/api/generate-report.js

import connectDB from '@/lib/mongodb';
import Triage from '@/model/Triage';
import PDFDocument from 'pdfkit';

// --- Cores da Marca EZHealth (exemplo, ajuste conforme sua paleta) ---
const brandColors = {
  primary: '#2E86C1', // Um azul vibrante
  secondary: '#34495E', // Um cinza escuro para texto
  accent: '#7F8C8D',   // Um cinza médio para detalhes/linhas
  backgroundLight: '#F7F9FC', // Um fundo muito claro para seções ou áreas
};

// --- Funções Auxiliares Melhoradas ---
function formatarDataHora(data) {
  if (!data) return 'N/A';
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
         ' ' +
         d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Melhoria na função drawSection para um design mais limpo
function drawSection(doc, title, items = []) {
  doc.moveDown(0.7).fontSize(15).fillColor(brandColors.primary).text(title, {
    underline: false, // Desabilitar underline padrão
    align: 'left',
  });
  // Adiciona uma linha sob o título da seção
  doc.strokeColor(brandColors.accent)
     .lineWidth(1)
     .moveTo(doc.x, doc.y)
     .lineTo(doc.page.width - doc.page.margins.right, doc.y)
     .stroke()
     .moveDown(0.5);

  doc.fontSize(11).fillColor(brandColors.secondary); // Tamanho de fonte menor para o conteúdo
  items.forEach((line) => {
    if(line) doc.text(line, { indent: 15 }); // Adiciona um pequeno recuo para o conteúdo da seção
  });
  doc.moveDown(1); // Mais espaço após a seção
}

export default async function handler(req, res) {
  if (req.method !== 'GET' || !req.query.id) {
    return res.status(405).json({ success: false, message: 'Método não permitido ou ID da triagem ausente.' });
  }

  try {
    await connectDB();

    const triage = await Triage.findById(req.query.id)
                                .populate('patientId')
                                .populate('atendimentoInfo.medicoId', 'nome');

    if (!triage) {
      return res.status(404).json({ success: false, message: 'Triagem não encontrada.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio-triagem-${triage._id}.pdf`);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.pipe(res);

    // --- Cabeçalho ---
    // Você pode adicionar um logo aqui. Exemplo:
    // doc.image('/path/to/your/ezhealth-logo.png', doc.page.width - 100, 50, { width: 50 });
    // Ajuste o caminho da imagem e as coordenadas conforme necessário. Para Next.js, 
    // a imagem precisaria estar acessível publicamente ou ser carregada de alguma forma.
    
    doc.fontSize(28).fillColor(brandColors.primary).text('EZHealth', 50, 50); // Posição para a marca

    doc.fontSize(22).fillColor(brandColors.secondary).text('Relatório de Triagem', {
      align: 'right',
      continued: false, // Garante que não continue na mesma linha que EZHealth
      y: 60 // Posição vertical um pouco abaixo de EZHealth
    });
    
    // Linha divisória do cabeçalho
    doc.strokeColor(brandColors.accent)
       .lineWidth(1)
       .moveTo(50, 95)
       .lineTo(doc.page.width - 50, 95)
       .stroke();
    doc.moveDown(2); // Espaço após o cabeçalho

    // --- Dados Pessoais ---
    const dp = triage.patientId || {};
    const dadosPessoais = [
      `Nome: ${dp.nome || 'N/A'}`,
      dp.dataNascimento ? `Data de Nascimento: ${new Date(dp.dataNascimento).toLocaleDateString('pt-BR')}` : null,
      `CPF: ${dp.cpf || 'N/A'}`,
      `Telefone: ${dp.telefone || 'N/A'}`,
      `Sexo: ${dp.sexo || 'N/A'}`,
      `Convênio: ${dp.temConvenio ? 'Sim' : 'Não'}`
    ];
    drawSection(doc, 'Dados Pessoais', dadosPessoais);
    
    // --- Sinais Vitais ---
    const sv = triage.sinaisVitais || {};
    drawSection(doc, 'Sinais Vitais', [
      `Temperatura: ${sv.temperatura || 'N/A'} °C`,
      `Pressão Arterial: ${sv.pressao || 'N/A'} mmHg`,
      `Frequência Cardíaca: ${sv.frequencia || 'N/A'} bpm`,
      `Saturação de Oxigênio: ${sv.saturacao || 'N/A'} %`,
    ]);

    // --- Sintomas ---
    const s = triage.sintomas || {};
    const sintomasList = Object.entries(s)
        .filter(([, value]) => value === true)
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
    if(s.outros) sintomasList.push(`Outros: ${s.outros}`);
    drawSection(doc, 'Sintomas', [
      `Queixa Principal: ${sintomasList.length > 0 ? sintomasList.join(', ') : 'N/A'}`,
      `Tempo dos Sintomas: ${triage.tempoSintomas || 'N/A'}`,
    ]);

    // --- Histórico Médico ---
    const h = dp.historico || {};
    const historicoList = Object.entries(h)
        .filter(([, value]) => value === true)
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
    drawSection(doc, 'Histórico Médico', [`Condições: ${historicoList.length > 0 ? historicoList.join(', ') : 'Nenhuma condição prévia'}`]);

    // --- Classificação & Atendimento ---
    const classif = triage.classificacao || {};
    const atend = triage.atendimentoInfo || {};
    drawSection(doc, 'Classificação e Atendimento', [
      `Classificação de Risco: ${classif.label || 'N/A'} (${classif.time || 'N/A'})`,
      `Senha: ${atend.senha || 'N/A'}`,
      `Sala: ${atend.sala || 'N/A'}`,
      `Médico(a): ${atend.medicoId?.nome || 'N/A'}`,
    ]);

    // --- Data da Triagem ---
    drawSection(doc, 'Data da Triagem', [`Realizada em: ${formatarDataHora(triage.createdAt)}`]);

    // --- Rodapé ---
    doc.moveDown(2).fontSize(10).fillColor(brandColors.accent).text('© 2025 EZHealth - Todos os direitos reservados', { align: 'center' });
    doc.end();

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}