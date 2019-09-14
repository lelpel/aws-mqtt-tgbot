require("dotenv").config();

const Telegraf = require("telegraf");
const commandParts = require("telegraf-command-parts");

/**
 * Token obtained from bot father
 */
const bot = new Telegraf(process.env.TOKEN);
bot.use(commandParts());

const AwsMqtt = require("./aws");

const aws = new AwsMqtt((topic, message) => {
  //on message recieved
  bot.telegram.sendMessage(chatId, `Topic: ${topic}, message: ${message}`);
  console.log(`Topic: ${topic}, message: ${message}`);
});

// BOT LIFECYCLE

/**
 * Handles bot's start. Replies with user's telegram @-handle
 */
bot.start(({ reply, message }) => {
  reply(`Hello, ${message.from.username}`);
});

let chatId; //stores current chat id to forward messages from AWS Server

/**
 * Handles subscription command, i.e. "/sub topic"
 *
 * Subscribes to default topic if user's topic is not defined
 * Replies with success/error message after subscription
 */
bot.command("sub", ({ reply, state, message }) => {
  const args = state.command.splitArgs;
  const topic = args
    ? state.command.splitArgs.join(" ")
    : require("./config").test.topic;

  aws.subscribe(topic, (error, granted) =>
    granted
      ? reply(`Successfully subscribed to topic **${topic}**`)
      : reply(`Error subscribing to topic **${topic}**, errmsg: ${error}`)
  );

  chatId = message.chat.id;
});

/**
 * Handles message sending command, i.e. "/send topic;message"
 *
 * Replies with sent message
 */
bot.command("send", ({ reply, state }) => {
  const [topic, message] = state.command.args.split(";");
  aws.publish(message, topic);
  reply(`Sent. Topic **${topic}**, message: __${message}__`);
});

/**
 * Checks if bot works
 */
bot.command("heartbeat", ({ reply, message }) => {
  reply(`Hello, ${message.from.username}`);
});

bot.launch();
