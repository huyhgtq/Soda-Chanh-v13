const { MessageEmbed } = require("discord.js");

const Guild = require('../../database/schemas/Guild');
const Command = require('../../structures/Command');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'beep',
        aliases: [],
        description: 'Beep-Boop!',
        category: 'Fun',
        cooldown: 3
      });
    }

    async run(message, args) {
		 const client = message.client
    const guildDB = await Guild.findOne({ guildId: message.guild.id });
    const language = require(`../../data/language/${guildDB.language}.json`)

  try {
   const embed = new MessageEmbed() // Prettier
    .setColor("RANDOM")
    .setTitle(`<:milkclock:968363866914435083> Boop!`)
    .setImage(`https://c.tenor.com/xEv4LjI27pkAAAAC/time-clock.gif`)
    .setFooter(
     `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
    );
   message.reply({ embeds: [embed] });
  } catch (err) {
   console.log(err);
   this.client.emit(error, message);
  }
 }
};