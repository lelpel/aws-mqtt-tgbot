const Telegraf = require("telegraf");
require("dotenv").config();
const AWSHelper = require("./aws");

const config = require("./config.js");

const bot = new Telegraf(process.env.TOKEN);

const aws = new AWSHelper((topic, message) => {
  Telegraf.reply(`Topic: ${topic}, message: ${message}`);
});

bot.start(({ reply, message }) => {
  reply(`Hello, ${message.from.username}`);
});

bot.on("message", ctx => {
  Telegraf.reply(ctx.message);
  console.log(ctx.message);
  aws.publish(ctx.message.text, "test");
});

bot.hears("sub", ({ reply }) => {
  console.log("tries subscribe from bot");
  reply("tries sub");
  aws.subscribe(config.test.topic, () => reply("Ошибка при подписке"));
  console.log("subscribed from bot");
  reply("subbd");
});
bot.hears("restart", ({ reply, message }) => {
  reply(`Hello, ${message.from.username}`);
});

bot.command("sub", ({ reply }) => {
  console.log("tries subscribe from bot");
  reply("tries sub");
  aws.subscribe(config.test.topic, () => reply("Ошибка при подписке"));
  console.log("subscribed from bot");
  reply("subbd");
});

bot.command("get", Telegraf.reply("Ну нажал ты кнопку дальше что"));

bot.launch();
