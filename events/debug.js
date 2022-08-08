const muteModel = require('../models/mute');
const Event = require('../structures/Event');
const Discord = require('discord.js');
const config = require('../config.json');
const webhookClient = new Discord.WebhookClient({ 
id: `${config.webhook_id}`,
token: `${config.webhook_url}`});

const logger = require('../utils/logger');
const Maintenance = require('../database/schemas/maintenance')
let number = 1
module.exports = class extends Event {
    async run(info) {
 
let embed;
  const maintenance = await Maintenance.findOne({maintenance: 'maintenance'})

  
  if(info.includes('hit')){

number = ++number

embed = `${info} - ${number}`;
logger.info(info, { label: 'Debug' })

if(number >= 10){
  embed = `${info} - ${number} - ĐÃ ĐẠT ĐƯỢC CHẾ ĐỘ AN TOÀN`;
  console.log('Đã đạt đến chế độ an toàn - Đang bật chế độ bảo trì.')
  maintenance.toggle = "false"
  await maintenance.save();
  process.exit(1);
}
const lmao = new Discord.MessageEmbed()
.setDescription(embed)
.setColor('RED')
webhookClient.send({ embeds: [lmao] });
  }}
}
