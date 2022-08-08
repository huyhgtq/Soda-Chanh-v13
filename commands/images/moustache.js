const { MessageEmbed, MessageAttachment } = require("discord.js");
const AmeClient = require("amethyste-api");
const AmeAPI = new AmeClient(process.env.AMEAPI);
const Guild = require('../../database/schemas/Guild');
const Command = require('../../structures/Command');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'moustache',
        aliases: ['reject'],
        description: 'Thêm ria mép vào ảnh đại diện của người dùng',
		usage: "moustache [user mention, user id, user name]",
        category: 'Images',
        cooldown: 3
      });
    }

    async run(message, args)  {
	 const client = message.client
    const guildDB = await Guild.findOne({ guildId: message.guild.id });
    const language = require(`../../data/language/${guildDB.language}.json`)
  try {
   const User = (await message.mentions.members.first()) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find((r) => r.user.username.toLowerCase().includes() === args.join(" ").toLocaleLowerCase()) || message.guild.members.cache.find((r) => r.displayName.toLowerCase().includes() === args.join(" ").toLocaleLowerCase()) || message.member;
   const wait = new MessageEmbed() // Prettier
    .setColor("#5865f2")
    .setDescription(` | Please wait... I'm generating your image`);
   message.reply({ embeds: [wait] }).then((msg) => {
    (async () => {
     const buffer = await AmeAPI.generate("moustache", {
      url: User.user.displayAvatarURL({
       format: "png",
       size: 2048,
      }),
     });
     const attachment = new MessageAttachment(buffer, "moustache.png");
     msg.edit({ embeds: [], files: [attachment] });
    })();
   });
  } catch (err) {
   console.log(err);
  this.client.emit(error, message);
  }
 }
};
