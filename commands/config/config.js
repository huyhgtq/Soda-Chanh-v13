const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require("../../config");
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'settings',
        aliases: [ 'cfg'],
        description: 'Hiển thị cài đặt hiện tại cho máy chủ',
        category: 'Config',
        guildOnly: true,
        userPermission: ['MANAGE_GUILD'],
      });
    }

    async run(message, args) {
		const domain = config.domain;
		const clientID = config.client_id;
		const client = message.client
      const settings = await Guild.findOne({
        guildId: message.guild.id,
      });
      const guildDB = await Guild.findOne({
        guildId: message.guild.id
    });

const row = new MessageActionRow()
          .addComponents(
              new MessageButton()
              .setLabel('Dashboard')
              .setURL(`https://sodachan.tk/dashboard/${message.guild.id}`)
              .setStyle('LINK')
              .setEmoji('🔗')
          )
		  .addComponents(
              new MessageButton()
              .setLabel('Support')
              .setURL(`https://discord.gg/2mHgQQz3GN`)
              .setStyle('LINK')
              .setEmoji('🔗')
          )
		  .addComponents(
              new MessageButton()
              .setLabel('Invite')
              .setURL(`https://discord.com/oauth2/authorize?client_id=${clientID}&redirect_uri=${domain}/thanks&response_type=code&scope=bot&permissions=490073207`)
              .setStyle('LINK')
              .setEmoji('🔗')
          )
		
      const language = require(`../../data/language/${guildDB.language}.json`)
      await message.reply({ embeds: [new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setTitle(`${language.serversettings1}`)
      .addField(`Main Settings`, `[\`Click here\`](https://sodachan.tk/dashboard/${message.guild.id})`, true)
      .addField(`Welcome & Leave`, `[\`Click here\`](https://sodachan.tk/dashboard/${message.guild.id}/welcome)`, true)
      .addField(`Logging`, `[\`Click here\`](https://sodachan.tk/dashboard/${message.guild.id}/logging)`, true)
      .addField(`Autorole`, `[\`Click here\`](https://sodachan.tk/dashboard/${message.guild.id}/autorole)`, true)
      .addField(`Alt Detector`, `[\`Click here\`](https://sodachan.tk/dashboard/${message.guild.id}/altdetector)`, true)
      .addField(`Tickets`, `[\`Click here\`](https://sodachan.tk/dashboard/${message.guild.id}/tickets)`, true)
      .addField(`Suggestions`, `[\`Click here\`](https://sodachan.tk/dashboard/${message.guild.id}/Suggestions)`, true)
      .addField(`Server Reports`, `[\`Click here\`](https://sodachan.tk/dashboard/${message.guild.id}/reports)`, true)
      .addField(`Automod`, `[\`Click here\`](https://sodachan.tk/dashboard/${message.guild.id}/automod)`, true)
      .setFooter(`${message.guild.name}`)

      
      ], components: [row]})
      
    }
};