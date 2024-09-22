require('dotenv').config();  // Load environment variables from a .env file

module.exports = {
    // Telegram Bot API Token
    TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN || 'your-telegram-token-here',

    // PostgreSQL Database Configuration
    DB_CONFIG: {
        user: process.env.DB_USER || 'your-db-username',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'your-database-name',
        password: process.env.DB_PASSWORD || 'your-db-password',
        port: process.env.DB_PORT || 5432,
    },

    // Additional Settings for Your App
    ADMIN_PHONE: process.env.ADMIN_PHONE || '+1234567890',  // Example: Admin's phone number for notifications
    BOT_URL: process.env.BOT_URL || 'http://localhost:3000',
    LANG_DEFAULT: process.env.LANG_DEFAULT || 'en',  // Default language setting

    // Production or Development mode
    NODE_ENV: process.env.NODE_ENV || 'development',
    WEB_APP_URL: process.env.WEB_APP_URL
};
