const Command = require('../../structures/Command');
const fetch = require('node-fetch');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Guild = require('../../database/schemas/Guild');
const { DiscordTogether } = require('discord-together');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'awkword',
        aliases: ['awkword'],
        usage: '[user]',
        description: 'Chơi awkword.io trong Discord',
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
		

      if (!message.member.voice.channelId) {
        return message.reply('You need to join a voice channel first!')
      }
        client.discordTogether.createTogetherCode(message.member.voice.channelId, 'awkword').then(async(invite) => {
            
            let embed = new MessageEmbed()
            .setTitle("Awkword.io")
            .setDescription(`[Click Here](${invite.code}) to play Awkword.io!\n\`\`\`\nNote: This feature is not availble for mobile users!\`\`\``)
            .setColor("GREEN")
            .setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
            
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