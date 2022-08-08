const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const axios = require("axios").default;
const Guild = require('../../database/schemas/Guild');
const Command = require('../../structures/Command');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'meme',
        aliases: [ 'meme'],
        description: 'Gửi meme ngẫu nhiên',
        category: 'Fun',
        cooldown: 3
      });
    }

    async run(message, args)  {
		const client = message.client
    const guildDB = await Guild.findOne({ guildId: message.guild.id });
    const language = require(`../../data/language/${guildDB.language}.json`)
  try {
   const options = {
    method: "GET",
    url: `https://reddit.com/r/dankmemes/random/.json`,
   };
   axios.request(options).then((response) => {
    let meme = response.data[0].data.children[0].data;
    const row = new MessageActionRow()
		.addComponents(new MessageButton()
		.setStyle("LINK")
		.setURL(`https://reddit.com${meme.permalink}`)
		.setLabel("View meme"));
	   
    const embe2 = new MessageEmbed() // Prettier
     .setColor("RANDOM")
     .setTitle(meme.title)
     .setURL(`https://reddit.com${meme.permalink}`)
     .setImage(meme.url)
     .setTimestamp()
     .setFooter(
      `👍 ${meme.ups} • 💬 ${meme.num_comments} • ${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
     );
    message.reply({ embeds: [embe2], components: [row] });
   });
  } catch (err) {
   console.log(err);
   this.client.emit(error, message);
  }
 }
};
