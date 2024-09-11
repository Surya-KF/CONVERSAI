const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const newChatButton = document.getElementById('new-chat');
const conversationList = document.getElementById('conversation-list');
const themeToggle = document.getElementById('theme-toggle-checkbox');

let currentConversationId = null;
let conversations = {};

function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${role.toLowerCase()}-message`);
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Save message to current conversation
    if (currentConversationId) {
        conversations[currentConversationId].messages.push({ role, content });
        saveConversations();
    }
}

function startNewConversation() {
    currentConversationId = Date.now().toString();
    chatMessages.innerHTML = '';
    conversations[currentConversationId] = {
        id: currentConversationId,
        title: `Conversation ${currentConversationId}`,
        messages: []
    };
    addConversationToSidebar(currentConversationId);
    saveConversations();
    updateActiveConversation();
}

function addConversationToSidebar(id) {
    const conversationDiv = document.createElement('div');
    conversationDiv.classList.add('conversation-item');
    conversationDiv.dataset.id = id;

    const titleSpan = document.createElement('span');
    titleSpan.textContent = conversations[id].title;
    titleSpan.addEventListener('click', () => loadConversation(id));

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteConversation(id);
    });

    conversationDiv.appendChild(titleSpan);
    conversationDiv.appendChild(deleteButton);
    conversationList.prepend(conversationDiv);
}

function loadConversation(id) {
    currentConversationId = id;
    chatMessages.innerHTML = '';
    conversations[id].messages.forEach(msg => addMessage(msg.role, msg.content));
    updateActiveConversation();
}

function updateActiveConversation() {
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.toggle('active', item.dataset.id === currentConversationId);
    });
}

function deleteConversation(id) {
    if (confirm('Are you sure you want to delete this conversation?')) {
        delete conversations[id];
        saveConversations();
        const conversationDiv = document.querySelector(`.conversation-item[data-id="${id}"]`);
        if (conversationDiv) {
            conversationDiv.remove();
        }
        if (currentConversationId === id) {
            const nextConversation = Object.keys(conversations)[0];
            if (nextConversation) {
                loadConversation(nextConversation);
            } else {
                startNewConversation();
            }
        }
    }
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
    saveTheme();
}

function saveConversations() {
    localStorage.setItem('conversations', JSON.stringify(conversations));
}

function loadConversations() {
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
        conversations = JSON.parse(savedConversations);
        Object.keys(conversations).forEach(id => addConversationToSidebar(id));
    }
}

function saveTheme() {
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.checked = true;
    }
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

// Adjust textarea height based on content
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Load saved conversations and theme on page load
window.addEventListener('load', () => {
    loadConversations();
    loadTheme();
    if (Object.keys(conversations).length === 0) {
        startNewConversation();
    } else {
        loadConversation(Object.keys(conversations)[0]);
    }
});