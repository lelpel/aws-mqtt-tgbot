require("dotenv").config();

const AwsMqttClient = require("./aws");

const Telegraf = require("telegraf");
const commandParts = require("telegraf-command-parts");
const bot = new Telegraf(process.env.TOKEN2);
bot.use(commandParts());

let chatId;

const aws = new AwsMqttClient((topic, message) => {
  console.log(message);
  console.log(`Topic: ${topic}, message: ${message}`);
  bot.telegram.sendMessage(chatId, `Topic: ${topic}, message: ${message}`);
});

bot.start(({ reply, message }) => {
  reply(`Hello, ${message.from.username}`);
});

bot.command("sub", ({ reply, state, message }) => {
  const args = state.command.splitArgs;
  const topic = args
    ? state.command.splitArgs.join(" ")
    : require("./config").test.topic;

  aws.subscribe(topic, (error, granted) =>
    granted
      ? reply(`Successfully subscribed to topic ${topic}`)
      : reply(`Error subscribing to topic ${topic}, errmsg: ${error}`)
  );

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

bot.launch();
