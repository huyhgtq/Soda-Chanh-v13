const Command = require('../../structures/Command');
const fetch = require('node-fetch');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js');
const discord = require("discord.js");
const zalgo = require('zalgolize');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'zalgo',
        aliases: ['zalgolize'],
        description: 'Đặt bot zalgolize một thông báo',
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

          if(!args[0]) return message.reply(`${language.zalgolize}`)

          message.reply({ embeds: [new discord.MessageEmbed().setColor(client.color.blue).setDescription(`\u180E${zalgo(args, 0.2, [10, 5, 10])}`)]});

  
    }
};
