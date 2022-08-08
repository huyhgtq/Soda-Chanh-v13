const { MessageEmbed } = require("discord.js");
const Guild = require('../../database/schemas/Guild');
const Command = require('../../structures/Command');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'flipcoin',
        aliases: [],
        description: 'Lật một đồng tiền ảo',
        category: 'Fun',
        cooldown: 3
      });
    }

    async run(message, args) {
		const client = message.client
    const guildDB = await Guild.findOne({ guildId: message.guild.id });
    const language = require(`../../data/language/${guildDB.language}.json`)
  try {
   const answers = ["Heads", "Tails"];
   const answer = answers[Math.floor(Math.random() * answers.length)];
   const embed = new MessageEmbed() // Prettier
    .setColor("RANDOM")
    .setTitle(`🪙 | I'm get: ${answer}`)
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
