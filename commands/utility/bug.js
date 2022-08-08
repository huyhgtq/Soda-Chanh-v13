const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const config = require('../../config.json');
const webhookClient = new Discord.WebhookClient({ 
id: `${config.webhook_id}`,
token: `${config.webhook_url}`});

const Guild = require('../../database/schemas/Guild');
const crypto = require("crypto");

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'reportbug',
        aliases: ['bugreport', 'bug'],
        description: 'Báo cáo lỗi cho Soda Chan!',
        category: 'Utility',
        usage: [ '<tin nhắn>' ],
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
        return message.reply({ embeds: [new MessageEmbed()
.setColor(message.client.color.blue)
.setDescription(`${message.client.emoji.fail} ${language.report1}`)]});
      }
    
      if (args.length < 3) {
        return message.reply({ embeds: [new MessageEmbed()
.setColor(message.client.color.blue)
.setDescription(`${message.client.emoji.fail} ${language.report2}`)]});
      }

let invite = await message.channel.createInvite({
  maxAge: 0,
  maxUses: 0
}).catch(() => {});

let report = args.join(' ').split('').join('')
      const embed = new MessageEmbed()
      .setTitle('Bug Report')
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(report) 
      .addField('Tên người dùng', message.member.user.username, true)
      .addField('ID người dùng', message.member.id, true)
      .addField('Thẻ người dùng', message.member.user.tag, true)
      .addField('Máy chủ',  `[${message.guild.name}](${invite ||'không '})`, true)
      .addField('ID báo cáo lỗi:', `#${id}`, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor('GREEN');

      const confirmation = new MessageEmbed()
      .setTitle('Bảng báo cáo lỗi')
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(`${language.report3} Support [**Server**](https://discord.gg/FqdH4sfKBg)`)
      .addField('Tin nhắn Báo cáo của bạn', report, true)
      .addField('ID báo cáo lỗi của bạn:', `#${id}`, true)
      .setFooter('nếu mà bạn không nhận bất cứ gì từ developers : hãy chụp lại bảng Bảng báo cáo lỗi và gửi cho họ')
      .setTimestamp()
      .setColor('GREEN')
	  
    
    
        
      webhookClient.send({
        username: 'Soda Chan Bug Report',
        avatarURL: `${message.client.domain}/logo.png`,
        embeds: [embed],
      });
      
      message.reply({ embeds: [confirmation]})

    }
};
