const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'suggestion',
        description: 'Bật hoặc tắt và phê duyệt hoặc từ chối đề xuất',
        category: 'Config',
        usage: [ '<enable #channel | disable> / suggestion approve/decline <message ID>' ],
        examples: [ 'suggestion enable #suggestions', 'suggestion disable', 'suggestion approve/decline 793797217239' ],
        cooldown: 3,
        userPermission: ['MANAGE_MESSAGES'],
      });
    }

    async run(message, args) {

      const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
      

      const language = require(`../../data/language/${guildDB.language}.json`);
      
let prefix = guildDB.prefix
let fail = message.client.emoji.fail
      let properUsage = new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setDescription(`${language.suggesting7.replace(/{prefix}/g, `${prefix}`)}`)
        .setFooter('https://sodachan.tk/')

      if (args.length < 1) {
        return message.reply({ embeds: [properUsage]});
      }

 
      if (args.includes('disable')) {

        if(guildDB.suggestion.suggestionChannelID === null) return message.reply({ embeds: [ new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setDescription(`${message.client.emoji.fail} ${language.suggesting8}`)
        .setFooter('https://sodachan.tk/')]});
        await Guild.findOne({
          guildId: message.guild.id
      }, async (err, guild) => {
     guild.suggestion.suggestionChannelID = null
     await guild.save().catch(()=>{})
  
          return message.reply({ embeds: [ new MessageEmbed()
          .setColor(message.guild.me.displayHexColor)
          .setDescription(`${message.client.emoji.success} ${language.suggesting9}`)
          .setFooter('https://sodachan.tk/')]}); 
        });
        return;
      } else if (args.includes('enable')) {


      const channel = await message.mentions.channels.first();

      if (!channel)  return message.reply({ embeds: [properUsage]})
    if(guildDB.suggestion.suggestionChannelID === channel.id) return message.reply({ embeds: [ new MessageEmbed()
          .setColor(message.guild.me.displayHexColor)
          .setDescription(`${fail} ${channel} ${language.suggesting10}`)
          .setFooter('https://sodachan.tk/')]}); 
      await Guild.findOne({
        guildId: message.guild.id
    }, async (err, guild) => {
       guild.suggestion.suggestionChannelID = channel.id
       await guild.save().catch(()=>{})

        return message.reply({ embeds: [ new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setDescription(`${message.client.emoji.success} ${language.suggesting11} ${channel}`)]}); 
      });
    } else if (args.includes('approve') || args.includes('accept')){

if(guildDB.suggestion.decline == "false"){
  return message.reply({ embeds: [new MessageEmbed()
							  .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
							  .setDescription(`${fail} Staff can't approve or decline Suggestions in this guild.`)
							  .setFooter('https://sodachan.tk/')
							  .setTimestamp().setColor('RED')]});
}
if(!guildDB.suggestion.suggestionChannelID || !guildDB.suggestion.suggestionChannelID === null) return message.reply({ embeds: [new MessageEmbed()
																															.setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
																															.setDescription(`${fail} ${language.suggesting1}`)
																															.setFooter('https://sodachan.tk/')
																															.setTimestamp().setColor('RED')]});

let suggestion = guildDB.suggestion.suggestionChannelID
let channel = message.guild.channels.cache.get(suggestion)
if(!channel) return message.reply({ embeds: [new MessageEmbed()
										 .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
										 .setDescription(`${fail} ${language.suggesting2}`)
										 .setFooter('https://sodachan.tk/')
										 .setTimestamp().setColor('RED')]});

if(!args[1]) return message.reply({ embeds: [new MessageEmbed()
										 .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
										 .setDescription(`${fail} ${language.suggesting12}`)
										 .setFooter('https://sodachan.tk/')
										 .setTimestamp().setColor('RED')]});

 try {

var suggestionMsg = await channel.messages.fetch(args[1])

} catch(e) {
            message.reply({ embeds: [new MessageEmbed()
								  .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' })).setDescription(`${fail} ${language.suggesting13}`)
								  .setFooter('https://sodachan.tk/')
								  .setTimestamp()
								  .setColor('RED')]});
            return;
}

let description = suggestionMsg.embeds[0].description;

 if(suggestionMsg.embeds[0].title !== `${language.suggesting3}`) {
   
   if(suggestionMsg.embeds[0].title === `${language.suggesting14}`){
             message.reply({ embeds: [new MessageEmbed()
								  .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
								  .setDescription(`${fail} ${language.suggesting15}`)
								  .setFooter('https://sodachan.tk/')
								  .setTimestamp().setColor('RED')]});
   } else {
             message.reply({ embeds: [new MessageEmbed()
								  .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
								  .setDescription(`${fail} ${language.suggesting16}`)
								  .setFooter('https://sodachan.tk/')
								  .setTimestamp()
								  .setColor('RED')]});
   }
   
   return;
   
 }
 var acceptReason = args.splice(2).join(' ');
 if(!acceptReason) acceptReason = `${language.noReasonProvided}`;
   if(args.join(' ').length > 600) return message.reply({ embeds: [new MessageEmbed()
															   .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
															   .setDescription(`${fail} ${language.suggesting17}`)
															   .setFooter('https://sodachan.tk/')
															   .setTimestamp()
															   .setColor('RED')]});

   const editedEmbed = new MessageEmbed()
            .setColor('#2bff80')
            .setTitle(`${language.suggesting14}`)
            .setDescription(`${description}\n\n**${language.suggesting18}**\n__**${language.reason}**__ ${acceptReason}\n__**${language.suggesting19}**__ ${message.author}`)
        suggestionMsg.edit(editedEmbed);
        suggestionMsg.reactions.removeAll();
        message.reply({ embeds: [new MessageEmbed()
							 .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
							 .setDescription(`${message.client.emoji.success} ${language.suggesting20} ${channel}\n\n__**${language.reason}**__ ${acceptReason}`)
							 .setFooter('https://sodachan.tk/')
							 .setTimestamp().setColor('GREEN')]}).then(k => {
        message.delete().catch(() => {})
       setTimeout(() => {
        k.delete().catch(() => {}) 
      }, 10000);
  })



    } else if (args.includes('decline')) {
      
if(guildDB.suggestion.decline == "false"){
  return message.reply({ embeds: [new MessageEmbed()
							  .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
							  .setDescription(`${fail} Staff can't approve or decline Suggestions in this guild.`)
							  .setFooter('https://sodachan.tk/')
							  .setTimestamp()
							  .setColor('RED')]});
}
if(!guildDB.suggestion.suggestionChannelID || !guildDB.suggestion.suggestionChannelID === null) return message.reply({ embeds: [new MessageEmbed()
																															.setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
																															.setDescription(`${fail} ${language.suggesting1}`)
																															.setFooter('https://sodachan.tk/')
																															.setTimestamp().setColor('RED')]});

let suggestion = guildDB.suggestion.suggestionChannelID
let channel = message.guild.channels.cache.get(suggestion)
if(!channel) return message.reply({ embeds: [new MessageEmbed()
										 .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
										 .setDescription(`${fail} ${language.suggesting2}`)
										 .setFooter('https://sodachan.tk/')
										 .setTimestamp()
										 .setColor('RED')]});


if(!args[1]) return message.reply({ embeds: [new MessageEmbed()
										 .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
										 .setDescription(`${fail}  ${language.suggesting12}`)
										 .setFooter('https://sodachan.tk/')
										 .setTimestamp()
										 .setColor('RED')]});

 try {

var suggestionMsg = await channel.messages.fetch(args[1])

} catch(e) {
             message.reply({ embeds: [new MessageEmbed()
								  .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
								  .setDescription(`${fail} ${language.suggesting13}`)
								  .setFooter('https://sodachan.tk/')
								  .setTimestamp()
								  .setColor('RED')]});
            return;
}
let description = suggestionMsg.embeds[0].description;
 if(suggestionMsg.embeds[0].title !== `${language.suggesting3}`) {
   
    if(suggestionMsg.embeds[0].title === `${language.suggesting14}`){
             message.reply({ embeds: [new MessageEmbed()
								  .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
								  .setDescription(`${fail} ${language.suggesting15}`)
								  .setFooter('https://sodachan.tk/')
								  .setTimestamp()
								  .setColor('RED')]});
   } else {
             message.reply({ embeds: [new MessageEmbed()
									  .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
									  .setDescription(`${fail} ${language.suggesting16}`)
									  .setFooter('https://sodachan.tk/')
									  .setTimestamp()
									  .setColor('RED')]});
   }
   
   return;
   
 }
 var acceptReason = args.splice(2).join(' ');
 if(!acceptReason) acceptReason = `${language.noReasonProvided}`;

   if(args.join(' ').length > 600) return message.reply({ embeds: [new MessageEmbed()
																   .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
																   .setDescription(`${fail} ${language.suggesting17}`)
																   .setFooter('https://sodachan.tk/')
																   .setTimestamp()
																   .setColor('RED')]});

   const editedEmbed = new MessageEmbed()
            .setColor(message.client.color.red)
            .setTitle(`${language.suggesting21}`)
            .setDescription(`${description}\n\n**${language.suggesting22}**\n__**${language.reason}**__ ${acceptReason}\n__**${language.suggesting23}**__ ${message.author}`)
        suggestionMsg.edit(editedEmbed);
        suggestionMsg.reactions.removeAll();
        message.reply({ embeds: [new MessageEmbed()
								 .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ format: 'png' }))
								 .setDescription(`${message.client.emoji.success} ${language.suggesting24} ${channel}\n\n__**${language.reason}**__ ${acceptReason}`)
								 .setFooter('https://sodachan.tk/')
								 .setTimestamp().setColor('GREEN')]}).then(k => {
        message.delete().catch(() => {})
       setTimeout(() => {
        k.delete().catch(() => {}) 
      }, 10000);
  })

    } else if(args[0]) {
     message.reply({ embeds: [properUsage]}) 
    } else {
 message.reply({ embeds: [properUsage]}) 

    }
    }
};