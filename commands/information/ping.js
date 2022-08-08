const Command = require('../../structures/Command');
const { MessageEmbed, Message, Client } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');
const ms = require("parse-ms");
const Guild = require('../../database/schemas/Guild');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'ping',
        aliases: ['latency'],
        description: 'Kiểm tra độ trễ của Soda Chan',
        category: 'Information',
        cooldown: 5
      });
    }

    async run(message, args) {
		const client = message.client
		const guildDB = await Guild.findOne({ guildId: message.guild.id });
		const language = require(`../../data/language/${guildDB.language}.json`)

  try {
   const ping = new MessageEmbed() // Prettier
    .setTitle(`🏓 Pong!`)
    .addField(`⏱ ${language.timeTaken}:`, `\`\`\`${(Date.now() - message.createdTimestamp).toString().replace(/-/g, "")}ms\`\`\``)
    .addField(`⏱ ${language.discordAPI}:`, `\`\`\`${Math.round(client.ws.ping)}ms\`\`\``)
    .setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
    .setColor("RANDOM")
    .setTimestamp();
   message.reply({ embeds: [ping] });
  } catch (err) {
   console.log(err);
   this.client.emit(error, message);
  }
 }
};
