const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Guild = require("../../database/schemas/Guild.js");
const Economy = require("../../models/economy.js")
const mongoose = require("mongoose")
const Logging = require('../../database/schemas/logging.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'setnickname',
        aliases: [ 'nickname', 'nick', 'nn' ],
        description: "Thay đổi Biệt danh của người dùng được cung cấp thành Biệt danh được chỉ định.",
        category: 'Moderation',
        usage: '<user> [reason]',
        examples: [ 'setnickname @yuunya soda', 'setnickname @yuunya "đây là Biệt danh" ' ],
        guildOnly: true,
        botPermission: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_NICKNAMES'],
        userPermission: ['MANAGE_NICKNAMES'],
      });
    }

    async run(message, args) {
     /*------ Guild Data ------*/
  const client = message.client
  const fail = client.emoji.fail
  const success = client.emoji.success
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


    
    const member = getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);

    if (!member)
      return message.reply({ embeds: [new MessageEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTitle(`${fail} Đặt Biệt danh lỗi `)
      .setDescription('Vui lòng cung cấp đề cập người dùng / ID người dùng hợp lệ')
      .setTimestamp()
      .setFooter('https://sodachan.tk/')
      .setColor(message.guild.me.displayHexColor)]});
    if (member.roles.highest.position >= message.member.roles.highest.position && member != message.member)
      return message.reply({ embeds: [new MessageEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTitle(`${fail} Đặt Biệt danh lỗi `)
      .setDescription('Người dùng được cung cấp có vai trò ngang bằng hoặc cao hơn.')
      .setTimestamp()
      .setFooter('https://sodachan.tk/')
      .setColor(message.guild.me.displayHexColor)]});

    if (!args[1]) return message.reply({ embeds: [new MessageEmbed()
    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    .setTitle(`${fail} Đặt Biệt danh lỗi `)
    .setDescription('Vui lòng cung cấp một Biệt danh mới')
    .setTimestamp()
    .setFooter('https://sodachan.tk/')
    .setColor(message.guild.me.displayHexColor)]});


    let nickname = args[1];
    if (nickname.startsWith('"')) {
      nickname = message.content.slice(message.content.indexOf(args[1]) + 1);
      if (!nickname.includes('"')) 
        return message.reply({ embeds: [new MessageEmbed()
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
        .setTitle(`${fail} Đặt Biệt danh lỗi`)
        .setDescription(`Đảm bảo rằng Biệt danh được bao quanh trong Dấu ngoặc kép, **"văn bản"**`)
        .setTimestamp()
        .setFooter('https://sodachan.tk/')
        .setColor(message.guild.me.displayHexColor)]});
      nickname = nickname.slice(0, nickname.indexOf('"'));
      if (!nickname.replace(/\s/g, '').length) return message.reply({ embeds: [new MessageEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTitle(`${fail} Đặt Biệt danh lỗi`)
      .setDescription('Cung cấp Biệt danh')
      .setTimestamp()
      .setFooter('https://sodachan.tk/')
      .setColor(message.guild.me.displayHexColor)]});
    }

    if (nickname.length > 32) {
      return message.reply({ embeds: [new MessageEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTitle(`${fail} Đặt Biệt danh lỗi`)
      .setDescription('Đảm bảo rằng Biệt danh có dưới 32 ký tự')
      .setTimestamp()
      .setFooter('https://sodachan.tk/')
      .setColor(message.guild.me.displayHexColor)]});
      
    } else {

      let reason;
      if (args[1].startsWith('"')) 
        reason = message.content.slice(message.content.indexOf(nickname) + nickname.length + 1);
      else reason = message.content.slice(message.content.indexOf(nickname) + nickname.length);
      if (!reason) reason = 'Không cung cấp lý do';
      if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

      try {

   
        const oldNickname = member.nickname || 'Không';
        const nicknameStatus = `${oldNickname} ➔ ${nickname}`;
        await member.setNickname(nickname);
        const embed = new MessageEmbed()
       
          .setDescription(`${success} | **${oldNickname}**'s Biệt danh đã được đặt thành **${nickname}** ${logging && logging.moderation.include_reason === "true" ?`\n\n*Lý do:** ${reason}`:``}`)
          .setColor(message.guild.me.displayHexColor);
        message.reply({ embeds: [embed]})
        .then(async(s)=>{
          if(logging && logging.moderation.delete_reply === "true"){
            setTimeout(()=>{
            s.delete().catch(()=>{})
            }, 5000)
          }
        })
        .catch(()=>{});


if(logging){
if(logging.moderation.delete_after_executed === "true"){
  message.delete().catch(()=>{})
}

const role = message.guild.roles.cache.get(logging.moderation.ignore_role);
const channel = message.guild.channels.cache.get(logging.moderation.channel)

  if(logging.moderation.toggle == "true"){
    if(channel){
      
    if(message.channel.id !== logging.moderation.ignore_channel){
  if(!role || role && !message.member.roles.cache.find(r => r.name.toLowerCase() === role.name)){

if(logging.moderation.nicknames == "true"){
  
let color = logging.moderation.color;
if(color == "#000000") color = message.client.color.yellow;

let logcase = logging.moderation.caseN
if(!logcase) logcase = `1`

  let reason;

if (args[1].startsWith('"')) {
 reason = message.content.slice(message.content.indexOf(nickname) + nickname.length + 1);
} else {
  reason = message.content.slice(message.content.indexOf(nickname) + nickname.length);
     
} 
if (!reason) reason = 'Không cung cấp lý do';
if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

const logEmbed = new MessageEmbed()
.setAuthor(`Hoạt động: \`set Nickname\` | ${member.user.tag} | Trường hợp #${logcase}`, member.user.displayAvatarURL({ format: 'png' }))
.addField('Người dùng', member, true)
.addField('Người điều hành', message.member, true)
.addField('Lý do', reason, true)
.setFooter(`ID: ${member.id}`)
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
      } catch (err) {
        message.client.logger.error(err.stack);
        message.reply({ embeds: [ new MessageEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTitle(`${fail} Đặt Biệt danh lỗi`)
      .setDescription(`Vui lòng đảm bảo vai trò của tôi cao hơn vai trò của người dùng được cung cấp.`)
      .setTimestamp()
      .setFooter('https://sodachan.tk/')
      .setColor(message.guild.me.displayHexColor)]});
      }
    }  



    }


};    function getMemberFromMention(message, mention) {
    if (!mention) return;
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    return message.guild.members.cache.get(id);
  }