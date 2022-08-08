const { MessageEmbed } = require("discord.js");
const Guild = require('../../database/schemas/Guild');
const Command = require('../../structures/Command');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'sneeze',
        aliases: [],
        description: 'Achoo!',
        category: 'Fun',
        cooldown: 3
      });
    }

    async run(message, args) {
	 const client = message.client
    const guildDB = await Guild.findOne({ guildId: message.guild.id });
    const language = require(`../../data/language/${guildDB.language}.json`)
  try {
   const sneezes = ["**Achoo!**", "*chew!*", "Ah... Ah... **A_CHOO!_**", "_Ah..._***CHOOOOOOOOOOOOOOOOOOOO!***", "*Achoo!* Excuse me!"];
   const embed = new MessageEmbed() // Prettier
    .setColor("RANDOM")
    .setTitle(`<:CatSneeze:968445003661709332>  ${sneezes[Math.floor(Math.random() * Math.floor(sneezes.length))]}`)
    .setImage(`https://media.discordapp.net/attachments/709721624588320840/894226312019968070/sneeze.gif`)
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
