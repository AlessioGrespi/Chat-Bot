const chatContent = document.getElementById('chatContent');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

sendButton.addEventListener('click', () => {
  (async () => {
    const message = userInput.value.trim();
    if (message === '') return;

    addUserMessage(message);
    userInput.value = '';

    const response = await sendToChatGPT(message);
    addBotMessage(response);
  })();
});

let conversationHistory = '';

async function sendToChatGPT(message) {
  const apiKey = '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';
  const model = "gpt-3.5-turbo";
  const url = `https://api.openai.com/v1/chat/completions`;

  const messages = [
    {role: "system", content: "You are a helpful assistant."},
    {role: "user", content: message}
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      max_tokens: 150,
      temperature: 0.9,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
    }),
  });

  if (!response.ok) {
    console.error("API error:", response.status, response.statusText);
    return "";
  }

  const data = await response.json();

  console.log("API response data:", data);

  if (!data.choices || data.choices.length === 0) {
    console.error("No choices returned from the API.");
    return "";
  }

  const reply = data.choices[0].message.content.trim();
  return reply;
}

function addUserMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('user-message');
  messageElement.textContent = `You: ${message}`;
  chatContent.appendChild(messageElement);
  chatContent.scrollTop = chatContent.scrollHeight;
}

function addBotMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('bot-message');
  messageElement.textContent = `ChatGPT: ${message}`;
  chatContent.appendChild(messageElement);
  chatContent.scrollTop = chatContent.scrollHeight;
}
