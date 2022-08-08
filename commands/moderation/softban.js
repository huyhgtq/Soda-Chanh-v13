const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Guild = require("../../database/schemas/Guild.js");
const Economy = require("../../models/economy.js")
const mongoose = require("mongoose")
  const Logging = require('../../database/schemas/logging.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'softban',
        aliases: [ 'sb', 'sban'],
        description: 'Softban người dùng được chỉ định từ máy chủ',
        category: 'Moderation',
        usage: '<người dùng> [lý do]',
        examples: [ 'softban @Yuunya Phá vỡ các quy tắc' ],
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

        return message.reply('Máy chủ này không có trong cơ sở dữ liệu của chúng tôi! Chúng tôi đã thêm nó, vui lòng nhập lại lệnh này.').then(m => m.delete({timeout: 10000}));
    }
});

const guildDB = await Guild.findOne({
guildId: message.guild.id
});
const language = require(`../../data/language/${guildDB.language}.json`)


const member = message.mentions.members.last() || message.guild.members.cache.get(args[0]);

if (!member)
return message.reply({ embeds: [new MessageEmbed()
.setDescription(`${client.emoji.fail} | ${language.softbanNoUser}`)
.setColor(client.color.red)]});

if (member === message.member) 
return message.reply({ embeds: [new MessageEmbed()
.setDescription(`${client.emoji.fail} | ${language.softbanSelfUser}`)
.setColor(client.color.red)]});

if (member.roles.highest.position >= message.member.roles.highest.position)
return message.reply({ embeds: [new MessageEmbed()
.setDescription(`${client.emoji.fail} | ${language.softbanEqualRole}`)
.setColor(client.color.red)]});

if (!member.bannable)
return message.reply({ embeds: [new MessageEmbed()
.setDescription(`${client.emoji.fail} | ${language.softbanNotBannable}`)
.setColor(client.color.red)]});

let reason = args.slice(1).join(' ');
if (!reason) reason = language.softbanNoReason;
if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

await member.ban({ reason:`${reason} / ${language.softbanResponsible}: ${message.author.tag}`, days: 7 });
await message.guild.members.unban(member.user, `${reason} / ${language.softbanResponsible}: ${message.author.tag}`);

const embed = new MessageEmbed()

.setDescription(`${client.emoji.success} | ${language.softbanSuccess} **${member.user.tag}** ${logging && logging.moderation.include_reason === "true" ?`\n\n**Lý do:** ${reason}`:``}`)
.setColor(client.color.green)

message.reply({ embeds: [embed]})
.then(async(s)=>{
          if(logging && logging.moderation.delete_reply === "true"){
            setTimeout(()=>{
            s.delete().catch(()=>{})
            }, 5000)
          }
        })
        .catch(()=>{});

// Update mod log
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
if(color == "#000000") color = message.client.color.green;

let logcase = logging.moderation.caseN
if(!logcase) logcase = `1`

let reason = args.slice(1).join(' ');
if (!reason) reason = `${language.noReasonProvided}`;
if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

const logEmbed = new MessageEmbed()
.setAuthor(`Hoạt động: \`Soft Ban\` | ${member.user.tag} | Trường hợp #${logcase}`, member.user.displayAvatarURL({ format: 'png' }))
.addField('Người dùng', member, true)
.addField('Người điều hành', message.member, true)
.addField('Lý do', reason, true)
.setFooter(`ID: ${member.id}`)
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
};
