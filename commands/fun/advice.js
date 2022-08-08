const Guild = require('../../database/schemas/Guild');
const Command = require('../../structures/Command');
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'advice',
        aliases: [ 'advice'],
        description: 'Nhận một lời khuyên ngẫu nhiên',
        category: 'Fun',
        cooldown: 3
      });
    }

    async run(message, args) {
	
    const client = message.client
    const guildDB = await Guild.findOne({ guildId: message.guild.id });
    const language = require(`../../data/language/${guildDB.language}.json`)

 try {
   const res = await fetch("https://api.adviceslip.com/advice"),
    { slip } = await res.json();
   const embed = new MessageEmbed()
    .setTitle(`<:AnimeThinking:968359010975752233> My advice`)
    .setDescription(`>>> ${slip.advice}`)
    .setColor("RANDOM")
    .setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
    .setThumbnail(
     message.author.displayAvatarURL({
      dynamic: true,
      format: "png",
      size: 2048,
     })
    );
   return message.reply({ embeds: [embed] });
  } catch (err) {
   console.log(err);
  this.client.emit(error, message);
  }
 }
};
