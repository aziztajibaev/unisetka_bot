// const TelegramBot = require('node-telegram-bot-api');

// const token = '7869921904:AAF-lj7oUs4AaO4UcS8K7x32hzCGTwFgHAg'; // Replace with your own bot token
// const bot = new TelegramBot(token, { polling: true });
const express = require('express');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const port = 3000;

// Replace with your actual Telegram bot token
const TOKEN = '7869921904:AAF-lj7oUs4AaO4UcS8K7x32hzCGTwFgHAg';
// Replace with the URL of your hosted HTML file
const WEB_APP_URL = `https://tgbot-erp-aziz.greenwhite.uz/index.html`;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '/')));

// Start the server
app.listen(port, () => {
    console.log(`Server running at https://tgbot-erp-aziz.greenwhite.uz`);
});

/// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(TOKEN, { polling: true });

// Define a custom keyboard with a button
const customKeyboard = [
    [{ text: 'Open Web App', web_app: { url: WEB_APP_URL } }],
    [{ text: 'Share Contact', request_contact: true }]
];

const keyboardOptions = {
    reply_markup: {
        keyboard: customKeyboard,
        resize_keyboard: true,
        one_time_keyboard: true
    }
};

// Listen for the /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    bot.sendMessage(chatId, 'Click the button below to open the web app:', keyboardOptions);
});

bot.on('contact', (msg) => {
    const chatId = msg.chat.id;
    const contact = msg.contact;
    
    if (contact) {
        bot.sendMessage(chatId, `Contact shared:\nName: ${contact.first_name} ${contact.last_name}\nPhone: ${contact.phone_number}`);
    }
});