const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Guild = require("../../database/schemas/Guild.js");
const warnModel = require('../../models/moderation.js');
const mongoose = require('mongoose');
const Discord = require("discord.js")
const randoStrings = require("randostrings")
const random = new randoStrings
const Logging = require('../../database/schemas/logging.js')
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'warn',
        aliases: ['w'],
        description: 'Đưa ra cảnh báo cho người dùng được chỉ định từ máy chủ Discord của bạn.',
        category: 'Moderation',
        usage: '<người dùng> [lý do]',
        examples: [ 'warn @Yuunya Xin đừng thề.' ],
        guildOnly: true,
        userPermission: ['KICK_MEMBERS'],
      });
    }

    async run(message, args) {
/*------ Guild Data ------*/
const client = message.client
const settings = await Guild.findOne(
  {
    guildId: message.guild.id
  },
  (err, guild) => {
    if (err) console.error(err);
    if (!guild) {
      const newGuild = new Guild({
        _id: mongoose.Types.ObjectId(),
        guildId: message.guild.id,
        guildName: message.guild.name,
        prefix: client.config.prefix,
        language: 'english'
      });

      newGuild
        .save()
        .then(result => console.log(result))
        .catch(err => console.error(err));

      return message.reply('Máy chủ này không có trong cơ sở dữ liệu của chúng tôi! Chúng tôi đã thêm nó, vui lòng nhập lại lệnh này.')
        .then(m => m.delete({ timeout: 10000 }));
    }
  }
);
  const logging = await Logging.findOne({ guildId: message.guild.id })
const guildDB = await Guild.findOne({
  guildId: message.guild.id
});
let language = require(`../../data/language/${guildDB.language}.json`)

    const mentionedMember = message.mentions.members.last() || message.guild.members.cache.get(args[0])
    
 if (!mentionedMember) {
      return message.reply({ embeds: [new Discord.MessageEmbed()
          .setDescription(`${client.emoji.fail} | ${language.warnMissingUser}`)
          .setTimestamp(message.createdAt)
          .setColor(client.color.red)]})
  }

  const mentionedPotision = mentionedMember.roles.highest.position
  const memberPotision = message.member.roles.highest.position

  if (memberPotision <= mentionedPotision) {
      return message.reply({ embeds: [new Discord.MessageEmbed()
      .setDescription(client.emoji.fail + " | " + language.warnHigherRole)
          .setTimestamp(message.createdAt)
          .setColor(client.color.red)]})
  }

  const reason = args.slice(1).join(' ') || 'Không được chỉ định'
  
  let warnID = random.password({
    length: 8,
    string: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  })

  let warnDoc = await warnModel.findOne({
      guildID: message.guild.id,
      memberID: mentionedMember.id,
  }).catch(err => console.log(err))

  if (!warnDoc) {
      warnDoc = new warnModel({
          guildID: message.guild.id,
          memberID: mentionedMember.id,
          modAction: [],
          warnings: [],
          warningID: [],
          moderator: [],
          date: [],
      })

      await warnDoc.save().catch(err => console.log(err));

      warnDoc = await warnModel.findOne({
      guildID: message.guild.id,
      memberID: mentionedMember.id,
  })
  
  }
      warnDoc.modType.push("warn")
      warnDoc.warnings.push(reason)
      warnDoc.warningID.push(warnID)
      warnDoc.moderator.push(message.member.id)
      warnDoc.date.push(Date.now())

      await warnDoc.save().catch(err => console.log(err))
      let dmEmbed;
if(logging && logging.moderation.warn_action && logging.moderation.warn_action !== "1"){

  if(logging.moderation.warn_action === "2"){
dmEmbed = `${message.client.emoji.fail} Bạn đã được cảnh báo trong **${message.guild.name}**`
  } else if(logging.moderation.warn_action === "3"){
dmEmbed = `${message.client.emoji.fail} Bạn đã được cảnh báo trong **${message.guild.name}**\n\n__**Lý do:**__ ${reason}`
  } else if(logging.moderation.warn_action === "4"){
dmEmbed = `${message.client.emoji.fail} Bạn đã được cảnh báo trong **${message.guild.name}**\n\n__**Người điều hành:**__ ${message.author} **(${message.author.tag})**\n__**Lý do:**__ ${reason}`
  }

mentionedMember.send(new MessageEmbed().setColor(message.client.color.red)
.setDescription(dmEmbed)
).catch(()=>{})
}
      message.reply({ embeds: [new Discord.MessageEmbed().setColor(client.color.green).setDescription(`${language.warnSuccessful
      
      .replace("{emoji}", client.emoji.success)
      .replace("{user}", `**${mentionedMember.user.tag}** `)}
      ${logging && logging.moderation.include_reason === "true" ?`\n\n**Lý do:** ${reason}`:``}`)]}).then(async(s)=>{
          if(logging && logging.moderation.delete_reply === "true"){
            setTimeout(()=>{
            s.delete().catch(()=>{})
            }, 5000)
          }
        })
        .catch(()=>{});
      
      if(logging && logging.moderation.auto_punish.toggle === "true"){
        if(Number(logging.moderation.auto_punish.amount) <= Number(warnDoc.warnings.length)){

          const punishment = logging.moderation.auto_punish.punishment;
          let action;

          if(punishment === "1"){
          action = `banned`;

          await mentionedMember.ban({ reason: `Tự động trừng phạt / Người dùng có trách nhiệm: ${message.author.tag}` }).catch(()=>{})

          } else if (punishment === "2"){
          action = `kicked`;

await mentionedMember.kick({ reason: `Tự động trừng phạt / Người dùng có trách nhiệm: ${message.author.tag}` }).catch(()=>{})


          } else if (punishment === "3"){
          action = `softbanned`;

await mentionedMember.ban({ reason:`Tự động trừng phạt / ${language.softbanResponsible}: ${message.author.tag}`, days: 7 });
await message.guild.members.unban(mentionedMember.user, `Tự động trừng phạt / ${language.softbanResponsible}: ${message.author.tag}`);

          }

          message.reply({ embeds: [new Discord.MessageEmbed().setColor(message.client.color.green).setDescription(`Tự động trừng phạt được kích hoạt, ${action} **${mentionedMember.user.tag}** ${message.client.emoji.success}`)]})
          
          const auto = logging.moderation.auto_punish;
          if(auto.dm && auto.dm !== "1"){
            let dmEmbed;
            if(auto.dm === "2"){
            dmEmbed = `${message.client.emoji.fail} Bạn đã từng ${action} từ **${message.guild.name}**\n__(Tự động trừng phạt được kích hoạt)__`
            } else if(auto.dm === "3"){
            dmEmbed = `${message.client.emoji.fail} Bạn đã từng ${action} từ **${message.guild.name}**\n__(Tự động trừng phạt được kích hoạt)__\n\n**Số lượng cảnh báo:** ${warnDoc.warnings.length}`
            };

            mentionedMember.send({ embeds: [new MessageEmbed()
            .setColor(message.client.color.red)
            .setDescription(dmEmbed)
            ]})
          }

        }
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

if(logging.moderation.warns == "true"){
  
let color = logging.moderation.color;
if(color == "#000000") color = message.client.color.red;

let logcase = logging.moderation.caseN
if(!logcase) logcase = `1`

const logEmbed = new MessageEmbed()
.setAuthor(`Hoạt động: \`Warn\` | ${mentionedMember.user.tag} | Trường hợp #${logcase}`, mentionedMember.user.displayAvatarURL({ format: 'png' }))
.addField('Người dùng', mentionedMember, true)
.addField('Người điều hành', message.member, true)
.addField('Lý do', reason, true)
.setFooter(`ID: ${mentionedMember.id} | ID Cảnh báo: ${warnID}`)
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



function match(msg, i) {
  if (!msg) return undefined;
  if (!i) return undefined;
  let user = i.members.cache.find(
    m =>
      m.user.username.toLowerCase().startsWith(msg) ||
      m.user.username.toLowerCase() === msg ||
      m.user.username.toLowerCase().includes(msg) ||
      m.displayName.toLowerCase().startsWith(msg) ||
      m.displayName.toLowerCase() === msg ||
      m.displayName.toLowerCase().includes(msg)
  );
  if (!user) return undefined;
  return user.user;
}
};
};
