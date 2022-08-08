const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Guild = require("../../database/schemas/Guild.js");
const Economy = require("../../models/economy.js")
const mongoose = require("mongoose")
const ms = require("ms")
const muteModel = require("../../models/mute.js")
const Discord = require("discord.js");
const Logging = require('../../database/schemas/logging.js')
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'mute',
        aliases: [ 'm','tempmute' ],
        description: 'Tắt tiếng người dùng được chỉ định khỏi guild',
        category: 'Moderation',
        usage: '<user> [time]',
        examples: [ 'mute @Yuunya 1h Ngừng gửi thư rác' ],
		disabled: true,
        guildOnly: true,
        botPermission: ['MANAGE_ROLES', 'MANAGE_CHANNELS'],
        userPermission: ['MANAGE_ROLES'],
        
      });
    }

    async run(message, args) {
        let client = message.client
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
  
     let mentionedMember = message.mentions.members.last() || message.guild.members.cache.get(args[0]);

    const msRegex = RegExp(/(\d+(s|m|h|w))/)
    let muteRole = await message.guild.roles.cache.get(logging.moderation.mute_role);

     if (!mentionedMember) {
        return message.reply({ embeds: [new Discord.MessageEmbed()
            .setDescription(`${client.emoji.fail} | ${language.banUserValid}`)
            .setColor(client.color.red)]})
    }
    else if (!msRegex.test(args[1])) {
        return message.reply({ embeds: [new Discord.MessageEmbed()
            .setDescription(`${client.emoji.fail} | ${language.muteTime}`)
            .setColor(client.color.red)]})
    }

    if (!muteRole) {
        muteRole = await message.guild.roles.create({
            data: {
                name: 'Muted',
                color: 'BLACK',
            }
        }).catch(()=>{})

        logging.moderation.mute_role = muteRole.id;
        await logging.save().catch(()=>{})
    }

    if (mentionedMember.roles.highest.position >= message.guild.me.roles.highest.position) {
        return message.reply({ embeds: [new Discord.MessageEmbed()
            .setDescription(`${client.emoji.fail} | ${language.muteRolePosition}`)
            .setColor(client.color.red)]})
    }
    else if (muteRole.position >= message.guild.me.roles.highest.position) {
        return message.reply({ embeds: [new Discord.MessageEmbed()
            .setDescription(`${client.emoji.fail} | ${language.muteRolePositionBot}`)
            .setColor(client.color.red)]})
    }

    const isMuted = await muteModel.findOne({
        guildID: message.guild.id,
        memberID: mentionedMember.user.id,
    })

    if (isMuted) {
        return message.reply({ embeds: [new Discord.MessageEmbed()
            .setDescription(`${client.emoji.fail} | ${language.muteMuted}`)
            .setColor(client.color.red)]})
    }
let reason = args.slice(1).join(' ');
if (!reason) reason = `${language.noReasonProvided}`;
if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
      let dmEmbed;
if(logging && logging.moderation.mute_action && logging.moderation.mute_action !== "1"){

  if(logging.moderation.mute_action === "2"){
dmEmbed = `${message.client.emoji.fail} Bạn đã bị tắt tiếng trong **${message.guild.name}** vì **${msRegex.exec(args[1])[1]}**`
  } else if(logging.moderation.mute_action === "3"){
dmEmbed = `${message.client.emoji.fail} Bạn đã bị tắt tiếng trong **${message.guild.name} ** vì **${msRegex.exec(args[1])[1]}**\n\n__**Lý do:**__ ${reason}`
  } else if(logging.moderation.mute_action === "4"){
dmEmbed = `${message.client.emoji.fail} Bạn đã bị tắt tiếng trong **${message.guild.name}** vì **${msRegex.exec(args[1])[1]}**\n\n__**Người điều hành:**__ ${message.author} **(${message.author.tag})**\n__**Lý do:**__ ${reason}`
  }

mentionedMember.send({ embeds: [new MessageEmbed().setColor(message.client.color.red)
.setDescription(dmEmbed)
]}).catch(()=>{})
}
   message.reply({ embeds: [new Discord.MessageEmbed().setColor(message.client.color.green).setDescription(`${message.client.emoji.success} | Đã tắt tiếng **${mentionedMember.user.tag}** vì **${msRegex.exec(args[1])[1]}** ${logging && logging.moderation.include_reason === "true" ?`\n\n**Lý do:** ${reason}`:``}`)]}).then(async(s)=>{
          if(logging && logging.moderation.delete_reply === "true"){
            setTimeout(()=>{
            s.delete().catch(()=>{})
            }, 5000)
          }
        })
        .catch(()=>{});

    for (const channel of message.guild.channels.cache) {
        channel[1].updateOverwrite(muteRole, {
            SEND_MESSAGES: false,
            CONNECT: false,
        }).catch(()=>{})
    }

    const noEveryone = mentionedMember.roles.cache.filter(r => r.name !== '@everyone' && !r.managed && r.id !== muteRole.id) 

  let delaynumber = 750;
  if(mentionedMember.roles.cache.size - 1 > 10) delaynumber = 3000;

    if(logging && logging.moderation.remove_roles === "true"){
    for (const role of noEveryone) {
  
 await mentionedMember.roles.remove(role, [`Lý do: Lệnh tắt tiếng - ${reason} | Người dùng có trách nhiệm: ${message.author.tag}`]).catch(()=>{})
 await delay(delaynumber);
      
       
    }
    }

    await mentionedMember.roles.add(muteRole.id, [`Lệnh tắt tiếng - ${reason} / Người dùng có trách nhiệm: ${message.author.tag}`]).catch(()=>{})

    const muteDoc = new muteModel({
        guildID: message.guild.id,
        memberID: mentionedMember.user.id,
        length: Date.now() + ms(msRegex.exec(args[1])[1]),
        memberRoles: noEveryone.map(r => r)
    })

    await muteDoc.save().catch(()=>{})
 
 
    
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

if(logging.moderation.mute == "true"){
  
let color = logging.moderation.color;
if(color == "#000000") color = message.client.color.red;

let logcase = logging.moderation.caseN
if(!logcase) logcase = `1`

const logEmbed = new MessageEmbed()
.setAuthor(`Hoạt động: \`Mute\` | ${mentionedMember.user.tag} | Trường hợp #${logcase}`, mentionedMember.user.displayAvatarURL({ format: 'png' }))
.addField('Người dùng', mentionedMember, true)
.addField('Người điều hành', message.member, true)
.addField('Thời gian',  msRegex.exec(args[1])[1], true)
.setFooter(`ID: ${mentionedMember.id}`)
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
        
        setTimeout(async () => {
        const isMuted = await muteModel.findOne({
        guildID: message.guild.id,
        memberID: mentionedMember.user.id,
    })
    

        let muteRole = await message.guild.roles.cache.get(logging.moderation.mute_role);

  
    await mentionedMember.roles.remove(muteRole.id, [`Lệnh tắt tiếng / Người dùng có trách nhiệm: ${message.author.tag}`]).catch(()=>{})


    if(logging && logging.moderation.remove_roles === "true"){
    for (const role of isMuted.memberRoles) {
 const roleM = await message.guild.roles.cache.get(role);
if(roleM){
 await mentionedMember.roles.add(roleM, ["Lệnh tắt tiếng, thời lượng tắt tiếng đã hết hạn."]).catch(()=>{})
 await delay(750);
}
 
    }
    }

     await isMuted.deleteOne().catch(()=>{})
      




                    if(logging){
  
const role = message.guild.roles.cache.get(logging.moderation.ignore_role);
const channel = message.guild.channels.cache.get(logging.moderation.channel)

  if(logging.moderation.toggle == "true"){
    if(channel){
    if(message.channel.id !== logging.moderation.ignore_channel){
      if(!message.member.roles.cache.find(r => r.name.toLowerCase() === role.name)) {

if(logging.moderation.mute == "true"){
  
let color = logging.moderation.color;
if(color == "#000000") color = message.client.color.green;

let logcase = logging.moderation.caseN
if(!logcase) logcase = `1`

const logEmbedm = new MessageEmbed()
.setAuthor(`Hoạt động: \`Un Mute\` | ${mentionedMember.user.tag} | Trường hợp #${logcase}`, mentionedMember.user.displayAvatarURL({ format: 'png' }))
.addField('Người sử dụng', mentionedMember, true)
.addField('Lý do',  'Thời lượng tắt tiếng đã hết hạn', true)
.setFooter(`ID: ${mentionedMember.id}`)
.setTimestamp()
.setColor(color)

channel.send({ embeds: [logEmbedm]}).catch(()=>{})

logging.moderation.caseN = logcase + 1
await logging.save().catch(()=>{})
}
      }
    }
    }
  }
}

        }, ms(msRegex.exec(args[1])[1]))
    }
};
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
