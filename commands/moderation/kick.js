const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Guild = require("../../database/schemas/Guild.js");
const Economy = require("../../models/economy.js")
const mongoose = require("mongoose")
const Logging = require('../../database/schemas/logging.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'kick',
        aliases: [ 'k' ],
        description: 'Kicks người dùng được chỉ định từ máy chủ Discord của bạn.',
        category: 'Moderation',
        usage: '<user> [reason]',
        examples: [ 'kick @Yuunya Phá vỡ các quy tắc' ],
        guildOnly: true,
        botPermission: ['KICK_MEMBERS'],
        userPermission: ['KICK_MEMBERS'],
      });
    }

    async run(message, args) {
     /*------ Guild Data ------*/
  const client = message.client
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


let member = message.mentions.members.last() || message.guild.members.cache.get(args[0]);

if (!member)
return message.reply({ embeds: [ new MessageEmbed()
.setDescription(`${client.emoji.fail} | ${language.banUserValid}`)
.setColor(client.color.red)]});

if (member.id === message.author.id) 
return message.reply({ embeds: [ new MessageEmbed()
.setDescription(`${client.emoji.fail} | ${language.kickYourself}`)
.setColor(client.color.red)]});

if (member.roles.highest.position >= message.member.roles.highest.position)
return message.reply({ embeds: [ new MessageEmbed()
.setDescription(`${client.emoji.fail} | ${language.banHigherRole}`)
.setColor(client.color.red)]});

if (!member.kickable) 
return message.reply({ embeds: [ new MessageEmbed()
.setDescription(`${client.emoji.fail} | ${language.kickKickable}`)
.setColor(client.color.red)]});

let reason = args.slice(1).join(' ');
if (!reason) reason = `${language.noReasonProvided}`;
if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

await member.kick(`${reason} / Người dùng có trách nhiệm: ${message.author.tag}`).catch(err => message.channel.send(new MessageEmbed().setColor(client.color.red).setDescription(`${client.emoji.fail} | Đã xảy ra lỗi: ${err}`)))

const embed = new MessageEmbed()
.setDescription(`${client.emoji.success} | **${member.user.tag}** ${language.kickKick} ${logging && logging.moderation.include_reason === "true" ?`\n\n**Lý do:** ${reason}`:``}`)
.setColor(client.color.green);

message.reply({ embeds: [embed]})

        .then(async(s)=>{
          if(logging && logging.moderation.delete_reply === "true"){
            setTimeout(()=>{
            s.delete().catch(()=>{})
            }, 5000)
          }
        })
        .catch(()=>{});
let dmEmbed;
if(logging && logging.moderation.kick_action && logging.moderation.kick_action !== "1"){

  if(logging.moderation.kick_action === "2"){
dmEmbed = `${message.client.emoji.fail} Bạn đã bị đá khỏi **${message.guild.name}**`
  } else if(logging.moderation.kick_action === "3"){
dmEmbed = `${message.client.emoji.fail} Bạn đã bị đá khỏi **${message.guild.name}**\n\n__**Lý do:**__ ${reason}`
  } else if(logging.moderation.kick_action === "4"){
dmEmbed = `${message.client.emoji.fail} Bạn đã bị đá khỏi **${message.guild.name}**\n\n__**Người điều hành:**__ ${message.author} **(${message.author.tag})**\n__**Lý do:**__ ${reason}`
  }

member.send({ embeds: [new MessageEmbed().setColor(message.client.color.red)
.setDescription(dmEmbed)
]}).catch(()=>{})
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

if(logging.moderation.kick == "true"){
  
let color = logging.moderation.color;
if(color == "#000000") color = message.client.color.red;

let logcase = logging.moderation.caseN
if(!logcase) logcase = `1`

let reason = args.slice(1).join(' ');
if (!reason) reason = `${language.noReasonProvided}`;
if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

const logEmbed = new MessageEmbed()
.setAuthor(`Hoạt động: \`Kick\` | ${member.user.tag} | Trường hợp #${logcase}`, member.user.displayAvatarURL({ format: 'png' }))
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
    }
};
