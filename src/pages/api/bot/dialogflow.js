// pages/api/dialogflow.js (para Pages Router)
// ou app/api/dialogflow/route.js (para App Router)

import dialogflow from '@google-cloud/dialogflow';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { message, sessionId } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Defina o ID do projeto e o ID da sessão
  // O sessionId pode ser gerado no frontend (ex: um UUID) e persistido para a conversação
  // ou pode ser gerado aqui se você não precisa de sessões longas no frontend.
  const projectId = process.env.DIALOGFLOW_PROJECT_ID;
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

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
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.status(200).json({
      fulfillmentText: result.fulfillmentText,
      intentDisplayName: result.intent.displayName,
      // Você pode incluir mais dados aqui, como parâmetros, etc.
    });
  } catch (error) {
    console.error('ERROR:', error);
    res.status(500).json({ error: 'Erro ao se comunicar com o Dialogflow.' });
  }
}