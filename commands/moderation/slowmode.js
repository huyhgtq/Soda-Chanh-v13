const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Guild = require("../../database/schemas/Guild.js");
const Economy = require("../../models/economy.js")
const mongoose = require("mongoose")
const Logging = require('../../database/schemas/logging.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'slowmode',
        aliases: [ 'sm' ],
        description: 'Bật chế độ làm chậm trong một kênh với tốc độ được chỉ định',
        category: 'Moderation',
        usage: 'slowmode [đề cập kênh / ID] <tỷ lệ> [Lý do]',
        examples: [ 'slowmode #general 10' ],
        guildOnly: true,
        botPermission: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],
        userPermission: ['MANAGE_CHANNELS'],
      });
    }

    async run(message, args) {
     /*------ Guild Data ------*/
  const client = message.client;
  const fail = client.emoji.fail
  const success = client.emoji.success;


  const settings = await Guild.findOne({
    guildId: message.guild.id
}, (err, guild) => {
    if (err) console.error(err)
    if (!guild) {
        const newGuild = new Guild({
          _id: mongoose.Types.ObjectId(),
          guildId: message.guild.id,
          guildName: message.guild.name,
          prefix: client.config.prefix,
          language: "english"
        })

        newGuild.save()
        .then(result => console.log(result))
        .catch(err => console.error(err));

        return message.reply('Máy chủ này không có trong cơ sở dữ liệu của chúng tôi! Chúng tôi đã thêm nó, vui lòng nhập lại lệnh này.').then(m => m.delete({timeout: 10000}));
    }
});
  const logging = await Logging.findOne({ guildId: message.guild.id })
const guildDB = await Guild.findOne({
guildId: message.guild.id
});
const language = require(`../../data/language/${guildDB.language}.json`)



    let index = 1;
    let channel = getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!channel) {
      channel = message.channel;
      index--;
    }

    if (channel.type != 'text' || !channel.viewable) return message.reply({ embeds: [ new MessageEmbed()
    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    .setTitle(`${fail} Chế độ chậm lỗi `)
    .setDescription(`Tôi không thể xem kênh được cung cấp`)
    .setTimestamp()
    .setFooter('https://sodachan.tk/')
    .setColor(message.guild.me.displayHexColor)]});
      
    const rate = args[index];
    if (!rate || rate < 0 || rate > 59) return message.reply({ embeds: [new MessageEmbed()
    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    .setTitle(`${fail} Chế độ chậm lỗi `)
    .setDescription(`Vui lòng cung cấp giới hạn tốc độ từ 0 đến 59 giây`)
    .setTimestamp()
    .setFooter('https://sodachan.tk/')
    .setColor(message.guild.me.displayHexColor)]});
    
  
    const number =  parseInt(rate);
    if(isNaN(number)){
      return message.reply({ embeds: [new MessageEmbed()
    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    .setTitle(`${fail} Chế độ chậm lỗi `)
    .setDescription(`Vui lòng cung cấp giới hạn tốc độ từ 0 đến 59 giây`)
    .setTimestamp()
    .setFooter('https://sodachan.tk/')
    .setColor(message.guild.me.displayHexColor)]});
    };



    if (!channel.permissionsFor(message.guild.me).has(['MANAGE_CHANNELS']))
      return message.reply({ embeds: [new MessageEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTitle(`${fail} Chế độ chậm lỗi `)
      .setDescription(`Hãy đảm bảo rằng tôi có quyền **Quản lý kênh**`)
      .setTimestamp()
      .setFooter('https://sodachan.tk/')
      .setColor(message.guild.me.displayHexColor)]});

    let reason = args.slice(index + 1).join(' ');
    if (!reason) reason = 'Không có lý do nào được cung cấp';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    await channel.setRateLimitPerUser(rate, reason); // set channel rate
    const status = (channel.rateLimitPerUser) ? 'enabled' : 'disabled';
    const embed = new MessageEmbed()
      .setTitle('Slowmode')
      .setFooter(`Để tắt, hãy đặt tỷ lệ thành 0`)
      .setTimestamp()
      .setColor('GREEN');

    if (rate === '0') {
      message.reply({ embeds: [new MessageEmbed()
        .setDescription(`${success} Chế độ chậm đã được tắt thành công${logging && logging.moderation.include_reason === "true" ?`\n\n**Lý do:** ${reason}`:``}`)
        .setColor(message.guild.me.displayHexColor)
      ]}).then(async(s)=>{
          if(logging && logging.moderation.delete_reply === "true"){
            setTimeout(()=>{
            s.delete().catch(()=>{})
            }, 5000)
          }
        })
        .catch(()=>{});
    

    } else {

      message.reply({ embeds: [new MessageEmbed()
        .setDescription(`${success} | Chế độ Chậm đã được bật thành công **1 tin nhắn /${rate}s** ${logging && logging.moderation.include_reason === "true" ?`\n\n**Lý do:** ${reason}`:``}`)
        .setColor(message.guild.me.displayHexColor)
      ]}).then(async(s)=>{
          if(logging && logging.moderation.delete_reply === "true"){
            setTimeout(()=>{
            s.delete().catch(()=>{})
            }, 5000)
          }
        })
        .catch(()=>{});
    }



if(logging){
if(logging.moderation.delete_after_executed === "true"){
  message.delete().catch(()=>{})
}

const role = message.guild.roles.cache.get(logging.moderation.ignore_role);
const channel = message.guild.channels.cache.get(logging.moderation.channel)

  if(logging.moderation.slowmode == "true"){
    if(channel){
      
    if(message.channel.id !== logging.moderation.ignore_channel){
       if(!role || role && !message.member.roles.cache.find(r => r.name.toLowerCase() === role.name)){

if(logging.moderation.kick == "true"){
  
let color = logging.moderation.color;
if(color == "#000000") color = message.client.color.yellow;

let logcase = logging.moderation.caseN
if(!logcase) logcase = `1`

let reason = args.slice(1).join(' ');
if (!reason) reason = `${language.noReasonProvided}`;
if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

const logEmbed = new MessageEmbed()
.setAuthor(`Hoạt động: \`Slow Mode\` | ${message.author.tag} | Trường hợp #${logcase}`, message.author.displayAvatarURL({ format: 'png' }))
.addField('Người dùng', message.member, true)
.addField('Lý do', reason, true)
.setFooter(`ID: ${message.author.id}`)
.setTimestamp()
.setColor(color)

channel.send({ embeds: [logEmbed]}).catch(()=>{})

logging.moderation.caseN = logcase + 1
await logging.save().catch(()=>{})
}
      }
    }
    }
  }
}
    }
};


  function getChannelFromMention(message, mention) {
    if (!mention) return;
    const matches = mention.match(/^<#(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    return message.guild.channels.cache.get(id);
  }
