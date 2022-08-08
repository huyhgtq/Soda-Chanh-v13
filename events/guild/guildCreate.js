const Event = require('../../structures/Event');
const Discord = require('discord.js');
const logger = require('../../utils/logger');
const Guild = require('../../database/schemas/Guild');
const metrics = require('datadog-metrics');
const Logging = require('../../database/schemas/logging');
const config = require('../../config.json');
const jsconfig = require("../../config")
const welcomeClient = new Discord.WebhookClient({ 
id: '927663649236070401',
token: 'WW1MdxgAE4d7PKVRN5vAK6MVqHpU3prSSzspeesyBtdceinh0yK28g6IFI2PhHtXQtE_'});
const webhookClient = new Discord.WebhookClient({ 
id: `${config.webhook_id}`,
token: `${config.webhook_url}`});

module.exports = class extends Event {

  async run(guild, message, args) {
    logger.info(`Joined to "${guild.name}" (${guild.id})`, { label: 'Guilds' })

    const find = await Guild.findOne({
      guildId: guild.id,
    })
	
    if(!find){
          const guildConfig = await Guild.create({
      guildId: guild.id,
      language: "english"
    })
    await guildConfig.save().catch(()=>{})
    }
    
    
  var textChats = guild.channels.cache
        .find(ch => ch.type === 'text' && ch.permissionsFor(guild.me).has(['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS']))

const modLog = guild.channels.cache.find(c => c.name.replace('-', '').replace('s', '') === 'modlog' || 
    c.name.replace('-', '').replace('s', '') === 'moderatorlog');

 let muteRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
  if (!muteRole) {
    try {
      muteRole = await guild.roles.create({
        data: {
          name: 'Muted',
          permissions: []
        }
      });
    } catch {
    
    }
    for (const channel of guild.channels.cache.values()) {
      try {
        if (channel.viewable && channel.permissionsFor(guild.me).has('MANAGE_ROLES')) {
          if (channel.type === 'text') 
            await channel.updateOverwrite(muteRole, {
              'SEND_MESSAGES': false,
              'ADD_REACTIONS': false
            });
          else if (channel.type === 'voice' && channel.editable) // 
            await channel.updateOverwrite(muteRole, {
              'SPEAK': false,
              'STREAM': false
            });
        } 
      } catch (err) {
       
      }
    }
  }
  
  const logging = await Logging.findOne({
    guildId: guild.id
  })
  if(!logging){
    const newL = await Logging.create({
      guildId: guild.id
    })
    await newL.save().catch(()=>{})
  }

  const logging2 = await Logging.findOne({
    guildId: guild.id
  })

  if(logging2){
    if(muteRole){
logging2.moderation.mute_role = muteRole.id
    }

    if(modLog){
      logging2.moderation.channel = modLog.id
    }
    await logging2.save().catch(()=>{})
    

  }

    if(textChats){
      const embed = new Discord.MessageEmbed()
      .setColor('PURPLE')
      .setDescription(`Này bạn! Tôi là **Bot Soda**. \ N \ nCảm ơn bạn đã mời tôi vào máy chủ của bạn vì nó rất có ý nghĩa đối với chúng tôi! Bạn có thể bắt đầu với [\`!help\`](https://${jsconfig.domain}) & tùy chỉnh cài đặt máy chủ của bạn bằng cách truy cập Trang tổng quan [\`Ở đây\`](https://${jsconfig.domain}/dashboard/${guild.id}).\n\n__**Tin tức hiện tại**__\n\`\`\`\nChúng tôi hiện đang tặng phí bảo hiểm cho tất cả các máy chủ cho đến 1000 bang hội! Nếu quan tâm Vui lòng truy cập https://${jsconfig.domain}/redeem\`\`\`\n\nMột lần nữa, cảm ơn bạn đã mời tôi!\n****`)



      textChats.send({ embeds: [embed]}).catch(()=>{})
    }


    const welcomeEmbed  = new Discord.MessageEmbed()
    .setColor(`PURPLE`)
    .setTitle('Máy chủ mới')
    .setDescription(`${jsconfig.bot_name} đã được thêm vào một máy chủ mới!`)
    .addField(`Tên máy chủ`, `\`${guild.name}\``, true)
    .addField(`ID máy chủ`, `\`${guild.id}\``, true)
    .setFooter({text:`${this.client.guilds.cache.size} Máy chủ `});

	  welcomeClient.send({
	username: `${jsconfig.bot_name}`,
	embeds: [welcomeEmbed],
});

if(config.datadogApiKey){
      metrics.init({ apiKey: this.client.config.datadogApiKey, host: 'pogy', prefix: 'pogy.' });
      metrics.increment('guildCreate');
}
      const embed = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setDescription(`Tôi đã tham gia ${guild.name} máy chủ.\n\nID: ${guild.id}`)
      .setFooter({text: `Đã thêm được ${guild.memberCount} Thành viên • Bây giờ tôi đang có ${this.client.guilds.cache.size} servers!`})
      .setThumbnail(guild.iconURL({ dynamic: true }) ? guild.iconURL({ dynamic: true }) : `https://guild-default-icon.herokuapp.com/${encodeURIComponent(guild.nameAcronym)}`)
      .addField('Chủ máy chủ', `<@${guild.ownerId}> /D (${guild.ownerId})`)
    
	  webhookClient.send({
	username: `${jsconfig.bot_name}`,
	embeds: [embed],
});
    
}
};
