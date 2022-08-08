const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js');

const ReactionRole = require("../../packages/reactionrole/index.js")
const react = new ReactionRole()
const config = require("../../config.json");
react.setURL(config.mongodb_url)

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'rrbuilder',
        aliases: ["rrb", "reactionrolebuilder", "reactionbuilder", "rolebuilder"],
        description: 'Bắt đầu lời nhắc và tạo vai trò phản ứng của bạn',
        category: 'Reaction Role',
        cooldown: 3,
        userPermission: ['MANAGE_GUILD'],
      });
    }

    async run(message, args) {
    let client = message.client

       const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
    
      const language = require(`../../data/language/${guildDB.language}.json`)
      
      let fail = message.client.emoji.fail
      let success = message.client.emoji.success
  const missingPermEmbed = new MessageEmbed()
  .setAuthor(`Thiếu quyền của người dùng`, message.author.displayAvatarURL())
  .setDescription(`${fail} Lệnh sau cần Quyền **Administrator**`)
  .setFooter(`https://sodachan.tk/`)


 
  const cancelledEmbed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${success} Trình tạo phản ứng đã bị hủy!`)
  .setFooter(`https://sodachan.tk/`)

  const cancelledEmbed2 = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Phản hồi sai, trình tạo phản ứng bị hủy!`)
  .setFooter(`https://sodachan.tk/`)

    const timeEnd = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Thời gian đã kết thúc, Trình tạo phản ứng đã bị hủy!`)
  .setFooter(`https://sodachan.tk/`)
const filter = m => m.author.id === message.author.id

message.channel.send("Vui lòng chỉ định kênh! **[Kênh / ID]**\n\n**Gõ Cancel để hủy bỏ**").then(() => {
  message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] }).then(async collected => {
    let channel = collected.first().content
    let channelMention = collected.first().mentions
    let channelToSend = channelMention.channels.first() || message.guild.channels.cache.get(channel.toLowerCase()) || message.guild.channels.cache.find(ch => ch.name === channel.toLowerCase())

    if(channel.toLowerCase() === 'cancel'){
      message.channel.send(cancelledEmbed)
      return;
    }
   
    if(!channelToSend) return message.channel.send(cancelledEmbed2)
    
    message.channel.send(`Cung cấp cho tôi một tin nhắn ID\n\nĐảm bảo tin nhắn ở trong ${channelToSend}\n\n**Gõ Cancel để hủy bỏ**`).then(() => {
        message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] }).then(async collected1 => {
        let ID = collected1.first().content
            if(ID.toLowerCase() === 'cancel'){
      message.channel.send(cancelledEmbed)
      return;
    }
        let messageID = await channelToSend.messages.fetch(ID).catch(() => { return message.channel.send(cancelledEmbed2) })
          
          message.channel.send("Vui lòng cung cấp cho tôi một vai trò **[Vai trò / ID]**\n\nVai trò sau sẽ được đưa ra khi người dùng phản ứng!\n\n**Gõ Cancel để hủy bỏ**").then(() => {
            message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] }).then(collected2 => {
              let roleName = collected2.first().content
              let roleMention = collected2.first().mentions
              let role = roleMention.roles.first() || message.guild.roles.cache.find(rl => rl.name === roleName) || message.guild.roles.cache.get(roleName)
                  if(roleName.toLowerCase() === 'cancel'){
      message.channel.send(cancelledEmbed)
      return;
    }
              if(!role) return message.channel.send(cancelledEmbed2)
                  if(role.managed){
      return message.channel.send(`${message.client.emoji.fail} Vui lòng không sử dụng vai trò tích hợp.`)
    }
              //wtf
              
              message.channel.send("Bây giờ, Vui lòng cung cấp cho tôi một Biểu tượng cảm xúc, đảm bảo rằng nó không phải là Biểu tượng cảm xúc tùy chỉnh!\n\nBiểu tượng cảm xúc sau sẽ là biểu tượng cảm xúc mà người dùng sẽ phản ứng!\n\n**Gõ Cancel để hủy bỏ**").then(() => {
            message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] }).then(async (collected3) => {
              let emoji = collected3.first().content

             
              
    if (!emoji) return message.channel.send(new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Cung cấp cho tôi một Biểu tượng cảm xúc hợp lệ`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)
    );


    if (isCustomEmoji(emoji)) return message.channel.send(new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Không sử dụng Biểu tượng cảm xúc tùy chỉnh!`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)
    );

try {

await messageID.react(emoji)

} catch(err){
 return message.channel.send(new MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`${fail} Vui lòng cung cấp một biểu tượng cảm xúc hợp lệ.`)
  .setColor(client.color.red)
  .setFooter(`https://sodachan.tk/`));
}
              
              message.channel.send("__**Cuối cùng chọn:**__\n\n`1` - React thêm vai trò, việc không thực hiện sẽ xóa vai trò\n`2`- Phản ứng sẽ mang lại vai trò nhưng không phản ứng sẽ không loại bỏ vai trò\n`3` - Phản ứng sẽ xóa vai trò của người dùng và không phản ứng sẽ không trả lại vai trò đó\n`4` - Khi phản ứng, nó sẽ xóa vai trò, không phản ứng sẽ thêm vai trò\n`5` - Khái niệm tương tự như số 3 nhưng loại bỏ phản ứng của người dùng\n`6` - Phản ứng để nhận vai trò và phản ứng lại để xóa vai trò").then(() => {
              message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] }).then(collected4 => {
                let option = collected4.first().content
                let numbers = ["1", "2", "3", "4", "5", "6"]
                if(!numbers.includes(option)) return message.channel.send("Bạn phải chỉ định giữa 1, 2, 3, 4 hoặc 5")
                
                message.channel.send(new MessageEmbed()
                .setAuthor('Vai trò phản ứng - Thiết lập xong', message.guild.iconURL(),messageID.url)
                .setColor(client.color.green)
                .addField('Kênh', channelToSend, true)
                .addField('Emoji', emoji, true)
                .addField('Thể loại', option, true)
                .addField('ID tin nhắn', ID, true)
                .addField('Tin nhắn', `[Chuyển đến tin nhắn](${messageID.url})`, true)
                .addField('Vai trò', role, true)
                .setFooter('https://sodachan.tk/')
                ).then(async () => {
                  messageID.react(emoji)
                  
                   await react.reactionCreate(client, message.guild.id , ID, role.id, emoji, "false", option);//ID is MessageID, ignore "false"

                })
               }).catch(err => { message.channel.send(timeEnd) })
              })
               }).catch(err => { message.channel.send(timeEnd) })
              })
           }).catch(err => { message.channel.send(timeEnd) })
          })
     }).catch(err => { message.channel.send(timeEnd) 
     console.log(err)})
    })
  }).catch(err => { message.channel.send(timeEnd) })
})

        function isCustomEmoji(emoji) {
      return emoji.split(":").length == 1 ? false : true;
    }
    }
}
