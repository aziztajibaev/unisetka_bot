const config = require('../config/config.js');
const TelegramBot = require('node-telegram-bot-api');
const User = require('../api/models/user'); // Adjust the path as needed
const util = require('./util'); // Adjust the path as needed

const bot = new TelegramBot(config.TELEGRAM_TOKEN, { polling: true });
const persons = new Map();
const personLang = new Map();
const admin = 1730392534;

async function initializePersonsMap() {
  const users = await User.findAll();
  users.forEach(user => {
    if (admin == user.chat_id) {
      user.is_admin = 'Y';
      user.password = 'admin';
    } 
    persons.set(Number(user.chat_id), user);
  });
}

// Call the initialization function
initializePersonsMap()
  .then(() => console.log('Persons map initialized successfully'))
  .catch(err => console.error('Failed to initialize persons map:', err));

function replyToMesage(msg) {
  const chatId = msg.chat.id;
  const text = msg.text  
  if(!text) return;

  let person = persons.get(chatId);
  
  if(text === '/admin' && person.menu_type !== 'ADMIN_MENU') {
    if (person && person.is_admin == 'Y') {
      bot.sendMessage(chatId, 'Parol kiriting:');
      person.menu_type = 'LOG_IN_ADMIN';
    } else {
      bot.sendMessage(chatId, 'Siz admin emasiz!');
    }
    return;
  }
  
  const langIndex = util.langs.indexOf(text);
  if (langIndex !== -1) {
    const langCode = util.langCodes[langIndex];
    
    if (persons.has(chatId)) {
      person = persons.get(chatId);
      person.lang = langCode;

      sendUserMenu(chatId, person);
    } else {
      sendContact(chatId, langCode);
    }

    return;
  }

  if (person.menu_type == 'LOG_IN_ADMIN') {
    if(text == person.password) {
      bot.sendMessage(chatId, 'Xafsizlik yuzasidan jo\'natgan parolingiz o\'chrildi.');
      sendAdminMenu(chatId, person);
    } else {
      bot.sendMessage(chatId, 'Xafsizlik yuzasidan jo\'natgan parolingiz o\'chrildi.');
      bot.sendMessage(chatId, 'Parol xato qaytadan kiriting:');
    }
    
    bot.deleteMessage(chatId, msg.message_id).catch(err => console.error('Failed to delete message:', err));
  }
}

async function sendContact(chatId, langCode) {
  personLang.set(chatId, langCode);
  const contactKeyboard = util.getContactReplyKeyboard();
  await bot.sendMessage(chatId, 'Iltimos, kontaktingizni yuboring:', contactKeyboard);
}

async function sendUserMenu(chatId, person) {
  const userMenuKeyboard = util.getUserMenuKeyboard();
  await bot.sendMessage(chatId, 'Buyurtma berishingiz mumkin.',  userMenuKeyboard)
  person.menu_type = 'USER_MENU';
}

async function sendAdminMenu(chatId, person) {
  const adminMenuKeyboard = util.getAdminMenuKeyboard();
  await bot.sendMessage(chatId, 'Siz Admin menusiga muvaffaqiyatli kirdingiz',  adminMenuKeyboard)
  person.menu_type = 'ADMIN_MENU';
}

async function sendUserRequestMenu(chatId, person) {
  const requestKeyboard = util.getRequestKeyboard();
  await bot.sendMessage(chatId, 'Sizda buyurtma berish uchun dostupingiz yo\'q, ruxsat olish uchun adminga murojat jo\'nating.', requestKeyboard);
  person.menu_type = 'USER_REQUEST'
}

async function replyContact(msg) {
  const chatId = msg.chat.id;
  const contact = msg.contact;
  

  if (contact) {
    const phoneNumber = contact.phone_number; 
    const name = contact.first_name || contact.last_name || "User";
    const username = msg.chat.username;   
    const langCode = personLang.get(chatId);

    const user = new User({
      chat_id: chatId,
      name: name,
      phone_number: phoneNumber,
      lang: langCode,
      username: username
    });

    if (admin == user.chat_id) {
      user.is_admin = 'Y';
      user.password = 'admin';
      user.status = 'A';
    } else {
      user.status = 'R';
    }

    try {
      await user.save();
      await bot.sendMessage(chatId, 'Your contact has been saved! 📝');
      
      persons.set(chatId, user);

      if (user.status == 'R') {
        sendUserRequestMenu(chatId, persons.get(chatId));
      } else {
        sendUserMenu(chatId, persons.get(chatId));  
      }
      
    } catch (error) {
      console.error('Failed to save user:', error);
      await bot.sendMessage(chatId, 'There was an error saving your contact. Please try again later. ❌');
    }
  } else {
    await bot.sendMessage(chatId, 'I didn\'t receive your contact. Please try again. 📞');
  }
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  
  if(msg.text == '/start') {
    bot.sendMessage(chatId, 'Tilni tanlang:', util.getLangReplyKeyboard());
  } else {
    replyToMesage(msg);    
  }
});

bot.on('contact', async (msg) => {
  replyContact(msg)
})

console.log('Bot ishlayabdi.......');

