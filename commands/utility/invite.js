const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const domain = require("../../config.js");
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'invite',
        aliases: [ 'inv' ],
        description: `Gửi cho bạn liên kết mời của Soda Chan`,
        category: 'Utility',
        cooldown: 3
      });
    }

    async run(message) {
       const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
      const client = message.client
      const language = require(`../../data/language/${guildDB.language}.json`)
  try {
   const embed = new MessageEmbed() // Prettier
    .setColor("RANDOM")
    .setTitle(`<:2952checkmh:898169534849105952> Yay!`)
    .setDescription(`<:PotatoTada:965860251582746664> **[Click this link to invite me!](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot)**`)
    .setTimestamp()
    .setFooter(
     `~${client.user.username} created by "Harry#8479"`,
     message.author.displayAvatarURL({
      dynamic: true,
      format: "png",
      size: 2048,
     })
    );
   const row = new MessageActionRow() // Prettier
    .addComponents(
     new MessageButton() // Prettier
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot`)
      .setEmoji(`<:giveaway:965859715496181781>`)
      .setLabel("Invite me!")
      .setStyle("LINK")
    );

   return message.reply({ embeds: [embed], components: [row] });
  } catch (err) {
   console.log(err);
   this.client.emit(error, message);
  }
 }
};