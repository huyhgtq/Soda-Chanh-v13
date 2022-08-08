const { MessageEmbed } = require("discord.js");
const axios = require("axios").default;
const Guild = require('../../database/schemas/Guild');
const Command = require('../../structures/Command');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'fox',
        aliases: [],
        description: 'Gửi một hình ảnh cáo ngẫu nhiên',
        category: 'Images',
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
    url: "https://some-random-api.ml/img/fox",
   };
   axios.request(options).then((response) => {
    const embed = new MessageEmbed()
     .setColor("RANDOM")
     .setFooter(
      `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
     )
     .setTitle("🦊 Fox")
     .setImage(response.data.link);
    message.reply({ embeds: [embed] });
   });
  } catch (err) {
   console.log(err);
   this.client.emit(error, message);
  }
 }
};
