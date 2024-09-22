const config = require('../config/config.js');
// constantas
const langs = ['🇺🇿 O\'zbekcha', '🇷🇺 Русский'];
const langCodes = ['UZ', 'RU'];
const order_web_app = `${config.WEB_APP_URL}/public/order.html`;
const user_web_app = `${config.WEB_APP_URL}/public/user.html`;
const reference_web_app = `${config.WEB_APP_URL}/public/referance.html`; // Ensure this matches your spelling
const setting_web_app = `${config.WEB_APP_URL}/public/setting.html`;

// functions 
const getLangReplyKeyboard = () => {
    return {
        reply_markup: {
        keyboard: [
            [{ text: langs[0] }, { text: langs[1] }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
        },
    };
};
  

const getContactReplyKeyboard = () => {
    return {
      reply_markup: {
        keyboard: [
          [
            {
              text: '📞 Kontaktingizni yuboring',
              request_contact: true
            }
          ]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };
};

const getUserMenuKeyboard = () => {
    return {
        reply_markup: {
            keyboard: [
            [
                { text: '🛒 Buyurtma berish', web_app: { url: order_web_app } }
            ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
        }
    }
}

const getAdminMenuKeyboard = () => {
    return {
        reply_markup: {
            keyboard: [
                [
                    { text: '🛒 Buyurtma berish', web_app: { url: order_web_app } }
                ],
                [
                    { text: '👥 Mijozlar', web_app: { url: user_web_app } },
                    { text: '🧱 Maxsulotlar', web_app: { url: reference_web_app } } 
                ],
                [
                    { text: '⚙️ Sozlamalar', web_app: { url: setting_web_app } },
                    { text: '🚪 Admin chiqish' } 
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
        }
    }
}

function getRequestKeyboard() {
    return {
        reply_markup: {
        keyboard: [
            [{ text: 'Murojat qoldirish' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
        },
    };
}

module.exports = {
    langs,
    langCodes,
    getLangReplyKeyboard,
    getContactReplyKeyboard,
    getRequestKeyboard,
    getUserMenuKeyboard,
    getAdminMenuKeyboard
};