const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js');
const moment = require('moment')
const Snipe = require('../../database/schemas/snipe')
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'snipe',
        description: 'Snipe Tin nhắn trong kênh',
        category: 'Utility',
        usage: [ 'snipe' ],
        cooldown: 5,
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
        .setDescription(`${message.client.emoji.fail} | Không thể tìm thấy bất kỳ tin nhắn đã xóa nào trong **${channel.name}**`)

if(!snipe){
  return message.reply({ embeds: [no] })
}

if(snipe.message.length < 1){
  return message.reply({ embeds: [no] })
}

const data = []

      const embed = new MessageEmbed()
        .setAuthor(`#${channel.name} | ${message.guild.name}`, message.guild.iconURL())
        .setFooter(message.guild.name)
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor)

for (let i = 0; snipe.message.length  > i; i++) {
            data.push(`**${i + 1}-**\n**Người dùng:** ${await message.client.users.fetch(snipe.tag[i]) || 'không xác định'}\n**Tin nhắn:** ${snipe.message[i] || 'Không'}\n**hình ảnh:** \`${snipe.image[i] || 'không'}\``)

            embed.addField(`Tin nhắn ${i + 1}`, `**Người dùng:** ${await message.client.users.fetch(snipe.tag[i]) || 'không xác định'}\n**Tin nhắn:** ${snipe.message[i] || 'Không'}\n**Hình ảnh:** \`${snipe.image[i] || 'không'}\``, true)

        };
        
        if(data.length < 1) return message.reply({ embeds: [no] })

        

       message.reply({ embeds: [embed] }).catch(async(err)=>{
          await snipe.deleteOne().catch(()=>{})
          message.reply(`Nội dung nhúng chứa một trường lớn không thể vừa vặn vì đây là lý do khiến tôi không gửi được nội dung nhúng. Tôi đã đặt lại cơ sở dữ liệu vì bạn có thể thử chạy lại lệnh một lần nữa.`)
        })
    }
};
