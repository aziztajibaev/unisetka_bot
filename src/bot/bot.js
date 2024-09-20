const config = require('../config/config.js');  // Adjust the path as per your project structure
const TelegramBot = require('node-telegram-bot-api');
const { Pool } = require('pg');

// Create bot instance using the token from config
const bot = new TelegramBot(config.TELEGRAM_TOKEN, { polling: true });

// PostgreSQL connection setup using config variables
const pool = new Pool( config.DB_CONFIG );

// Example bot command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Welcome to the bot!');
});

// Sample database query
bot.on('message', async (msg) => {
  if (msg.text === '/getusers') {
    const res = await pool.query('SELECT * FROM users');
    bot.sendMessage(msg.chat.id, `Users: ${JSON.stringify(res.rows)}`);
  }
});

console.log('Bot ishlayabdi.......')
