const Telegraf = require('telegraf');
const Core = require('./lib/core');

const bot = new Telegraf(process.env.BOT_TOKEN);

new Core(bot);

bot.launch();
console.log('Launch bot');
