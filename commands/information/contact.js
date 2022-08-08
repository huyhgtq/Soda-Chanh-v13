const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const discord = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');
const domain = require("../../config.js");

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'contact',
        aliases: [],
        description: 'Cung cấp liên kết trang web để liên hệ với chúng tôi',
        category: 'Information',
        usage: '',
        examples: [ 'contact' ],
        cooldown: 3
      });
    }

    async run(message, args){
		
		const guildDB = await Guild.findOne({ guildId: message.guild.id });
		const language = require(`../../data/language/${guildDB.language}.json`)
		
  try {
   const embed = new MessageEmbed() // Prettier
    .setTitle(`✅ Yay!`)
    .setDescription(`🔗 | Liên hệ với chúng tôi: ${domain.domain}/contact`)
    .setTimestamp()
    .setColor("RANDOM")
	.addField(
        `\u200b`, 
        `**[Liên hệ](${domain.domain}/contact)**`
      )
    .setFooter(
     `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
    );
  message.reply({ embeds: [embed]})
  } catch (err) {
   console.log(err);
	  this.client.emit(error, message);
  }
 }
};
