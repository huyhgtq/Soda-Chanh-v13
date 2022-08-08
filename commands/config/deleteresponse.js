const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const autoResponse = require('../../database/schemas/autoResponse.js');
const Guild = require('../../database/schemas/Guild');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'deleteresponse',
        description: 'Xóa một lệnh phản hồi tự động',
        category: 'Config',
        userPermission: 'MANAGE_MESSAGES',
        aliases: [ 'deleteautoresponse', 'delresponse', 'deleteautoresponse'],
        usage: [ '<command>' ],
        examples: [ 'deleteresponse Soda' ],
        cooldown: 3,
        userPermission: ['MANAGE_GUILD'],
      });
    }

    async run(message, args) {

      const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
    
      let prefix = guildDB.prefix;
    
      const language = require(`../../data/language/${guildDB.language}.json`)

      const name = args[0];


      if (!name) return message.reply({ embeds: [ new MessageEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(`${language.properusage} \`${prefix}deleteresponse <command-name>\`\n\n${language.example} \`${prefix}deleteresponse pog\``)
      .setTimestamp()
      .setFooter('https://sodachan.tk/')
      .setColor(message.guild.me.displayHexColor)]});

      if (name.length > 30) return message.reply(`${message.client.emoji.fail} ${language.cc1}`);
  
      
      autoResponse.findOne({ 
        guildId: message.guild.id,
        name
      }, async(err, data) => {
        if (data) {
          data.delete({ guildId: message.guild.id, name })
          message.reply({ embeds: [new MessageEmbed()
		  .setColor(message.guild.me.displayHexColor)
		  .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
          .setTitle(`${message.client.emoji.success} Delete Auto Response`)
          .setDescription(`${language.deletecmd1} **${name}**`)
          .setTimestamp()
          .setFooter('https://sodachan.tk/')]}) 
        } 
        else {
          message.reply(`${message.client.emoji.fail} ${language.deletecmd2}`)
        }
      })
    }
};