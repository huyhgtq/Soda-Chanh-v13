const Command = require('../../structures/Command');
const fetch = require('node-fetch');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Guild = require('../../database/schemas/Guild');
const { DiscordTogether } = require('discord-together');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'checkers',
        aliases: ['checkers'],
        usage: '[user]',
        description: 'Chơi Or Checkers in the Park.io trong Discord',
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
		 if(!message.member.voice.channel) return message.reply('You must be in a voice channel to use this command!'); {
		  
        client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'checkers').then(async invite => {

          const embed = new MessageEmbed()
          .setAuthor("Checkers Together", client.user.displayAvatarURL())
          .setColor("GREEN")
          .setDescription(`\`\`\`\nNote: This feature is not availble for mobile users!\`\`\``)
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
      };
    }
}  