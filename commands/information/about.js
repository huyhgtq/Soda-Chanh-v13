const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const discord = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');
const domain = require("../../config.js");

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'about',
        aliases: ["about"],
        description: 'Thông tin về bot và nhà phát triển',
        category: 'Information',
        usage: 'about',
        examples: [ '' ],
        cooldown: 3
      });
    }

    async run(message, args){
		const client = message.client
		const guildDB = await Guild.findOne({ guildId: message.guild.id });
		const language = require(`../../data/language/${guildDB.language}.json`)
		const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.slice(0).join(' ') || x.user.username === args[0]) || message.member;
  try {
   const embed = new MessageEmbed()
    .setAuthor('Soda Chanh#6633')
    .setTimestamp()
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .setColor("RANDOM")
    .setFooter(
     `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
    )
    .addField(`<:sodaa:963940635675623424> Về Soda Chanh#6633`, "> " + `... Sớm có mặt!`)
  	.addField(`<:sodaa:963940635675623424> Về nhà phát triển ! Losy | Harry#8479`, "> " + `... Sớm có mặt!`);
  message.reply({ embeds: [embed]})
  } catch (err) {
   console.log(err);
this.client.emit(error, message);
  }
 }
};