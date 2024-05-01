const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN || "";

const bot = new TelegramBot(token, {polling: true});

const lastReplyed = {};

bot.on("message", (msg) => {
  if (msg.text == "/lastreply" || msg.text == "/lastreply@reply_checker_bot") {
    if (lastReplyed[msg.chat.id][msg.from.id]) {
      sendTempMsg(msg.chat.id, "☝️😉", {reply_to_message_id: lastReplyed[msg.chat.id][msg.from.id]});
    }
    else {
      sendTempMsg(msg.chat.id, "Você não tem uma mensagem respondida");
    }
    return;
  }
  if (msg.reply_to_message && msg.reply_to_message.from.id !== msg.from.id) {
    lastReplyed[msg.chat.id][msg.from.id] = msg.message_id;
    return;
  }
});

function sendTempMsg(chatId, text, options) {
  bot.sendMessage(chatId, text, options)
      .then((sent) => {
        setTimeout(() => {
          bot.deleteMessage(chatId, sent.message_id);
        }, 5000);
      })
      .catch(() => {});
}