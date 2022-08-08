const { MessageEmbed } = require("discord.js");
const Guild = require('../../database/schemas/Guild');
const Command = require('../../structures/Command');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'flatearth',
        aliases: [ 'flat_earth'],
        description: 'Chứng tỏ rằng trái đất thực sự phẳng',
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
    .setTitle(`<:earth:968430921722261504> If the earth isn't flat, explain this`)
    .setImage("https://media1.tenor.com/images/462b6d76beee0f9501d20535dae9c00b/tenor.gif?itemid=13792633")
    .setFooter(
     `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
    )
    .setTimestamp();
   message.reply({ embeds: [embed] });
  } catch (err) {
   console.log(err);
   this.client.emit(error, message);
  }
 }
};