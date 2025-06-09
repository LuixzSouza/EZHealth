// pages/api/generate-report.js (VERSÃO REATORADA COM MONGOOSE)

import connectDB from '@/lib/mongodb';
import Triage from '@/models/Triage';
// Os modelos Patient e Doctor são usados implicitamente pelo .populate()
import PDFDocument from 'pdfkit';

// --- Funções Auxiliares (sem alterações) ---
function formatarDataHora(data) {
  if (!data) return 'N/A';
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
         ' ' +
         d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function drawSection(doc, title, items = []) {
  doc.moveDown(0.5).fontSize(14).fillColor('#000000').text(title, { underline: true });
  doc.moveDown(0.3).fontSize(12).fillColor('#333333');
  items.forEach((line) => {
    if(line) doc.text(line); // Adicionado para evitar linhas vazias
  });
  doc.moveDown(0.8);
}

export default async function handler(req, res) {
  if (req.method !== 'GET' || !req.query.id) {
    return res.status(405).json({ success: false, message: 'Método não permitido ou ID da triagem ausente.' });
  }

  try {
    await connectDB();

    // ANTES: collection.findOne({ _id: new ObjectId(req.query.id) })
    // DEPOIS: Usamos Triage.findById() e populamos os dados referenciados.
    const triage = await Triage.findById(req.query.id)
                               .populate('patientId') // Busca todos os dados do paciente
                               .populate('atendimentoInfo.medicoId', 'nome'); // Busca o nome do médico

    if (!triage) {
      return res.status(404).json({ success: false, message: 'Triagem não encontrada.' });
    }

    // --- Geração do PDF (a lógica do pdfkit permanece, mas as fontes de dados mudam) ---
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio-triagem-${triage._id}.pdf`);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.pipe(res);

    // --- Cabeçalho ---
    doc.fontSize(28).fillColor('#2E86C1').text('EZHealth', { align: 'center' }).moveDown(0.5);
    doc.fontSize(18).fillColor('#34495E').text('Relatório de Triagem', { align: 'center' }).moveDown(1.5);
    
    // --- Dados Pessoais (usando dados populados de `patientId`) ---
    const dp = triage.patientId || {}; // `dp` agora é o documento do paciente
    const dadosPessoais = [
      `Nome: ${dp.nome || 'N/A'}`,
      dp.dataNascimento ? `Data de Nascimento: ${new Date(dp.dataNascimento).toLocaleDateString('pt-BR')}` : null,
      `CPF: ${dp.cpf || 'N/A'}`,
      `Telefone: ${dp.telefone || 'N/A'}`,
      `Sexo: ${dp.sexo || 'N/A'}`,
      `Convênio: ${dp.temConvenio ? 'Sim' : 'Não'}`
    ];
    drawSection(doc, 'Dados Pessoais', dadosPessoais);
    
    // --- Sinais Vitais (estrutura antiga mantida, pois está embutida) ---
    const sv = triage.sinaisVitais || {};
    drawSection(doc, 'Sinais Vitais', [
      `Temperatura: ${sv.temperatura || 'N/A'} °C`,
      `Pressão Arterial: ${sv.pressao || 'N/A'} mmHg`,
      `Frequência Cardíaca: ${sv.frequencia || 'N/A'} bpm`,
      `Saturação de Oxigênio: ${sv.saturacao || 'N/A'} %`,
    ]);

    // --- Sintomas (estrutura antiga mantida, pois está embutida) ---
    const s = triage.sintomas || {};
    const sintomasList = Object.entries(s)
        .filter(([, value]) => value === true)
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())); // Formata o nome do sintoma
    if(s.outros) sintomasList.push(`Outros: ${s.outros}`);
    drawSection(doc, 'Sintomas', [
      `Queixa Principal: ${sintomasList.length > 0 ? sintomasList.join(', ') : 'N/A'}`,
      `Tempo dos Sintomas: ${triage.tempoSintomas || 'N/A'}`,
    ]);

    // --- Histórico Médico (usando dados de `patientId.historico`) ---
    const h = dp.historico || {}; // Usando o histórico do paciente
    const historicoList = Object.entries(h)
        .filter(([, value]) => value === true)
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
    drawSection(doc, 'Histórico Médico', [`Condições: ${historicoList.length > 0 ? historicoList.join(', ') : 'Nenhuma condição prévia'}`]);

    // --- Classificação & Atendimento (usando dados de `atendimentoInfo` populados) ---
    const classif = triage.classificacao || {};
    const atend = triage.atendimentoInfo || {};
    drawSection(doc, 'Classificação e Atendimento', [
      `Classificação de Risco: ${classif.label || 'N/A'} (${classif.time || 'N/A'})`,
      `Senha: ${atend.senha || 'N/A'}`,
      `Sala: ${atend.sala || 'N/A'}`,
      `Médico(a): ${atend.medicoId?.nome || 'N/A'}`, // Acesso ao nome do médico populado
    ]);

    drawSection(doc, 'Data da Triagem', [`Realizada em: ${formatarDataHora(triage.createdAt)}`]);
    doc.moveDown(2).fontSize(10).fillColor('#7F8C8D').text('© 2025 EZHealth - Todos os direitos reservados', { align: 'center' });
    doc.end();

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}
