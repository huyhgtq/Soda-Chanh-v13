const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Pogy');
const Guildd = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js');
const moment = require("moment")
moment.suppressDeprecationWarnings = true;

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'news',
        description: `Hiển thị tin tức mới nhất của Soda chan`,
        category: 'Information',
        cooldown: 3
      });
    }

    async run(message) {
           const client = message.client;
      const guildDB = await Guild.findOne({
        tag: '893953109334843422'
      });
      
 
      const guildDB2 = await Guildd.findOne({
        guildId: message.guild.id
      });

      const language = require(`../../data/language/${guildDB2.language}.json`)

      if(!guildDB) return message.reply(`${language.noNews}`)


        
        let embed = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setTitle(`Soda Chan News`)
      .setDescription(`***__${language.datePublished}__ ${moment(guildDB.time).format("MM-DD-YYYY")}*** *__[\`(${moment(guildDB.time).fromNow()})\`](https://sodachan.tk/)__*\n\n ${guildDB.news}`)
      .setFooter('https://sodachan.tk/')
      .setTimestamp();

      message.reply(embed).catch(() => {
        message.reply(`${language.noNews}`)
      });
    
    }
};