const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const discord = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');
const domain = require("../../config.js");

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'dashboard',
        aliases: [],
        description: 'Cung cấp liên kết đến trang tổng quan web',
        category: 'Information',
        usage: '',
        examples: [ 'dashboard'],
        cooldown: 3
      });
    }

    async run(message, args){

	const guildDB = await Guild.findOne({ guildId: message.guild.id });
	const language = require(`../../data/language/${guildDB.language}.json`)
		
  try {
   const embed = new MessageEmbed() // Prettier
    .setTitle(`✅ Yay!`)
    .setTimestamp()
    .setColor("RANDOM")
    .setFooter(
     `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
    );
   if (message.member.permissions.has("MANAGE_GUILD")) {
    embed.setDescription(`🔗 | Liên kết máy chủ của bạn: ${domain.domain}/dashboard/${message.guild.id}\n🔗 | Liên kết Dashboard: ${domain.domain}`);
    embed.addField(
        `\u200b`, 
        `**[Liên kết máy chủ](${domain.domain}dashboard/${message.guild.id})** | ` +
		`**[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
   } else {
    embed.setDescription("🔗 Our dashboard link: " + domain.domain);
   }
   message.reply({ embeds: [embed]})
  } catch (err) {
   console.log(err);
  this.client.emit(error, message);
  }
 }
};