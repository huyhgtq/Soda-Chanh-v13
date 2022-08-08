const Event = require('../../structures/Event');
const Discord = require('discord.js');
const logger = require('../../utils/logger');
const Guild = require('../../database/schemas/Guild');
const metrics = require('datadog-metrics');
const Logging = require('../../database/schemas/logging');
const config = require('../../config.json');
const jsconfig = require("../../config")
const webhookClient = new Discord.WebhookClient({ 
id: `${config.webhook_id}`,
token: `${config.webhook_url}`});

const welcomeClient = new Discord.WebhookClient({ 
id: `${config.webhook_id}`,
token: `${config.webhook_url}`});
module.exports = class extends Event {

  async run(guild) {
    Guild.findOneAndDelete({
      guildId: guild.id,
    }, (err, res) => {
      if (err) console.log(err)
      logger.info(`Đã rời "${guild.name}" (${guild.id})`, { label: 'Guilds' })
    })
    const welcomeEmbed  = new Discord.MessageEmbed()
   .setColor(`RED`)
    .setTitle('Rời khỏi máy chủ')
    .setDescription(`${jsconfig.bot_name} đã rời khỏi một Máy chủ!`)
    .addField(`Tên máy chủ`, `\`${guild.name}\``, true)
    .addField(`ID máy chủ`, `\`${guild.id}\``, true)
    .setFooter(`${this.client.guilds.cache.size} guilds `);

	  welcomeClient.send({
	username: `${jsconfig.bot_name}`,
	embeds: [welcomeEmbed],
      });

Logging.findOneAndDelete({
      guildId: guild.id,
    }).catch(()=>{});

if(config.datadogApiKey){
      metrics.init({ apiKey: this.client.config.datadogApiKey, host: 'pogy', prefix: 'pogy.' });
      metrics.increment('guildDelete');
}

      const embed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`Tôi đã rời khỏi ${guild.name} máy chủ.`)
      .setFooter(`Đã Mất ${guild.memberCount} thành viên • tôi hiện đang tham gia ${this.client.guilds.cache.size} máy chủ..\n\nID: ${guild.id}`)
      .setThumbnail(guild.iconURL({ dynamic: true }) ? guild.iconURL({ dynamic: true }) : `https://guild-default-icon.herokuapp.com/${encodeURIComponent(guild.nameAcronym)}`)
      .addField('Chủ sở hữu máy chủ', `<@${guild.ownerId}> / (${guild.ownerId})`)

	  webhookClient.send({
	username: `${jsconfig.bot_name}`,
	embeds: [embed],
      });
    
  }
};
