const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const NSFW = require("discord-nsfw");
const nsfw = new NSFW();
const {MessageEmbed} =require('discord.js');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'thighs',
        description: 'đúng đúng',
        category: 'NSFW',
        nsfwOnly: true
      });
    }

    async run(message, args) {
	const client = message.client
    const guildDB = await Guild.findOne({ guildId: message.guild.id });
    const language = require(`../../data/language/${guildDB.language}.json`)	
    var errMessage = "This is not an NSFW Channel";
   if (!message.channel.nsfw) {
     const nsfwembed = new MessageEmbed()
      .setColor("RED")
      .setDescription(`<:Pepe_Anger:968354902080368731> | You can use this command only in an NSFW Channel!`)
      .setFooter(
       `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
      )
      .setImage("https://media.discordapp.net/attachments/721019707607482409/855827123616481300/nsfw.gif");
     return message.reply({ embeds: [nsfwembed] });
    }

    const image = await nsfw.thigh();
    const embed = new MessageEmbed()
    .setTitle(`Thigh`)
    .setColor("GREEN")
    .setImage(image);
    message.channel.send({ embeds: [embed] });
  }
};