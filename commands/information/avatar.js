const Command = require('../../structures/Command');
const fetch = require('node-fetch');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Guild = require('../../database/schemas/Guild');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'avatar',
        aliases: ['profilepic', 'pic', 'ava', 'av'],
        usage: '[user]',
        description: 'Hiển thị hình đại diện của người dùng',
        category: 'Information',
        examples: [ 'av', 'av @Yuunya'],
        cooldown: 3
      });
    }

    async run(message, args) {

		const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
    
      const language = require(`../../data/language/${guildDB.language}.json`)

      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.slice(0).join(' ') || x.user.username === args[0]) || message.member;
	    const uavatar = member.user.displayAvatarURL({
    	dynamic: true,
    	format: "png",
   	 	size: 4096,
   		});
      if (!member) member = message.member
const row = new MessageActionRow() // Prettier
    .addComponents(
     // Prettier
     new MessageButton() // Prettier
      .setLabel("Avatar Link")
      .setStyle("LINK")
      .setURL(uavatar)
    );
 	const embed = new MessageEmbed()
      .setAuthor(`${language.pfpAvatar.replace("{user}", `${member.user.tag}`)}`, member.user.displayAvatarURL({ dynamic: true, size: 4096 }), member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setImage(uavatar)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
	  .addField("<:3100fnfright:955084169627709450>  PNG", `[\`LINK\`](${member.user.displayAvatarURL({dynamic: true, format: "png", size: 4096,})})`, true)
      .addField("<:3100fnfright:955084169627709450>  JPEG", `[\`LINK\`](${member.user.displayAvatarURL({dynamic: true, format: "jpg", size: 4096,})})`, true)
      .addField("<:3100fnfright:955084169627709450>  WEBP", `[\`LINK\`](${member.user.displayAvatarURL({dynamic: true, format: "webp", size: 4096,})})`, true)
      .setTimestamp()
      .setColor("RANDOM")
	  .setURL(member.user.displayAvatarURL({
          dynamic: true
        }))
	  .setThumbnail(message.author.displayAvatarURL)
       return message.reply({ embeds: [embed], components: [row] });
    }
};
