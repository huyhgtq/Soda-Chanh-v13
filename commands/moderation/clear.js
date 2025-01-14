const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Guild = require("../../database/schemas/Guild.js");
const Economy = require("../../models/economy.js")
const Logging = require('../../database/schemas/logging.js')
const mongoose = require("mongoose")

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'clear',
        aliases: [ 'clear', 'c'],
        description: 'Xóa số lượng tin nhắn được chỉ định',
        category: 'Moderation',
        usage: 'clear [kênh] [người dùng] <số tin nhắn> [lý do]',
        examples: ['clear 20', 'clear #chung 10', 'clear @yuunya 50', 'clear #chung @yuunya 5'],
        guildOnly: true,
        botPermission: ['MANAGE_MESSAGES'],
        userPermission: ['MANAGE_MESSAGES'],
      });
    }

    async run(message, args) {

try {


  const logging = await Logging.findOne({ guildId: message.guild.id })

 /*------ Guild Data ------*/
  const client = message.client;
  const fail = client.emoji.fail;
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

const guildDB = await Guild.findOne({
guildId: message.guild.id
});
const language = require(`../../data/language/${guildDB.language}.json`)


  

    let channel = getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;

    if (channel.type != 'text' || !channel.viewable) return message.reply({ embeds: [ new MessageEmbed()
    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    .setTitle(`${fail} lỗi khi xoá tin nhắn`)
    .setDescription(`Hãy đảm bảo rằng tôi có thể xem kênh đó`)
    .setTimestamp()
    .setFooter('https://sodachan.tk/')
    .setColor(message.guild.me.displayHexColor)]});


    const member = message.mentions.members.first() || getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);

    if (member) {
      args.shift();
    }
   

    const amount = parseInt(args[0]);
    if (isNaN(amount) === true || !amount || amount < 0 || amount > 100)
      return message.reply({ embeds: [new MessageEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTitle(`${fail} lỗi khi xoá tin nhắn`)
      .setDescription(`Tôi chỉ có thể xóa từ 1 đến 100 tin nhắn.`)
      .setTimestamp()
      .setFooter('https://sodachan.tk/')
      .setColor(message.guild.me.displayHexColor)]});


    if (!channel.permissionsFor(message.guild.me).has(['MANAGE_MESSAGES']))
      return message.reply({ embeds: [ new MessageEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTitle(`${fail} lỗi khi xoá tin nhắn`)
      .setDescription(`Hãy đảm bảo rằng tôi có quyền **Quản lý tin nhắn**!`)
      .setTimestamp()
      .setFooter('https://sodachan.tk/')
      .setColor(message.guild.me.displayHexColor)]});

    let reason = args.slice(1).join(' ');
    if (!reason) reason = 'None';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await message.delete(); 
    
    let messages;
    if (member) {
 messages = (await channel.messages.fetch({ limit: amount })).filter(m => m.member.id === member.id);
    } else messages = amount;

    if (messages.size === 0) { 

      message.reply({ embeds: [new MessageEmbed()
          .setDescription(`
            ${fail} Không thể tìm thấy bất kỳ tin nhắn nào từ ${member}. 
          `)
          .setColor(message.guild.me.displayHexColor)
      ]}).then(msg => msg.delete({ timeout: 10000 })).catch(()=>{})

    } else { 
      

      channel.bulkDelete(messages, true).then(messages => {
        const embed = new MessageEmbed()
        
          .setDescription(`
            ${success} Đã xóa thành công **${messages.size}** tin nhắn(s) ${logging && logging.moderation.include_reason === "true" ?`\n\n**Lý do:** ${reason}`:``}
          `)

          .setColor(message.guild.me.displayHexColor);
  
        if (member) {
          embed
            .spliceFields(1, 1, { name: 'Found Messages', value:  `\`${messages.size}\``, inline: true})
            .spliceFields(1, 0, { name: 'Member', value: member, inline: true});
        }

        message.reply({ embeds: [embed]})
      .then(async(s)=>{
          if(logging && logging.moderation.delete_reply === "true"){
            setTimeout(()=>{
            s.delete().catch(()=>{})
            }, 5000)
          }
        })
        .catch(()=>{});
      });
    }


    const fields = { 
      Channel: channel
    };

    if (member) {
      fields['Member'] = member;
      fields['Messages'] = `\`${messages.size}\``;
    } else fields['Message Count'] = `\`${amount}\``;
    

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
      
if(logging.moderation.purge == "true"){
  
let color = logging.moderation.color;
if(color == "#000000") color = message.client.color.red;

let logcase = logging.moderation.caseN
if(!logcase) logcase = `1`

const logEmbed = new MessageEmbed()
.setAuthor(`Hoạt động: \`Clear\` | Trường hợp #${logcase}`, message.author.displayAvatarURL({ format: 'png' }))
.addField('Người điều hành', message.member, true)
.setTimestamp()
.setFooter(`ID có trách nhiệm: ${message.author.id}`)
.setColor(color)

for (const field in fields) {
        logEmbed.addField(field, fields[field], true);
}

channel.send({ embeds: [logEmbed]}).catch(()=>{})

logging.moderation.caseN = logcase + 1
await logging.save().catch(()=>{})
}
      
    }
    }
    }
  }
}

} catch {
  return message.reply(`${message.client.emoji.fail} | Không thể xóa tin nhắn`)
}

  }
};


function getMemberFromMention(message, mention) {
    if (!mention) return;
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    return message.guild.members.cache.get(id);
  }

function getChannelFromMention(message, mention) {
    if (!mention) return;
    const matches = mention.match(/^<#(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    return message.guild.channels.cache.get(id);
  }