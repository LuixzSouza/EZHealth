import { MongoClient, ObjectId } from 'mongodb';
import PDFDocument from 'pdfkit';

// --- Configuração da conexão com o MongoDB ---
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ezhealth_db';

let clientPromise;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromiseGenerateReport) {
    const client = new MongoClient(uri);
    global._mongoClientPromiseGenerateReport = client.connect();
  }
  clientPromise = global._mongoClientPromiseGenerateReport;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

// --- Formata data+hota no padrão pt-BR ---
function formatarDataHora(data) {
  if (!data) return 'N/A';
  const d = new Date(data);
  return (
    d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' +
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );
}

// --- Desenha cada seção com título sublinhado e linhas ---
function drawSection(doc, title, items = []) {
  doc
    .moveDown(0.5)
    .fontSize(14)
    .fillColor('#000000')
    .text(title, { underline: true });

  doc.moveDown(0.3).fontSize(12).fillColor('#333333');
  items.forEach((line) => {
    doc.text(line);
  });
  doc.moveDown(0.8);
}

export default async function handler(req, res) {
  if (req.method !== 'GET' || !req.query.id) {
    return res
      .status(405)
      .json({ sucesso: false, erro: 'Método não permitido ou ID da triagem ausente.' });
  }

  try {
    // 1. Aguarda a conexão e atribui ao clientConn
    const clientConn = await clientPromise;
    const db = clientConn.db(dbName);
    const collection = db.collection('triagens');

    // 2. Busca a triagem pelo ID
    let triagem;
    try {
      triagem = await collection.findOne({ _id: new ObjectId(req.query.id) });
    } catch (err) {
      console.error('Erro ao converter ID ou buscar triagem:', err);
      return res.status(400).json({ sucesso: false, erro: 'ID da triagem inválido.' });
    }

    if (!triagem) {
      return res.status(404).json({ sucesso: false, erro: 'Triagem não encontrada.' });
    }

    // 3. Prepara os cabeçalhos para download de PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=relatorio-triagem-${triagem._id}.pdf`
    );

    // 4. Cria o documento PDF
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.pipe(res);

    // --- Cabeçalho ---
    doc
      .fontSize(28)
      .fillColor('#2E86C1')
      .text('EZHealth', { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(18)
      .fillColor('#34495E')
      .text('Relatório de Triagem', { align: 'center' })
      .moveDown(1.5);

    // --- Dados Pessoais ---
    const dadosPessoais = [];
    const dp = triagem.dadosPessoalPaciente || {};
    dadosPessoais.push(`Nome: ${dp.nome || 'N/A'}`);
    dadosPessoais.push(`Data de Nascimento: ${dp.dataNascimento || 'N/A'}`);
    dadosPessoais.push(`Idade: ${dp.idade || 'N/A'}`);
    dadosPessoais.push(`CPF: ${dp.cpf || 'N/A'}`);
    dadosPessoais.push(`Telefone: ${dp.telefone || 'N/A'}`);
    dadosPessoais.push(`Sexo: ${dp.sexo || 'N/A'}`);
    dadosPessoais.push(
      `Convênio: ${dp.temConvenio && dp.temConvenio.toLowerCase() === 'sim' ? 'Sim' : 'Não'}`
    );
    drawSection(doc, 'Dados Pessoais', dadosPessoais);

    // --- Sinais Vitais ---
    const sv = triagem.sinaisVitais || {};
    const sinaisVitais = [];
    sinaisVitais.push(`Temperatura: ${sv.temperatura || 'N/A'} °C`);
    sinaisVitais.push(`Pressão Arterial: ${sv.pressao || 'N/A'} mmHg`);
    sinaisVitais.push(`Frequência Cardíaca: ${sv.frequencia || 'N/A'} bpm`);
    sinaisVitais.push(`Saturação de Oxigênio: ${sv.saturacao || 'N/A'} %`);
    drawSection(doc, 'Sinais Vitais', sinaisVitais);

    // --- Sintomas ---
    const sintomasList = [];
    const s = triagem.sintomas || {};
    if (s.febre) sintomasList.push('Febre');
    if (s.dorCabeca) sintomasList.push('Dor de cabeça');
    if (s.dorPeito) sintomasList.push('Dor no peito');
    if (s.faltaAr) sintomasList.push('Falta de ar');
    if (s.tontura) sintomasList.push('Tontura');
    if (s.nauseaVomito) sintomasList.push('Náusea/Vômito');
    if (s.tosse) sintomasList.push('Tosse');
    if (s.outros) sintomasList.push(`Outros: ${s.outros}`);

    const sintomasDetalhes = triagem.sintomasDetalhes || {};
    const sintomasSection = [
      `Queixa Principal: ${sintomasList.length > 0 ? sintomasList.join(', ') : 'N/A'}`,
      `Tempo dos Sintomas: ${sintomasDetalhes.tempoSintomas || 'N/A'}`,
    ];
    drawSection(doc, 'Sintomas', sintomasSection);

    // --- Histórico Médico ---
    const historicoList = [];
    const h = triagem.historico || {};
    if (h.hipertensao) historicoList.push('Hipertensão');
    if (h.diabetes) historicoList.push('Diabetes');
    if (h.cardiaco) historicoList.push('Doenças cardíacas');
    if (h.respiratorio) historicoList.push('Doenças respiratórias');
    if (h.alergias) historicoList.push('Alergias importantes');
    if (h.gravidez) historicoList.push('Gravidez');
    if (h.nenhuma) historicoList.push('Nenhuma das anteriores');
    drawSection(doc, 'Histórico Médico', [
      `Condições: ${historicoList.length > 0 ? historicoList.join(', ') : 'N/A'}`,
    ]);

    // --- Uso de Medicamentos ---
    const medList = [];
    const med = triagem.medicamentos || {};
    medList.push(`Usa Medicamento Contínuo: ${med.usaMedicamento === 'sim' ? 'Sim' : 'Não'}`);
    if (med.usaMedicamento === 'sim' && med.quaisMedicamentos) {
      medList.push(`Quais: ${med.quaisMedicamentos}`);
    }
    drawSection(doc, 'Uso de Medicamentos', medList);

    // --- Classificação de Risco & Atendimento ---
    const classif = triagem.classificacaoRisco || {};
    const atend = triagem.atendimentoInfo || {};
    const classificacaoSection = [
      `Classificação de Risco: ${classif.label || 'N/A'} (${classif.time || 'N/A'})`,
      `Senha: ${atend.senha || 'N/A'}`,
      `Sala: ${atend.sala || 'N/A'}`,
      `Médico(a): ${atend.medico?.nome || 'N/A'}`,
    ];
    drawSection(doc, 'Classificação e Atendimento', classificacaoSection);

    // --- Data da Triagem ---
    drawSection(doc, 'Data da Triagem', [
      `Realizada em: ${formatarDataHora(triagem.createdAt)}`,
    ]);

    // --- Rodapé ---
    doc
      .moveDown(2)
      .fontSize(10)
      .fillColor('#7F8C8D')
      .text('© 2025 EZHealth - Todos os direitos reservados', {
        align: 'center',
      });

    doc.end();
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).json({ sucesso: false, erro: error.message });
  }
}
