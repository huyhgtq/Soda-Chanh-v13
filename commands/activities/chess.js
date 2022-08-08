const Command = require('../../structures/Command');
const fetch = require('node-fetch');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Guild = require('../../database/schemas/Guild');
const { DiscordTogether } = require('discord-together');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'chess',
        aliases: ['chess'],
        usage: '[user]',
        description: 'Chơi cờ trong Discord',
        category: 'activities',
        examples: ['activities'],
        cooldown: 3
      });
    }

    async run(message, args) {
		const client = message.client
		  client.discordTogether = new DiscordTogether(client);
		const guildDB = await Guild.findOne({ guildId: message.guild.id });
		const language = require(`../../data/language/${guildDB.language}.json`)
        const discordTogether = new DiscordTogether(client)
		
      if (!message.member.voice.channelId) {
        return message.channel.send('You need to join a voice channel first!')
      }
        client.discordTogether.createTogetherCode(message.member.voice.channelId, 'chessDev').then(async(invite) => {
            
            let embed = new MessageEmbed()
            .setTitle("Chess.io")
            .setDescription(`[Click Here](${invite.code}) to play Chess!\n\`\`\`\nNote: This feature is not availble for mobile users!\`\`\``)
            .setColor("GREEN")
            .setFooter(`Requested By: ${message.author.tag}`)
            
            const row = new MessageActionRow()
          .addComponents(
              new MessageButton()
              .setLabel('Click Here')
              .setURL(`${invite.code}`)
              .setStyle('LINK')
              .setEmoji('🔗')
          )
message.reply({ embeds: [embed], components: [row] });
        });
    }
}