const muteModel = require('../models/mute');
const Event = require('../structures/Event');
const logger = require('../utils/logger');
const Maintenance = require('../database/schemas/maintenance')
const MessageEmbed = require('discord.js');
const Discord = require('discord.js');
const config = require('../config.json');
const webhookClient = new Discord.WebhookClient({ 
id: `${config.webhook_id}`,
token: `${config.webhook_url}`});

module.exports = class extends Event {
    async run(rl) {

 const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`**Hết giờ**\n\`${rl.timeout}ms\`\n**Giới hạn:**\n\`${rl.limit}\`\n\n__**Thông tin**__\n**Phương pháp:**${rl.method}\n\n**Đường dẫn:**\n${rl.path} ${rl.route}`)
        .setTimestamp()
      
      	await setTimeout(function () {
    webhookClient.send({ embeds: [embed] });
		logger.info(`Hết giờ: ${rl.timeout}ms. Giới hạn: ${rl.limit}`, {label: 'Rate bị Giới hạn'});

	}, rl.timeout + 10);

     
    }
}


