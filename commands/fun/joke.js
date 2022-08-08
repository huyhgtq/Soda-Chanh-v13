const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const Guild = require('../../database/schemas/Guild');
const Command = require('../../structures/Command');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'joke',
        aliases: ['dad-joke', 'dadjoke'],
        description: 'Hiển thị một trò đùa ngẫu nhiên!',
        category: 'Fun',
        cooldown: 3
      });
    }

    async run(message, args) {
		const client = message.client
    const guildDB = await Guild.findOne({ guildId: message.guild.id });
    const language = require(`../../data/language/${guildDB.language}.json`)

   try {
    const response = await fetch("http://icanhazdadjoke.com/", {
     method: "get",
     headers: {
      Accept: "application/json",
     },
    });
    const body = await response.json();
    const embed = new MessageEmbed() // Prettier
     .setTitle("Random Dad joke", message.guild.iconURL())
     .setDescription(`>>> ${body.joke}`)
     .setColor("RANDOM")
     .setFooter(
      `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
     )
     .setTimestamp();
    message.reply({ embeds: [embed] });
   } catch (err) {
    console.log(err);
    return client.createCommandError(message, err);
   }
 }
};
