const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const newChatButton = document.getElementById('new-chat');
const conversationList = document.getElementById('conversation-list');
const themeToggle = document.getElementById('theme-toggle-checkbox');

let currentConversationId = null;

function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${role.toLowerCase()}-message`);
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function startNewConversation() {
    currentConversationId = Date.now();
    chatMessages.innerHTML = '';
    addConversationToSidebar(currentConversationId);
}

function addConversationToSidebar(id) {
    const conversationDiv = document.createElement('div');
    conversationDiv.textContent = `Conversation ${id}`;
    conversationDiv.classList.add('conversation-item');
    conversationList.prepend(conversationDiv);
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessage('user', message);
        userInput.value = '';

        const url = config.apiUrl;
        const options = {
            method: 'POST',
            headers: {
                'X-RapidAPI-Key': config.apiKey,
                'X-RapidAPI-Host': config.apiHost,
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
            addMessage('bot', botReply);
        } catch (error) {
            console.error('Error:', error);
            addMessage('bot', 'Sorry, I encountered an error. Please try again.');
        }
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

newChatButton.addEventListener('click', startNewConversation);
themeToggle.addEventListener('change', toggleTheme);

// Start with a new conversation
startNewConversation();

// Adjust textarea height based on content
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});