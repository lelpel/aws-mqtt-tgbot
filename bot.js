const Telegraf = require("telegraf");
const bot = new Telegraf(process.env.TOKEN);

bot.start(({ reply, message }) => {
  reply(`Hello, ${message.from.username}`);
});

bot.command("get", Telegraf.reply("/get"));

bot.launch();
