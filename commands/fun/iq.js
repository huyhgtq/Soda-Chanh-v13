const { MessageEmbed } = require("discord.js");
const Guild = require('../../database/schemas/Guild');
const Command = require('../../structures/Command');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'iq',
        aliases: [],
        description: 'Hiển thị chỉ số IQ của người dùng',
        category: 'Fun',
        cooldown: 3
      });
    }

    async run(message, args) {
	const client = message.client
    const guildDB = await Guild.findOne({ guildId: message.guild.id });
    const language = require(`../../data/language/${guildDB.language}.json`)
  try {
   const user = (await message.mentions.members.first()) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find((r) => r.user.username.toLowerCase().includes() === args.join(" ").toLocaleLowerCase()) || message.guild.members.cache.find((r) => r.displayName.toLowerCase().includes() === args.join(" ").toLocaleLowerCase()) || message.member;
   const iq = Math.floor(Math.random() * 226);
   const embed = new MessageEmbed() // Prettier
    .setTitle(`<:brain:968436179265540136> IQ Test:`)
    .setDescription(`<:light_bulb:968436378851479622> ${user.user.username} IQ: \`${iq}\``)
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter(
     `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })

    );
   message.reply({ embeds: [embed] });
  } catch (err) {
   console.log(err);
   this.client.emit(error, message)
  }
 }
};
