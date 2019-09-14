const Telegraf = require("telegraf");
require("dotenv").config();
const AWSHelper = require("./aws");
const config = require("./config.js");
const publishMiddleware = require("./middlewares").publishMiddleware;
const bot = new Telegraf(process.env.TOKEN2);
const commandParts = require("telegraf-command-parts");

let chatId;

const mw = (topic, message) => {
  console.log(message);
  console.log(`Topic: ${topic}, message: ${message}`);
  bot.telegram.sendMessage(chatId, `Topic: ${topic}, message: ${message}`);
};

const aws = new AWSHelper(mw);

bot.use(commandParts());

//вот это работает
bot.start(({ reply, message }) => {
  reply(`Hello, ${message.from.username}`);
});

//вот это работает
// bot.on("message", ctx => {
//   ctx.reply(`I got your msg: ${ctx.message.text}`);
//   console.log(ctx.message);
//   aws.publish(ctx.message.text, "test");
// });

bot.hears("restart", ({ reply, message }) => {
  reply(`Hello, ${message.from.username}`);
});

bot.command("sub", ({ reply, state, message }) => {
  const args = state.command.splitArgs;
  const topic = args ? state.command.splitArgs.join(" ") : config.test.topic;

  aws.subscribe(config.test.topic, () => reply("Ошибка при подписке"));
  reply(`Successfully subscribed to topic ${config.test.topic}`);
  chatId = message.chat.id;
});

bot.command("send", ({ reply, state }) => {
  const [topic, message] = state.command.args.split(";");
  aws.publish(message, topic);
  reply(`Sent. Topic ${topic}, message: ${message}`);
});

bot.command("heartbeat", ({ reply, message }) => {
  reply(`Hello, ${message.from.username}`);
});

// bot.on("text", ctx => {
//   ctx.reply(`I got your msg: ${ctx.message.text}`);
//   aws.publish(ctx.message.text);
// });

bot.launch();
