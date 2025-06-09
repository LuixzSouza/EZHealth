// ✅ PASSO 1: CRIE ESTE NOVO ARQUIVO EM:
// pages/api/upload.js

// Esta é uma API de simulação. Em um projeto real, você usaria uma
// biblioteca como 'multer' e um serviço como Vercel Blob, Cloudinary ou S3
// para processar e salvar o arquivo de verdade.

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Simula um tempo de processamento de 1.5 segundos
    setTimeout(() => {
      // Em uma implementação real, o 'req' conteria os dados do arquivo.
      // Você o salvaria e obteria a URL pública dele.
      
      // Aqui, apenas retornamos uma URL de avatar de placeholder como sucesso.
      const simulatedUrl = `https://placehold.co/400x400/2563eb/white?text=Dr.`;
      
      res.status(200).json({ success: true, url: simulatedUrl });
    }, 1500);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Configuração para dizer ao Next.js que esta rota lida com dados de formulário
export const config = {
  api: {
    bodyParser: false,
  },
};
