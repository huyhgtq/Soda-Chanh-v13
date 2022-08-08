const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js');

const ReactionRole = require("../../packages/reactionrole/index.js")
const react = new ReactionRole()
const config = require("../../config.json");
react.setURL(config.mongodb_url)

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'editreaction',
        aliases: ["editreactionrole", "err"],
        description: 'Chỉnh sửa vai trò mà một phản ứng nhất định đưa ra',
        category: 'Reaction Role',
        cooldown: 3,
        usage: '<Kênh> <ID tin nhắn> <ID vai trò mới> <emoji>',
        userPermission: ['MANAGE_GUILD'],
      });
    }

    async run(message, args) {
    let client = message.client

       const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
    
      const language = require(`../../data/language/${guildDB.language}.json`)
      
 
      let fail = message.client.emoji.fail
      let success = message.client.emoji.success
  const missingPermEmbed = new MessageEmbed()
  .setAuthor(`Thiếu quyền của người dùng`, message.author.displayAvatarURL())
  .setDescription(`${fail} Lệnh sau Quyền **Administrator**`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)


       let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(ch => ch.name === args[0])
    if (!channel) return message.channel.send({ embeds: [new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Cung cấp cho tôi một Kênh hợp lệ`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)
    ]});
    
    let ID = args[1]
    if(!ID) return message.channel.send({ embeds: [new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Cung cấp cho tôi ID tin nhắn hợp lệ`)
  .setFooter(`https://sodachan.tk/`)
    ]});
    let messageID = await channel.messages.fetch(ID).catch(() => { return message.channel.send({ embeds: [new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Tôi không thể tìm thấy ID sau`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)
    ]}); })


       let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.find(rl => rl.name === args[2])
    if (!role) return message.channel.send({ embeds: [new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Cung cấp cho tôi một vai trò hợp lệ`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)
	]});

        if(role.managed){
      return message.channel.send(`${message.client.emoji.fail} Vui lòng không sử dụng vai trò tích hợp.`)
    }

      
     let emoji = message.guild.emojis.cache.find(emoji => emoji.name.toLowerCase() === args[3].toLowerCase());



    await react.reactionEdit(client, message.guild.id , ID, role.id, emoji);
    
                message.channel.send({ embeds: [new MessageEmbed()
                .setAuthor('Vai trò phản ứng Chỉnh sửa', message.guild.iconURL(),messageID.url)
                .setColor(client.color.green)
				        .addFields(
		{ name: 'Channel', value: channel },
		{ name: 'Emoji', value: emoji, inline: true },
		{ name: 'Số lượng', value: option, inline: true },
		{ name: 'ID tin nhắn', value: ID, inline: true },
		{ name: 'Role', value: role, inline: true },
	)
                .setFooter('https://sodachan.tk/')],components: [row]})


        function isCustomEmoji(emoji) {
      return emoji.split(":").length == 1 ? false : true;
    }

    }
};