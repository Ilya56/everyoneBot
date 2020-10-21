const Telegraf = require('telegraf');
const Core = require('./lib/core');

const bot = new Telegraf('1399468616:AAHOmx4JLMR5TEksLsYLVsbtyvPu8frHfro');

new Core(bot);

bot.launch();
console.log('Launch bot');
