const Command = require('../../structures/Command');
const fetch = require('node-fetch');
const Guild = require('../../database/schemas/Guild');
const rp = require("request-promise-native");
const { MessageEmbed, MessageAttachment } = require("discord.js");
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'ass',
        aliases: [ 'butt', 'butts', 'booty' ],
        description: 'Gửi cho bạn nhưng Hình ảnh 🍑',
        category: 'NSFW',
        nsfwOnly: true
      });
    }

    async run(message, args) {
	const client = message.client
    const guildDB = await Guild.findOne({ guildId: message.guild.id });
    const language = require(`../../data/language/${guildDB.language}.json`)

  if (!message.channel.nsfw) {
   const nsfwembed = new MessageEmbed()
    .setColor("RED")
    .setDescription(`<:Pepe_Anger:968354902080368731> | You can use this command only in an NSFW Channel!`)
    .setFooter(
     `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
    )
    .setImage("https://media.discordapp.net/attachments/721019707607482409/855827123616481300/nsfw.gif");
   return message.reply({ embeds: [nsfwembed] });
  }
  return rp
   .get("http://api.obutts.ru/butts/0/1/random")
   .then(JSON.parse)
   .then(function (res) {
    return rp.get({
     url: "http://media.obutts.ru/" + res[0].preview,
     encoding: null,
    });
   })
   .then(function (res) {
    const file = new MessageAttachment(res, "ass.png");
    const embed = new MessageEmbed() // Prettier
     .setTitle(
      ":smirk: Ass",
      message.guild.iconURL({
       dynamic: true,
       format: "png",
      })
     )
     .setColor("RANDOM")
     .setImage("attachment://ass.png")
     .setFooter(
      `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
     )
     .setTimestamp();
    message.reply({ embeds: [embed], files: [file] });
   })
   .catch((err) => {
    return client.createCommandError(message, err);
   });
 }
};
