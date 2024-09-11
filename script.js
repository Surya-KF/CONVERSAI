const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', role.toLowerCase());
    messageDiv.innerHTML = `<strong>${role}:</strong> ${content}`;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessage('User', message);
        userInput.value = '';

        const url = config.apiUrl; // Use config from config.js
        const options = {
            method: 'POST',
            headers: {
                'X-RapidAPI-Key': config.apiKey, // Use config.apiKey
                'X-RapidAPI-Host': config.apiHost, // Use config.apiHost
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'user',
                        content: message
                    }
                ],
                system_prompt: '',
                temperature: 0.9,
                top_k: 5,
                top_p: 0.9,
                max_tokens: 256,
                web_access: false
            })
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            const botReply = result.result || "Sorry, I didn't understand that.";
            addMessage('Bot', botReply);
        } catch (error) {
            console.error('Error:', error);
            addMessage('Bot', 'Sorry, I encountered an error. Please try again.');
        }
    }
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});