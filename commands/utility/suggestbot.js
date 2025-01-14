const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const crypto = require("crypto");
const config = require('../../config.json');
const webhookClient = new Discord.WebhookClient({ 
id: `${config.webhook_id}`,
token: `${config.webhook_url}`});

const Guild = require('../../database/schemas/Guild');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'suggestbot',
        aliases: [ 'botsuggest' ],
        description: `Đề xuất một tính năng mới cho Soda Chan!`,
        category: 'Utility',
        examples: [ 'suggest Bạn có thể thêm âm nhạc Xin vui lòng!' ],
        cooldown: 60
      });
    }

    async run(message, args) {

             const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
    
      const language = require(`../../data/language/${guildDB.language}.json`)

      var id = crypto.randomBytes(4).toString('hex');
      
      if (args.length < 1) {
        return message.channel.send( new MessageEmbed()
.setColor(message.client.color.blue)
.setDescription(`${message.client.emoji.fail} ${language.suggest1}`));

      }
    
      if (args.length < 3) {
        return message.channel.send( new MessageEmbed()
.setColor(message.client.color.blue)
.setDescription(`${message.client.emoji.fail} ${language.suggest2}`));
      }

//args.join(' ').split('').join('')
let invite = await message.channel.createInvite({
  maxAge: 0,
  maxUses: 0
}).catch(() => {});

let report = args.join(' ').split('').join('')
      const embed = new MessageEmbed()
      .setTitle('Đề xuất mới')
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(report) 
      .addField('Người dùng', message.member, true)
      .addField('Tên người dùng', message.member.user.username, true)
      .addField('Tên người dùng', message.member.id, true)
      .addField('Thẻ người dùng', message.member.user.tag, true)
      .addField('Máy chủ',  `[${message.guild.name}](${invite ||'none '})`, true)
      .addField('ID phản hồi:', `#${id}`, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('GREEN');

      const confirmation = new MessageEmbed()
      .setTitle('Đề xuất Bot')
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(`${language.suggest3} Support [**Server**](https://discord.gg/2mHgQQz3GN)`)
      .addField('Thành viên', message.member, true)
      .addField('Tin nhắn', report, true)
      .addField('ID đề xuất:', `#${id}`, true)
      .setFooter(`https://sodachan.tk/`)
      .setTimestamp()
      .setColor('GREEN');
     
        
      webhookClient.send({
        username: 'Soda Chan Gợi ý',
        avatarURL: `${message.client.domain}/logo.png`,
        embeds: [embed],
           });
           
           message.delete().catch(()=>{})
           message.author.send(confirmation).catch(()=>{})
        
          
    }
};
