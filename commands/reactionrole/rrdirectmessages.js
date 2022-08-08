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
        name: 'rrdm',
        aliases: ["reactionrolesdm", "rrdirectmessages"],
        description: 'Enable / Disable DMs của vai trò phản ứng',
        category: 'Reaction Role',
        cooldown: 3,
        usage: 'on / off',
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
      const prefix = guildDB.prefix;

      if(guildDB.isPremium == "false"){
      return message.channel.send(new MessageEmbed().setColor(message.guild.me.displayHexColor).setDescription(`${fail} Làm chậm ở đây, lệnh hiện tại chỉ dành cho các máy chủ cao cấp.\n\n[Kiểm tra Premium tại đây](https://sodachan.tk/premium/)`))}

  const missingPermEmbed = new MessageEmbed()
  .setAuthor(`Thiếu quyền của người dùng`, message.author.displayAvatarURL())
  .setDescription(`${fail} Lệnh sau cần Quyền **Administrator**`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)

   let properUsage = new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setDescription(`__**Sử dụng hợp lý**__\n\n\`1-\` ${prefix}rrdm on\n\`2-\` ${prefix}rrdm off`)
        .setFooter('https://sodachan.tk/')

      if (args.length < 1) {
        return message.channel.send(properUsage);
      }

 
      if (args.includes('disable') || args.includes('off')) {
  
      await Guild.findOne({
        guildId: message.guild.id
    }, async (err, guild) => {
 if(guild.reactionDM === false) return message.channel.send(new MessageEmbed()
   .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} DMs đã bị tắt`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)
 )
        guild.updateOne({
          reactionDM: false
        })
        .catch(err => console.error(err));

message.channel.send(new MessageEmbed()
   .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${success} DMs của vai trò phản ứng đã bị tắt!`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)
 )
    })
      } else if (args.includes('enable') || args.includes('on')) {


     await Guild.findOne({
        guildId: message.guild.id
    }, async (err, guild) => {

 if(guild.reactionDM === true) return message.channel.send(new MessageEmbed()
   .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} DMs đã được bật`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red))
        guild.updateOne({
          reactionDM: true
        })
        .catch(err => console.error(err));

 
message.channel.send(new MessageEmbed()
   .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${success} Các DMs của Vai trò phản ứng đã được bật!`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)
 )

   })

    } else if(args[0]) {
     message.channel.send(properUsage) 
    } else {
 message.channel.send(properUsage) 

    }


    }
};