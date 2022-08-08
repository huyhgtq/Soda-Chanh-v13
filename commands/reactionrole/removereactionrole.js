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
        name: 'removerr',
        aliases: ["removereactionrole", "rreactionrole", "deletereactionrole", "delreactionrole", "remrr", "delrr", 'delreaction', 'deletereaction'],
        description: 'Tạo một vai trò phản ứng',
        category: 'Reaction Role',
        cooldown: 3,
        usage: '<kênh> <ID tin nhắn> <emoji>',
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
  .setDescription(`${fail} Lệnh sau cần Quyền **Administrator **`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)

      let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(ch => ch.name === args[0])
    if (!channel) return message.channel.send(new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Cung cấp cho tôi một Kênh hợp lệ`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)
    );
    
    let ID = args[1]
    if(!ID) return message.channel.send(new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Cung cấp cho tôi ID tin nhắn hợp lệ`)
  .setFooter(`https://sodachan.tk/`)
    );
    let messageID = await channel.messages.fetch(ID).catch(() => { return message.channel.send(new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Tôi không thể tìm thấy ID sau`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)
    ); })

           let emoji = args[2]

    if (!emoji) return message.channel.send(new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Cung cấp cho tôi một Biểu tượng cảm xúc hợp lệ`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)
    );

  
    
    if (isCustomEmoji(args[2])) return message.channel.send(new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Không sử dụng Biểu tượng cảm xúc tùy chỉnh!`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)
    );
    
   

    await react.reactionDelete(client, message.guild.id , ID, emoji);
    
     message.channel.send(new MessageEmbed()
   .setColor(client.color.green)
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${success} Đã xóa [Vai trò phản ứng](${messageID.url})`)
  .setFooter(`https://sodachan.tk/`))
  


        function isCustomEmoji(emoji) {
      return emoji.split(":").length == 1 ? false : true;
    }
    
    }
};