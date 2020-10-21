const {Telegraf, Extra} = require('telegraf');
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

/**
 * Core class
 */
class Core {

  /**
   * Consctucts core of bot
   * @param {Telegraf} bot Telegraf instance
   */
  constructor(bot) {
    this.tags = ['everyone', 'all'];
    this.userTags = {};
    this.filename = 'save.json';

    this.initializeBot(bot);
    this.readUserTags();
  }

  /**
   * Initialize bot base functions
   * @param {Telegraf} bot Telegraf instance
   */
  initializeBot(bot) {
    bot.on('message', async ctx => {
      this.userTags[ctx.chat.id] = this.userTags[ctx.chat.id] || new Set();
      if (ctx.from.username) {
        this.userTags[ctx.chat.id].add(`@${ctx.from.username}`);
        this.saveUserTags();
      } else {
        this.userTags[ctx.chat.id].add(`[${ctx.from.first_name + (ctx.from.last_name ? ` ${ctx.from.last_name}` : '')}]` +
          `(tg://user?id=${ctx.from.id})`);
        this.saveUserTags();
      }
      if (ctx.message.text) {
        const tagAll = ctx.message.text.match(/@all|@everyone/ig);
        if (tagAll && tagAll.length) {
          let message = '';
          this.userTags[ctx.chat.id].forEach(tag => message += ` ${tag}`);
          await ctx.replyWithMarkdown(message, Extra.inReplyTo(ctx.message.message_id));
        }
      }
    });
  }

  async saveUserTags() {
    const copy = Object.assign({}, this.userTags);
    const data = {};
    for (let [chatId, tags] of Object.entries(copy)) {
      data[chatId] = Array.from(tags);
    }
    await promisify(fs.writeFile)(path.join(__dirname, `../${this.filename}`), JSON.stringify(data));
  }

  async readUserTags() {
    if (await promisify(fs.exists)(path.join(__dirname, `../${this.filename}`))) {
      const data = await promisify(fs.readFile)(path.join(__dirname, `../${this.filename}`));
      const obj = JSON.parse(data.toString());
      const result = {};
      for (let [chatId, array] of Object.entries(obj)) {
        result[chatId] = new Set(array);
      }
      this.userTags = Object.assign({}, result);
    }
  }
}

module.exports = Core;
