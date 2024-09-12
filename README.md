# CONVERSAI

CONVERSAI is a lightweight web-based chatbot application that integrates with the GPT-4.2 API from RapidAPI. It allows users to engage in conversations with an AI, start new chats, and toggle between light and dark themes.

## Features

- **Chatbot Integration**: Interacts with the GPT-4.2 API to generate AI-driven responses.
- **Conversation History**: Stores and loads previous conversations using `localStorage`.
- **Theme Toggle**: Switch between light and dark modes.
- **New Chat Creation**: Allows users to start new conversations.
- **Simple UI**: Clean, user-friendly interface with a sidebar to manage conversations.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Surya-KF/CONVERSAI.git
   cd CONVERSAI
   ```

2. Update the `config.js` file with your own RapidAPI credentials:
   ```javascript
   const config = {
       apiUrl: 'https://chatgpt-42.p.rapidapi.com/conversationgpt4-2',
       apiKey: 'your-rapidapi-key-here',
       apiHost: 'chatgpt-42.p.rapidapi.com'
   };
   ```

3. Run the application:
   - Open the `index.html` file in your browser.

## File Overview

- **`index.html`**: The main HTML file containing the structure of the chat application. It includes references to external styles and scripts, and it sets up the user interface for the chatbot【7†source】.
  
- **`config.js`**: Contains the configuration settings for the GPT-4.2 API, including the API endpoint and keys【6†source】.
  
- **`script.js`**: Implements the logic for the chat application. It manages chat conversations, API requests, theming, and saving data to local storage. Key functions include sending messages, toggling the theme, and managing conversation history【8†source】.

## Usage

1. Type a message into the chat box and hit "Send" or press `Enter`.
2. The bot will respond using the GPT-4.2 API.
3. Start a new conversation by clicking the "New Chat" button.
4. Toggle between dark and light themes using the switch in the header.

## Requirements

- A browser with JavaScript enabled.
- An active internet connection.
- A valid RapidAPI key for the GPT-4.2 API.

## Customization

You can modify the behavior of the chatbot by adjusting the request parameters in `script.js`:
```javascript
{
    temperature: 0.9,
    top_k: 5,
    top_p: 0.9,
    max_tokens: 256,
    web_access: false
}
```
These parameters control the creativity, response length, and the bot's behavior.

## License

This project is licensed under the MIT License.
