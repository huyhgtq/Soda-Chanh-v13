const Command = require('../../structures/Command');
const rgx = /^(?:<@!?)?(\d+)>?$/;
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'leaveguild',
        aliases: ['lg'],
        description: 'Rời khỏi một hội!',
        category: 'Owner',
        ownerOnly: true
      });
    }

    async run(message, args) {
      
      const guildId = args[0];
    if (!rgx.test(guildId))
      return message.reply(`Cung cấp một máy chủ`)
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return message.reply(`ID máy chủ không hợp lệ`)
    await guild.leave();
    const embed = new MessageEmbed()
      .setTitle('Rời máy chủ')
      .setDescription(`Tôi đã rời đi thành công **${guild.name}**.`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.reply({ embeds: [embed] })

    }
};
