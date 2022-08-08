const Command = require('../../structures/Command');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const autoResponse = require('../../database/schemas/autoResponse.js');
const Guild = require('../../database/schemas/Guild');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'autoresponse',
        description: 'Tạo Phản hồi tự động được kích hoạt mà không có prefix!',
        category: 'Config',
        userPermission: ['MANAGE_MESSAGES'],
        aliases: [ 'ar', 'aresponse'],
        usage: [ '<command> <reply>' ],
        examples: [ 'autoresponse soda xin chào!' ],
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
      const namee = args[0];

      if (!namee) return message.reply({ embeds: [new MessageEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(`${language.properusage} \`${prefix}autoResponse <command-name> <text-reply>\`\n\n${language.example} \`${prefix}autoResponse ping pong\``)
      .setTimestamp()
      .setFooter('https://sodachan.tk/')
      .setColor(message.guild.me.displayHexColor)]});

      let name = namee.toLowerCase()
      const content = args.slice(1).join(' ');
      if (!content) return message.reply({ embeds: [new MessageEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(`${language.properusage} \`${prefix}autoResponse <command-name> <text-reply>\`\n\n${language.example} \`${prefix}autoResponse ping pong\``)
      .setTimestamp()
      .setFooter('https://sodachan.tk/')
      .setColor(message.guild.me.displayHexColor)]});

  
      if (namee.length > 30) return message.reply(`${message.client.emoji.fail} ${language.cc1}`);
      if (content.length > 2000) return message.reply(`${message.client.emoji.fail} ${language.cc2}`);


if(guildDB.isPremium === "false"){
  const conditional = {
   guildId: message.guild.id
}
const results = await autoResponse.find(conditional)
const row = new MessageActionRow()
          .addComponents(
              new MessageButton()
              .setLabel('Click Here')
              .setURL(`https://sodachan.tk/premium/`)
              .setStyle('LINK')
              .setEmoji('🔗')
          )
if(results.length >= 10){
message.reply({ embeds: [new MessageEmbed()
						 .setColor(message.guild.me.displayHexColor)
						 .setDescription(`${message.client.emoji.fail} Đã đạt đến giới hạn phản hồi tự động **(10)**\n\n[Nâng cấp Premium Tại đây để có các lệnh không giới hạn]`)], components: [row]})

  return;
}
}

    

      autoResponse.findOne({ 
        guildId: message.guild.id,
        name
      }, async(err, data) => {
        if (!data) {
          autoResponse.create({ guildId: message.guild.id, name, content });
          message.reply({ embeds: [new MessageEmbed()
    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    .setDescription(`**${language.cc3}** ${name}\n\nDelete the following auto response using \`${prefix}deleteresponse <command-name>\``)
    .setTimestamp()
    .setFooter('https://sodachan.tk/')
    .setColor(message.guild.me.displayHexColor)]})
        } 
        else {
          return message.reply(`${message.client.emoji.fail} ${language.cc4}`)
        }
      })

    }
};