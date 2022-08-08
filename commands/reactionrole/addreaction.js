const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

const ReactionRole = require("../../packages/reactionrole/index.js")
const react = new ReactionRole()
const config = require("../../config.json");
react.setURL(config.mongodb_url)

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'addreaction',
        aliases: ["reactionrole", "rr", "createrr","crr", "addrr", "arr", "rradd"],
        description: 'Tạo một vai trò phản ứng',
        category: 'Reaction Role',
        cooldown: 3,
        usage: '<Kênh> <ID Tin nhắn> <vai trò> <emoji> (Lựa chọn)',
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
  .setDescription(`${fail} Lệnh sau cần Quyền **Administrator *`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)


      
      let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(ch => ch.name === args[0])
    if (!channel) return message.reply({ embeds: [new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Cung cấp cho tôi một Kênh hợp lệ`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)
    ]});
    
    let ID = args[1]
    if(!ID) return message.reply({ embeds: [new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Cung cấp cho tôi ID tin nhắn hợp lệ`)
  .setFooter(`https://sodachan.tk/`)
    ]});
    let messageID = await channel.messages.fetch(ID).catch(() => { return message.reply({ embeds: [new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Tôi không thể tìm thấy ID sau`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)
    ]}); })

    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.find(rl => rl.name === args[2])
    if (!role) return message.reply({ embeds: [new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Cung cấp cho tôi một vai trò hợp lệ`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)
    ]});

    if(role.managed){
      return message.reply(`${message.client.emoji.fail} Vui lòng không sử dụng vai trò tích hợp.`)
    }
      
     let emoji = args[3]

    if (!emoji) return message.reply({ embeds: [new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Cung cấp cho tôi một Biểu tượng cảm xúc hợp lệ`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)
    ]});

    if (isCustomEmoji(args[3])) return message.reply({ embeds: [new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Không sử dụng Biểu tượng cảm xúc tùy chỉnh!`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)
    ]});

try {

await messageID.react(emoji)

} catch(err){
 return message.reply({ embeds: [new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Vui lòng cung cấp một Biểu tượng cảm xúc hợp lệ.`)
  .setColor(client.color.red)
  .setFooter(`https://sodachan.tk/`)]});
}
 
    
    let option = args[4]
    if(!option) option = 1
    if(isNaN(option)) option = 1
    if(option > 6) option = 1
    
    
    await react.reactionCreate(client, message.guild.id , ID, role.id, emoji, "false", option);
    const row = new MessageActionRow()
          .addComponents(
              new MessageButton()
              .setLabel('Chuyển đến tin nhắn')
              .setURL(`${messageID.url}`)
              .setStyle('LINK')
              .setEmoji('🔗')
          )
                message.channel.send({ embeds: [new MessageEmbed()
                .setAuthor('Vai trò phản ứng', message.guild.iconURL(),messageID.url)
                .setColor(client.color.green)			
                .addField(`Channel ${channel}`, true)
                .addField(`Emoji ${emoji}`, true)
                .addField(`Số lượng ${option}`, true)
                .addField(`ID tin nhắn ${ID}`, true)
                .addField(`Role ${role}`)								
				.setFooter({text: 'https://sodachan.tk/'})], components: [row] })

        function isCustomEmoji(emoji) {
      return emoji.split(":").length == 1 ? false : true;
    }

    }
};