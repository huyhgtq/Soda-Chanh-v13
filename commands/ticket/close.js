const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js');
const discord = require("discord.js")
const reactionTicket = require("../../models/tickets.js")
const date = require('date-and-time')
const transcriptSchema = require("../../models/transcript.js");
const randoStrings = require("randostrings")
const random = new randoStrings
const moment = require('moment')
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "closeticket",
      aliases: ["close", "ticketclose", "tclose"],
      description: "Đóng một vé đã mở!",
	  disabled: true,
      category: "Tickets",
      cooldown: 3,
      botPermission: ['MANAGE_CHANNELS']
    })
  }
  
  async run(message, args) {
    const client = message.client;

           const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
  
   if (!message.channel.name.startsWith('ticket-')) return message.channel.send(new MessageEmbed().setColor('RED').setTitle('Đóng vé').setDescription(`Không thể đóng vé, có vẻ như bạn không tham gia bất kỳ kênh đặt vé nào.`)
        .setFooter('https://sodachan.tk/')
        .setTimestamp()).then(m => {
          message.delete().catch(()=>{})
			  .setTimeout(() => { m.delete().catch(()=>{})}, 10000);
      });

 await reactionTicket.findOne({
      guildID: message.guild.id,
    }, async(err, db) => {


      if(!db) return;

      let channelReact = message.guild.channels.cache.get(db.ticketModlogID)
    
 


      let reason = args.slice(0).join(" ")
      if(!reason) reason = "Không có lý do được cung cấp"

const role = message.guild.roles.cache.get(db.supportRoleID);
if(db.ticketClose == "false"){
if(role){
if(!message.member.roles.cache.find(r => r.name.toLowerCase() === role.name.toLowerCase())) return message.channel.send(new discord.MessageEmbed().setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' })).setDescription(`${message.client.emoji.fail} Chỉ những người dùng có vai trò trong nhóm hỗ trợ mới có thể đóng vé này`).setFooter('https://sodachan.tk/').setTimestamp().setColor('RED'));
}
};


if(!message.channel) return;

await message.channel.messages.fetch()
.then(async (messages) => {

  
    let text = "";

let ticketID = random.password({
    length: 8,
    string: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  })

      const paste = new transcriptSchema({
      _id: ticketID,
      type: "ticket",
      by: message.author.id,
			expiresAt: new Date(Date.now() + (1036800000))
		});

   for (const message of messages.array().reverse()) {


      
      if(message && message.content && message.author.id){
      paste.paste.push(`${message.content}`) 
      paste.paste2.push(message.author.id)
      } else if(message && message.embeds && message.author.id){
      paste.paste.push(`(embed sent)`) 
      paste.paste2.push(message.author.id)
      }
      
      
  } 
  

  
  if(channelReact){
let color2 = db.ticketLogColor
    if(color2 == "#000000") color2 = `#36393f`;

let closeEmbed = new MessageEmbed()
      .setColor(color2)
      .setTitle("Vé đã đóng")
      .addField("Thông tin" , `**Người dùng:** ${message.author}\n**Kênh vé:** #${message.channel.name}\n**Lý do:** ${reason}\n**Ngày tháng:** ${moment(new Date()).format("MM-DD-YYYY")}\n**Lịch sử:** [here](https://sodachan.tk/paste/${ticketID})`)

  channelReact.send(closeEmbed).catch(()=>{})
  message.author.send(closeEmbed).catch(()=>{})
  }

    
		await paste.save().catch(()=>{})




}).catch(()=>{})

  message.channel.delete({timeout: 2000}).catch(()=>{})



  
   });

  }
  
}