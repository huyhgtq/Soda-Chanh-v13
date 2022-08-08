const discord = require("discord.js")
const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const alt = require("../../models/altdetector.js");
const moment = require('moment')
const ms = require("ms")
const ReactionMenu = require('../../data/ReactionMenu.js');
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "youngest",
      aliases: ["young"],
      usage: "<date>",
      category: "Alt Detector",
      examples: ["youngest 30"],
      description: "Tìm tất cả các tài khoản tham gia được cung cấp (ngày)",
      cooldown: 10,
      userPermission: ['MANAGE_GUILD'],
    })
  }
   async run(message, args) {
     const guildDB = await Guild.findOne({
        guildId: message.guild.id
    });
    const language = require(`../../data/language/${guildDB.language}.json`)
    const client = message.client
 


      let days = args[0]
      if(!days) return message.reply({ embeds: [new discord.MessageEmbed()
												.setColor(client.color.red)
												.setDescription(`${message.client.emoji.fail} | ${language.daysduration}`)]})

      if(isNaN(days)) return message.reply({ embeds: [new discord.MessageEmbed()
													  .setColor(client.color.red)
													  .setDescription(`${message.client.emoji.fail} | ${language.daysduration}`)]})
   
    let day = Number(days)

    if(day > 1000) return message.reply({ embeds: [new discord.MessageEmbed()
												   .setColor(client.color.red)
												   .setDescription(`${message.client.emoji.fail} | ${language.accountageof}`)]})

    let array = []

    message.guild.members.cache.forEach(async(user)=>{

    let math = day * 86400000

    let x = Date.now() - user.joinedAt;
    let created = Math.floor(x / 86400000);
      
    if(day > created) {

    array.push(`${user} (${user.user.tag} | ${user.id})\n${language.joinedat}: **${user.joinedAt}**`)
    }
   
    })

    const interval = 10;


    const embed = new discord.MessageEmbed()
    .setTitle(`${language.joinage} ${days} ${language.day}`)
    .setDescription(array.join("\n\n") || `${language.noaltsfound}`)
    .setColor(message.client.color.green)

if (array.length <= interval) {
    
    const range = (array.length == 1) ? '[1]' : `[1 - ${array.length}]`;
      message.reply({ embeds: [embed
        .setTitle(`${language.joinage} ${days} ${language.day}`)
        .setDescription(array.join('\n\n'))
      ]});

    } else {

      embed
        .setTitle(`${language.joinage} ${days} ${language.day}`)
        .setFooter(message.author.tag,  
          message.author.displayAvatarURL({ dynamic: true })
        );

      new ReactionMenu(message.client, message.channel, message.member, embed, array, interval);
    }



   }


}


