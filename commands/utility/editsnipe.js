const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js');
const moment = require('moment')
const Snipe = require('../../database/schemas/editsnipe')
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'editsnipe',
        description: 'Snipe Edited Messages in the channel',
        category: 'Utility',
        usage: [ 'editsnipe' ],
        cooldown: 10,
      });
    }

    async run(message, args) {

      const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
      

      const language = require(`../../data/language/${guildDB.language}.json`);
      
let prefix = guildDB.prefix;
let fail = message.client.emoji.fail;
let client = message.client

let channel = message.mentions.channels.first();
if(!channel) channel = message.channel

const snipe = await Snipe.findOne({ guildId: message.guild.id, channel: channel.id})

const no = new MessageEmbed()
.setAuthor(`#${channel.name} | ${message.guild.name}`, message.guild.iconURL())
        .setFooter(message.guild.name)
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor)
        .setDescription(`${message.client.emoji.fail} | Không thể tìm thấy bất kỳ tin nhắn đã chỉnh sửa nào trong **${channel.name}**`)

if(!snipe){
  return message.channel.send(no)
}

if(snipe.oldmessage.length < 1){
  return message.channel.send(no)
}
if(snipe.newmessage.length < 1){
  return message.channel.send(no)
}

const data = []

      const embed = new MessageEmbed()
        .setAuthor(`#${channel.name} | ${message.guild.name}`, message.guild.iconURL())
        .setFooter(message.guild.name)
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor)

for (let i = 0; snipe.oldmessage.length  > i; i++) {
            data.push(`**${i + 1}**`)

            embed.addField(`Message #${i + 1}`, `**User:** ${await message.client.users.fetch(snipe.id[i]) || 'Unknown'}\n**tin nhắn** ${snipe.oldmessage[i] || 'None'} ➜ ${snipe.newmessage[i]}\n[Chuyển đến tin nhắn](${snipe.url[i]})\n`)

        };
        
        if(data.length < 1) return message.channel.send(no);

        

        message.channel.send(embed).catch(async(err)=>{
          await snipe.deleteOne().catch(()=>{})
          message.channel.send(`Nội dung nhúng chứa một trường lớn không thể vừa vặn vì đây là lý do khiến tôi không gửi được nội dung nhúng. Tôi đã đặt lại cơ sở dữ liệu vì bạn có thể thử chạy lại lệnh.`)
        })
    }
};
