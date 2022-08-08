const discord = require("discord.js")
const ticketSchema = require("../../models/tickets.js")
const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const moment = require("moment")
const Discord = require('discord.js')
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "ticket",
      aliases: ["create"],
      description: "Tạo một vé thông qua một lệnh nếu tùy chọn là tin nhắn",
	  disabled: true,
      usage: ' ',
      category: "Tickets",
      botPermission: ["MANAGE_CHANNELS"]
    })
  }
  
  async run(message, args) {
    const client = message.client
    const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
        const language = require(`../../data/language/${guildDB.language}.json`)

        
        
        const ticketFetch = await ticketSchema.findOne({
          guildID: message.guild.id,
        }, async (err, db) => {
      if(!db) return;
      if(db.ticketType !== "message") return message.channel.send({ embeds: [new Discord.MessageEmbed()
																	  .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
																	  .setDescription(`${message.client.emoji.fail} Tính năng này bị tắt trong máy chủ hiện tại`)
																	  .setFooter('https://sodachan.tk/')
																	  .setTimestamp()
																	  .setColor('RED')]});
      
      if(db.ticketToggle == "false") return message.channel.send({ embeds: [new Discord.MessageEmbed()
																	 .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
																	 .setDescription(`${message.client.emoji.fail} Tính năng này bị tắt trong máy chủ hiện tại`)
																	 .setFooter('https://sodachan.tk/')
																	 .setTimestamp()
																	 .setColor('RED')]});
      
      let ticketRole = message.guild.roles.cache.get(db.supportRoleID);
      let ticketCategory = message.guild.channels.cache.get(db.categoryID)
      let ticketLog = message.guild.channels.cache.get(db.ticketModlogID)
      
      let pogy = message.guild.me;
      let everyone = message.guild.roles.everyone
      
      let user = message.author


  let reason = args.slice(0).join(" ");

  if(db.requireReason == "true"){
  if (!reason) return message.reply({ embeds: [new Discord.MessageEmbed()
											   .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
											   .setDescription(`${message.client.emoji.fail} Vui lòng cung cấp lý do`)
											   .setFooter('https://sodachan.tk/')
											   .setTimestamp()
											   .setColor('RED')]});
  }


      
      try {
      let id = user.id.toString().substr(0, 4) + user.discriminator;
      let chann = `ticket-${id}`;

let array = []

        message.guild.channels.cache.forEach(channel => {
 if(channel.name == chann) array.push(channel.id)
        })
       

let ticketlimit = db.maxTicket
if(!ticketlimit) ticketlimit = 1

let arraylength = array.length


      if(arraylength > ticketlimit || arraylength == ticketlimit) {

        message.react(client.emoji.fail)
        return message.reply({ embeds: [new discord.MessageEmbed()
										.setColor(client.color.red)
										.setDescription(`Bạn đã có ${arraylength} mở vé, vì giới hạn vé của máy chủ hiện tại là ${ticketlimit} `)
										.setAuthor(message.author.tag, message.author.displayAvatarURL())
										.setFooter('https://sodachan.tk/')]}).then(m => m.delete({timeout: 5000}))
      }
      
      message.react(client.emoji.check)

message.guild.channels.create(chann, { type: "text" })
    .then(async (chan) => {
      if(pogy) {
    chan.updateOverwrite(pogy, { VIEW_CHANNEL: true, READ_MESSAGES: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true, ATTACH_FILES: true });
      }
       chan.updateOverwrite(message.guild.me, { SEND_MESSAGES: true }).catch(()=>{})
    chan.updateOverwrite(everyone, { VIEW_CHANNEL: false });
      
    chan.updateOverwrite(user, { VIEW_CHANNEL: true, READ_MESSAGES: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true, ATTACH_FILES: true });
    
    if(ticketRole) {
    chan.updateOverwrite(ticketRole, { VIEW_CHANNEL: true, READ_MESSAGES: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true, ATTACH_FILES: true });
    } 
    let serverCase = db.ticketCase
    if(serverCase === null) serverCase = 1
    await db.updateOne({ticketCase: serverCase + 1});
    
    let member = message.author;
    let color = db.ticketWelcomeColor
    if(color == "#000000") color = message.guild.me.displayHexColor

    if(db.ticketPing == "true"){

    message.reply(`${member} ${ticketRole}`).catch(()=>{})

    }
    let reasonx = args.slice(0).join(" ")
    if(!reasonx) reasonx = `Không cung cấp lý do`;
    if(reasonx.length > 1024 ) reasonx = `Lý do quá dài`;
    if(reason.length > 1024 ) reasonx = `Lý do quá dài`;
    
    message.reply({ embeds: [new discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())

    .setDescription(db.ticketWelcomeMessage
        .replace(/{user}/g, `${member}`)
        .replace(/{user_tag}/g, `${member.tag}`)
        .replace(/{user_name}/g, `${member.username}`)
        .replace(/{reason}/g, reasonx)
        .replace(/{user_ID}/g, `${member.id}`) || language.ticketNewTicketWaitForAssistant)
        
    .setColor(color)
    ]}).catch(()=>{})
    
    if(ticketCategory){
    chan.setParent(ticketCategory.id)
    }
    
    chan.setTopic(`${language.ticketOpenedBy} ${user.tag} (${user.id})`).catch(() => {})
    
    let color2 = db.ticketLogColor
    if(color2 == "#000000") color2 = `#36393f`;

        const embedLog = new discord.MessageEmbed()
      .setColor(color2)
      .setFooter('https://sodachan.tk/')
      .setTitle(language.ticketNewTicketTitle)
      .setTimestamp()
      //.addField("Information" , `**User:** ${user}\n**Ticket Channel: **${chan.name}\n**Ticket:** #${serverCase}\n**Date:** ${moment(new Date()).format("dddd, MMMM Do YYYY")} `)
      .addField(language.ticketEmbedTitleInfo, language.ticketEmbedValueInfo.replace("{user}", `${user}`)
				.replace("{chanName}", chan.name)
				.replace("{serverCase}", serverCase)
				.replace("{ticketDate}", moment(new Date()).format("MM-DD-YYYY")))
      
      if(ticketLog) {
      ticketLog.send(embedLog).catch(() => {})
      }
})
      } catch (e) {
        message.reply(`Đã xảy ra lỗi: ${e}\nGửi cái này trong máy chủ hỗ trợ.`)
      }
   })
  
  }
}