const discord = require("discord.js")
const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const app = require("../../models/application/application.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "apply",
      aliases: [],
      usage: "",
      category: "Applications",
      examples: ["apply"],
      description: "Đăng ký trong các máy chủ hiện tại hoặc trả lời một số câu hỏi",
      cooldown: 5,

    })
  }
  
  async run(message, args) {
    const client = message.client
    const guildDB = await Guild.findOne({
        guildId: message.guild.id
    });
    const language = require(`../../data/language/${guildDB.language}.json`)
    const closed = new discord.MessageEmbed()
    .setDescription(`${message.client.emoji.fail} | ${language.closedapplay1} `)
    .setColor(message.client.color.red)

        const closed2 = new discord.MessageEmbed()
    .setDescription(`${message.client.emoji.fail} | ${language.closedapplay2}.`)
    .setColor(message.client.color.red)


   let db = await app.findOne({
      guildID: message.guild.id
    })
    
      if(!db) {
      let newAppDB = new app({
       guildID: message.guild.id,
       questions: [],
       appToggle: false,
       appLogs: null
      })
    await newAppDB.save().catch((err) => {console.log(err)})
    
    return message.reply({ embeds: [closed]})
  }
  

const row = new MessageActionRow()
          .addComponents(
              new MessageButton()
              .setLabel('by clicking here')
              .setURL(`https://sodachan.tk/apply/${message.guild.id}`)
              .setStyle('LINK')
              .setEmoji('🔗')
          )
	  
  if(db.questions.length === 0 || db.questions.length < 1) return message.reply({ embeds: [closed]}) ;
  const channel = await message.guild.channels.cache.get(db.appLogs);
  if(!channel) return message.reply({ embeds: [closed]});
      await message.author.send({ embeds: [new discord.MessageEmbed()
								.setColor(message.client.color.green)
								.setFooter('Powered by Sodachan.tk')
								.setDescription(`${message.client.emoji.success} | ${language.applaydone} **${message.guild.name}** `)], components: [row]})
		  
      .then(message.reply(`${language.dmss} - ${message.author}`))
      .catch(()=>{
        return message.reply({ embeds: [closed2] });
        })

      
     
    }
  }
