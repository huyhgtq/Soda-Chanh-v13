const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Guild = require("../../database/schemas/Guild.js");
const Economy = require("../../models/economy.js")
const mongoose = require("mongoose")
const Logging = require('../../database/schemas/logging.js')

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'removerole',
        aliases: [ 'remrole' ],
        description: 'Xóa vai trò được chỉ định khỏi người dùng được đề cập',
        category: 'Moderation',
        usage: '<user>',
        examples: [ 'removerole @yuunya' ],
        guildOnly: true,
        botPermission: ['MANAGE_ROLES'],
        userPermission: ['MANAGE_ROLES'],
      });
    }

    async run(message, args) {
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
  const logging = await Logging.findOne({ guildId: message.guild.id })
const guildDB = await Guild.findOne({
guildId: message.guild.id
});
const language = require(`../../data/language/${guildDB.language}.json`)




   let member = message.mentions.members.last() || message.guild.members.cache.get(args[0]);

     if (!member)
      return message.reply({ embeds: [new MessageEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTitle(`${fail} Xóa vai trò lỗi`)
      .setDescription('Vui lòng cung cấp một vai trò hợp lệ')
      .setTimestamp()
      .setFooter('https://sodachan.tk/')
      .setColor(message.guild.me.displayHexColor)]});
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.reply({ embeds: [new MessageEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTitle(`${fail} Xóa vai trò lỗi`)
      .setDescription('Người dùng được cung cấp có vai trò ngang bằng hoặc cao hơn.')
      .setTimestamp()
      .setFooter('https://sodachan.tk/')
      .setColor(message.guild.me.displayHexColor)]});

      const role = getRoleFromMention(message, args[1]) || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(rl => rl.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());

    let reason = `Tính năng hiện tại không cần lý do`
    if (!reason) reason = 'Không cung cấp lý do';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    if (!role) 
      return message.reply({ embeds: [new MessageEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTitle(`${fail} Xóa vai trò lỗi`)
      .setDescription('Vui lòng cung cấp một vai trò hợp lệ')
      .setTimestamp()
      .setFooter('https://sodachan.tk/')
      .setColor(message.guild.me.displayHexColor)]});
    else if (!member.roles.cache.has(role.id))
      return message.reply({ embeds: [new MessageEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTitle(`${fail} Xóa vai trò lỗi`)
      .setDescription(`Người dùng được cung cấp không có vai trò.`)
      .setTimestamp()
      .setFooter('https://sodachan.tk/')
      .setColor(message.guild.me.displayHexColor)]});
    else {
      try {

        await member.roles.remove(role, [`Xóa vai trò / Người dùng có trách nhiệm: ${message.author.tag}`]);
        const embed = new MessageEmbed()
      
          .setDescription(` ${success} | Loại bỏ **${role.name}** từ **${member.user.tag}**`)
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

if(logging.moderation.role == "true"){
  
let color = logging.moderation.color;
if(color == "#000000") color = message.client.c;

let logcase = logging.moderation.caseN
if(!logcase) logcase = `1`

const logEmbed = new MessageEmbed()
.setAuthor(`Hoạt động: \`Remove Role\` | ${member.user.tag} | Trường hợp #${logcase}`, member.user.displayAvatarURL({ format: 'png' }))
.addField('Người dùng', member, true)
.addField('Người điều hành', message.member, true)
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

        message.reply({ embeds: [new MessageEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTitle(`${fail} Xóa vai trò lỗi`)
      .setDescription(`Không thể xóa Vai trò của người dùng, vui lòng kiểm tra chế độ phân biệt vai trò và đảm bảo Vai trò của tôi ở trên người dùng được cung cấp.`)
      .setTimestamp()
      .setFooter('https://sodachan.tk/')
      .setColor(message.guild.me.displayHexColor)]});
      }
    }  
    }
};
 function getRoleFromMention(message, mention) {
    if (!mention) return;
    const matches = mention.match(/^<@&(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    return message.guild.roles.cache.get(id);
  }
