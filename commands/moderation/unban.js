const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Guild = require("../../database/schemas/Guild.js");
const Economy = require("../../models/economy.js")
const mongoose = require("mongoose")
const Discord = require("discord.js")

const Logging = require('../../database/schemas/logging.js')
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'unban',
        aliases: [ 'ub', 'uban'],
        description: 'bỏ cấm người dùng được chỉ định khỏi máy chủ',
        category: 'Moderation',
        usage: '<user-ID>',
        examples: [ 'unban  451699780423385089' ],
        guildOnly: true,
        botPermission: ['BAN_MEMBERS'],
        userPermission: ['BAN_MEMBERS'],
      });
    }

    async run(message, args) {
let client = message.client

/*------ Guild Data ------*/
    const logging = await Logging.findOne({ guildId: message.guild.id })
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

        return message.channel.send('Máy chủ này không có trong cơ sở dữ liệu của chúng tôi! Chúng tôi đã thêm nó, vui lòng nhập lại lệnh này.').then(m => m.delete({timeout: 10000}));
    }
});

const guildDB = await Guild.findOne({
guildId: message.guild.id
});
const language = require(`../../data/language/${guildDB.language}.json`)

const rgx = /^(?:<@!?)?(\d+)>?$/;





const id = args[0];
if(!id) {
  
const embed = new MessageEmbed()
.setAuthor(message.author.tag, message.author.displayAvatarURL())
.setDescription(`**Sử dụng hợp lý:**\n\n\`1-\` unban Yuu Nya#8479 đã kháng cáo\n\`2-\` unban 451699780423385089 kháng cáo\n\`3-\` unban all`)
.setColor(message.client.color.red)
.setFooter('https://sodachan.tk/')

message.channel.send(embed)
  return
}

