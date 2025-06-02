// pages/api/dialogflow.js (para Pages Router)
// ou app/api/dialogflow/route.js (para App Router)

import dialogflow from '@google-cloud/dialogflow';

export default async function handler(req, res) {
  // Garante que apenas requisições POST sejam aceitas
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Extrai a mensagem e o ID da sessão do corpo da requisição
  const { message, sessionId } = req.body;

  // Verifica se a mensagem foi fornecida
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Verifica se o ID do projeto do Dialogflow está definido nas variáveis de ambiente
  const projectId = process.env.DIALOGFLOW_PROJECT_ID;
  if (!projectId) {
    console.error('ERROR: DIALOGFLOW_PROJECT_ID not set.');
    return res.status(500).json({ error: 'Dialogflow Project ID not configured.' });
  }

  // Verifica se as credenciais do Google estão definidas nas variáveis de ambiente
  const googleCredentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!googleCredentialsJson) {
    console.error('ERROR: GOOGLE_APPLICATION_CREDENTIALS not set.');
    return res.status(500).json({ error: 'Google Application Credentials not configured.' });
  }

  let credentials;
  try {
    // Tenta fazer o parse do JSON das credenciais.
    // Se a variável de ambiente não for um JSON válido, isso causará um erro.
    credentials = JSON.parse(googleCredentialsJson);
  } catch (parseError) {
    console.error('ERROR: Failed to parse GOOGLE_APPLICATION_CREDENTIALS JSON:', parseError);
    return res.status(500).json({ error: 'Invalid Google Application Credentials format.' });
  }

  // Inicializa o cliente de sessão do Dialogflow, passando as credenciais explicitamente.
  // A biblioteca @google-cloud/dialogflow espera 'client_email' e 'private_key'
  // quando as credenciais são passadas diretamente.
  const sessionClient = new dialogflow.SessionsClient({
    projectId: projectId, // Opcional aqui, mas bom para clareza
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
  });

  // Constrói o caminho completo da sessão
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  // Prepara a requisição para detectar a intenção do usuário
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'pt-BR', // Certifique-se de que a linguagem esteja correta
      },
    },
  };

  try {
    // Chama a API do Dialogflow para detectar a intenção
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    // Retorna a resposta do Dialogflow para o frontend
    res.status(200).json({
      fulfillmentText: result.fulfillmentText,
      intentDisplayName: result.intent.displayName,
      // Você pode incluir mais dados aqui, como parâmetros, etc.
    });
  } catch (error) {
    // Captura e loga qualquer erro que ocorra durante a comunicação com o Dialogflow
    console.error('ERROR communicating with Dialogflow:', error);
    // Retorna um erro 500 para o frontend
    res.status(500).json({ error: 'Erro ao se comunicar com o Dialogflow.' });
  }
}