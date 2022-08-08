const Command = require('../../structures/Command');
const fetch = require('node-fetch');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js');
const discord = require("discord.js")
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'rate',
        description: 'Đưa cho tôi một cái gì đó và đánh giá thấp',
        category: 'Fun',
        cooldown: 3
      });
    }

    async run(message, args) {

        const client = message.client
        const guildDB = await Guild.findOne({
            guildId: message.guild.id
          });
        
          const language = require(`../../data/language/${guildDB.language}.json`)



          const rating = Math.floor(Math.random() * 10) + 0;
          const item = message.content.split(/\s+/g).slice(1).join(' ');
             if (!item) return message.reply({ embeds: [new discord.MessageEmbed().setColor(message.guild.me.displayHexColor).setDescription(`${language.rate1} ${rating}/10!`)]});
             
             if (item.length > 40) return message.reply(`${language.rate2}`);
         
                 if (item.toUpperCase().startsWith('SodaChan')) return message.channel.send(`${language.rate3}`);
            
                 return message.reply({ embeds: [new discord.MessageEmbed().setColor(client.color.blue).setDescription(`${language.rate4} **${item}** ${language.rate5} ${rating}/10!`)]}).catch(() => {});
         
         
           } 
         
};