if(id.toString().toLowerCase() == "all"){
  const bannedUsers = await message.guild.fetchBans();
   const users = await message.guild.fetchBans();
   const array = [];

let reason = `Unban All`


        for (const user of users.array()) {
          await message.guild.members.unban(user.user, `${reason} / ${language.unbanResponsible}: ${message.author.tag}`);
          array.push(user.user.tag)
        }

if(!array || !array.length){
const embed = new MessageEmbed()
.setDescription(`${client.emoji.fail} | Máy chủ hiện tại không có người dùng bị cấm.`)
.setColor(client.color.green)

message.channel.send(embed).catch(()=>{})
} else {
const embed = new MessageEmbed()
.setDescription(`${client.emoji.success} | ${language.unbanSuccess} **${array.length}** Người dùng từ máy chủ. \n\n**Users:**\n${array.join(" - ")} ${logging && logging.moderation.include_reason === "true" ?`\n\n**Lý do:** ${reason}`:``}`)
.setColor(client.color.green)

message.channel.send(embed)
.then(async(s)=>{
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

  if(logging.moderation.toggle == "true"){
    if(channel){
    if(message.channel.id !== logging.moderation.ignore_channel){
     if(!role || role && !message.member.roles.cache.find(r => r.name.toLowerCase() === role.name)){

if(logging.moderation.ban == "true"){
  
let color = logging.moderation.color;
if(color == "#000000") color = message.client.color.yellow;

let logcase = logging.moderation.caseN
if(!logcase) logcase = `1`

let bannedUsersLength = `${array.length} người dùng`
if(!array || !array.length) bannedUsersLength = 'Không có người dùng'
if(array.length === 1) bannedUsersLength = '1 người dùng'
const logEmbed = new MessageEmbed()
.setAuthor(`Hoạt động: \`UnBan All\` | ${bannedUsersLength} | Trường hợp #${logcase}`, message.author.displayAvatarURL({ format: 'png' }))
.addField('Bỏ cấm người dùng', `${bannedUsersLength}`, true)
.addField('Người điều hành', message.member, true)
.setTimestamp()
.setColor(color)

if(array.length) logEmbed.addField('**Người dùng:**', array.join(" - "))
channel.send(logEmbed).catch(()=>{})

logging.moderation.caseN = logcase + 1
await logging.save().catch(()=>{})
}
      }
    }
    }
  }
}

} else {


if (!rgx.test(id)) {

let members = client.users.cache.filter(user => user.tag === args[0]).map(user => user.id).toString();


const bannedUsers1 = await message.guild.fetchBans();
const user1 = bannedUsers1.get(members);



if(user1){
let reason = args.slice(1).join(' ');
if (!reason) reason = language.unbanNoReason;
if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

const userrz = bannedUsers1.get(members).user;
if(userrz){
const embed = new MessageEmbed()
.setDescription(`${client.emoji.success} | ${language.unbanSuccess} ${userrz.tag} ${logging && logging.moderation.include_reason === "true" ?`\n\n**Lý do:** ${reason}`:``}`)
.setColor(client.color.green)

message.reply({ embeds: [embed]}).catch(()=>{})
await message.guild.members.unban(userrz, `${reason} / ${language.unbanResponsible}: ${message.author.tag}`).then(async(s)=>{
          if(logging && logging.moderation.delete_reply === "true"){
            setTimeout(()=>{
            s.delete().catch(()=>{})
            }, 5000)
          }
        })
        .catch(()=>{});


//log
if(logging){
    if(logging.moderation.delete_after_executed === "true"){
  message.delete().catch(()=>{})
}
const role = message.guild.roles.cache.get(logging.moderation.ignore_role);
const channel = message.guild.channels.cache.get(logging.moderation.channel)

  if(logging.moderation.toggle == "true"){
    if(channel){
    if(message.channel.id !== logging.moderation.ignore_channel){
      if(!message.member.roles.cache.find(r => r.name.toLowerCase() === role.name)) {

if(logging.moderation.ban == "true"){
  
let color = logging.moderation.color;
if(color == "#000000") color = message.guild.me.displayHexColor;

let logcase = logging.moderation.caseN
if(!logcase) logcase = `1`

let reason = args.slice(1).join(' ');
if (!reason) reason = `${language.noReasonProvided}`;
if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

const logEmbed = new MessageEmbed()
.setAuthor(`Hoạt động: \`UnBan\` | ${userrz.tag} | Trường hợp #${logcase}`, userrz.displayAvatarURL({ format: 'png' }))
.addField('Người dùng', userrz, true)
.addField('Người điều hành', message.member, true)
.setFooter(`ID: ${userrz.id}`)
.setTimestamp()
.setColor(color)

channel.send({ embeds: [logEmbed]}).catch((e)=>{console.log(e)})

logging.moderation.caseN = logcase + 1
await logging.save().catch(()=>{})
}
      }
    }
    }
  }
}
} else {
  
message.reply({ embeds: [new MessageEmbed()
.setDescription(`${client.emoji.fail} | ${language.unbanInvalidID}`)
.setColor(client.color.red)]});

}


} else {


message.reply({ embeds: [new MessageEmbed()
.setDescription(`${client.emoji.fail} | ${language.unbanInvalidID}`)
.setColor(client.color.red)]});

}
  

  return;
}

const bannedUsers = await message.guild.fetchBans();
const user = bannedUsers.get(id);
if (!user) return message.reply({ embeds: [new MessageEmbed()
.setDescription(`${client.emoji.fail} | ${language.unbanInvalidID}`)
.setColor(client.color.red)]});

let reason = args.slice(1).join(' ');
if (!reason) reason = language.unbanNoReason;
if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

const userr = bannedUsers.get(id).user;
await message.guild.members.unban(user.user, `${reason} / ${language.unbanResponsible}: ${message.author.tag}`);

const embed = new MessageEmbed()
.setDescription(`${client.emoji.success} | ${language.unbanSuccess} ${userr.tag} ${logging && logging.moderation.include_reason === "true" ?`\n\n**Lý do:** ${reason}`:``}`)
.setColor(client.color.green)

message.reply({ embeds: [embed]}).then(async(s)=>{
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
      if(!message.member.roles.cache.find(r => r.name.toLowerCase() === role.name)) {

if(logging.moderation.ban == "true"){
  
let color = logging.moderation.color;
if(color == "#000000") color = message.guild.me.displayHexColor;

let logcase = logging.moderation.caseN
if(!logcase) logcase = `1`

let reason = args.slice(1).join(' ');
if (!reason) reason = `${language.noReasonProvided}`;
if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

const logEmbed = new MessageEmbed()
.setAuthor(`Hoạt động: \`UnBan\` | ${userr.tag} | Trường hợp #${logcase}`, userr.displayAvatarURL({ format: 'png' }))
.addField('Người dùng', userr, true)
.addField('Người điều hành', message.member, true)
.setFooter(`ID: ${userr.id}`)
.setTimestamp()
.setColor(color)

channel.send({ embeds: [logEmbed]}).catch((e)=>{console.log(e)})

logging.moderation.caseN = logcase + 1
await logging.save().catch(()=>{})
}
      }
    }
    }
  }
}

    }

    }
};