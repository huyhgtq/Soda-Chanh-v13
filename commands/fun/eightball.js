const { MessageEmbed } = require("discord.js");
const Guild = require('../../database/schemas/Guild');
const Command = require('../../structures/Command');
const emojis = require('../../assets/emojis.json')
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'eightball',
        aliases: ['fortune', '8ball'],
        description: 'Cho bạn biết một vận may',
        category: 'Fun',
        cooldown: 3
      });
    }

    async run(message, args) {
		const guildDB = await Guild.findOne({ guildId: message.guild.id });
		const prefix = guildDB.prefix;
		const client = message.client
    
    const language = require(`../../data/language/${guildDB.language}.json`)
  try {
   if (!args) {
    return client.createError(message, `  ${emojis.fail} | You need to enter question :/\n\n**Usage:** \`${prefix} 8ball <question>\``);
   }
   if (args.toString().length > client.max_input) {
    return client.createError(message, `  ${emojis.fail} | Question can't be longer than \`${client.max_input}\` characters!\n\n**Usage:** \`${prefix} 8ball <question>\``);
   }
   const fortunes = ["Yes.", "It is certain.", "It is decidedly so.", "Without a doubt.", "Yes definelty.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now...", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good...", "Very doubtful."];
   const embed = new MessageEmbed() // Prettier
    .setDescription(`<:magic_ball:968429699615293491>  | ${fortunes[Math.floor(Math.random() * fortunes.length)]}`)
    .setTimestamp()
    .setColor("RANDOM")
    .setFooter(
     `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
    );
   await message.reply({ embeds: [embed] });
  } catch (err) {
   console.log(err);
   return client.createCommandError(message, err);
  }
 }
};
