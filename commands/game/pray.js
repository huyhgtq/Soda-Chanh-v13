const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");
const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
const random = require('random-number-csprng')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'pray',
        aliases: [ 'pray' ],
        description: `cầu nguyện`,
        category: 'Game',
        cooldown: 3
      });
    }
 async run (message) {
    let timeout = 300000;
    let amount = 100;

    let daily = await db.fetch(`praytime_${message.author.id}`);

    if (daily !== null && timeout - (Date.now() - daily) > 0) {
      let time = ms(timeout - (Date.now() - daily));
      let timeEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription(`<a:902372129796935701:903357810039996416> **__${message.author.username}__, Bạn đã cầu ngyện trước đó rồi.\n Quay lại sau ${time.minutes} phút ${time.seconds} giây**`);
      message.reply({ embeds: [timeEmbed]})
    } else {

      let data = await db.get(`pray_${message.author.id}.num`)
      if (data === null) data = 0;
      db.add(`pray_${message.author.id}.num`, 1)

      const em = new MessageEmbed()
        .setDescription(`**__${message.author.username}__, bạn đã cầu nguyện và được __1__ <a:902372129796935701:903357810039996416> \nHiện tại bạn đang có ${formatNumber(data)} <a:902372129796935701:903357810039996416> **`)
        .setColor('cecece')
      message.reply({ embeds: [em]})
      await db.set(`praytime_${message.author.id}`, Date.now())

    }

  }

}

