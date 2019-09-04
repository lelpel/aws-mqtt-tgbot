const Telegraf = require("telegraf");
require("dotenv").config();
const AWSHelper = require("./aws");

const config = require("./config.json");
const { credentials, endpoint, clientId, will } = config;

const bot = new Telegraf(process.env.TOKEN);

const aws = new AWSHelper((topic, message) => {
  Telegraf.reply(`Topic: ${topic}, message: ${message}`);
});

bot.start(({ reply, message }) => {
  reply(`Hello, ${message.from.username}`);
});

bot.on("message", ctx => {
  aws.publishLambda(ctx.message);
});
// bot.hears("restart", ({ reply, message }) => {
//   reply(`Hello, ${message.from.username}`);
// });

bot.command("subscribe", ({ reply }) => {
  aws.subscribe("test3", () => reply("Ошибка при подписке"));
});

bot.command("get", Telegraf.reply("Ну нажал ты кнопку дальше что"));

bot.launch();
