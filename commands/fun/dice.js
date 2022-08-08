const { MessageEmbed } = require("discord.js");
const Guild = require('../../database/schemas/Guild');
const Command = require('../../structures/Command');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'dice',
        aliases: [],
        description: 'Lắc xúc xắc',
        category: 'Fun',
        cooldown: 3
      });
    }

    async run(message, args)  {
		const client = message.client
    const guildDB = await Guild.findOne({ guildId: message.guild.id });
    const language = require(`../../data/language/${guildDB.language}.json`)

  try {
   const dice = Math.floor(Math.random() * (6 - 1) + 1);
   const embed = new MessageEmbed() // Prettier
    .setTitle(`<:dicegoblin:968369826521284628> | The dice rolled \`${dice}\``)
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter(
     `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
    );
   message.reply({ embeds: [embed] });
  } catch (err) {
   console.log(err);
   return client.createCommandError(message, err);
  }
 }
};
