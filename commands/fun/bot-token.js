const { MessageEmbed } = require("discord.js");
const axios = require("axios").default;
const Guild = require('../../database/schemas/Guild');
const Command = require('../../structures/Command');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'bot-token',
        aliases: [ 'discord-token'],
        description: 'Tạo mã thông báo Discord Bot ngẫu nhiên (Đây là giả mạo)',
        category: 'Fun',
        cooldown: 3
      });
    }

    async run(message, args) {
		const client = message.client
    const guildDB = await Guild.findOne({ guildId: message.guild.id });
    const language = require(`../../data/language/${guildDB.language}.json`)
  try {
   const options = {
    method: "GET",
    url: "https://some-random-api.ml/bottoken",
   };
   axios.request(options).then((response) => {
    const embed = new MessageEmbed()
     .setColor("RANDOM")
     .setFooter(
      `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
     )
     .setTitle(`<:discord_logo:968365990603796501> Discord Token`)
     .setDescription("```" + response.data.token + "```\n>>> ||Mã thông báo này được tạo tự động, nó không phải là mã thông báo thực sự cho bot Discord! Nó chỉ được cho là trông giống như thế này!||");
    message.reply({ embeds: [embed] });
   });
  } catch (err) {
   console.log(err);
   this.client.emit(error, message);
  }
 }
};
