const TelegramBot = require('node-telegram-bot-api');
const token = process.env.API_TOKEN || "";

const bot = new TelegramBot(token, {polling: true});

const lastReplyed = {};

bot.on("message", (msg) => {
  if (msg.text == "/lastreply" || msg.text == "/lastreply@reply_checker_bot") {
    bot.deleteMessage(msg.chat.id, msg.message_id);
    if (lastReplyed[msg.chat.id] && lastReplyed[msg.chat.id][msg.from.id]) {
      sendTempMsg(msg.chat.id, "reply:☝️😉", {reply_to_message_id: lastReplyed[msg.chat.id][msg.from.id]});
    }
    else {
      sendTempMsg(msg.chat.id, "Você não tem uma mensagem respondida");
    }
    return;
  }
  if (msg.reply_to_message && msg.reply_to_message.from.id !== msg.from.id) {
    if (!lastReplyed[msg.chat.id]) {
      lastReplyed[msg.chat.id] = {};
    }
    lastReplyed[msg.chat.id][msg.from.id] = msg.reply_to_message.message_id;
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

var http = require('http');
http.createServer((req, res) => res.end()).listen(8080);