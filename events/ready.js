const muteModel = require('../models/mute');
const Event = require('../structures/Event');
const logger = require('../utils/logger');
const Maintenance = require('../database/schemas/maintenance')
const Discord = require('discord.js');
const config = require('../config.json');
const chalk = require("chalk");
const ms = require("ms")
const { WebhookClient, MessageEmbed } = require('discord.js');
const webhookClient = new WebhookClient({ 
id: `${config.webhook_id}`,
token: `${config.webhook_url}`});

const premiumrip = new WebhookClient({ 
id: `${config.webhook_id}`,
token: `${config.webhook_url}`});

const moment = require(`moment`)

module.exports = class extends Event {


  constructor(...args) {
    super(...args)
  }
  async run() {
	  

	  const guildin = this.client.guilds.cache.size;
  const guildmember = this.client.users.cache.size;
const maintenance = await Maintenance.findOne({
  maintenance: "maintenance"
})


if(maintenance && maintenance.toggle == "true"){

  

    this.client.user.setPresence({ status: 'dnd' });
    this.client.user.setActivity('Đang bảo trì')

  
console.log('------------')
logger.info(`✅ Chế độ bảo trì đã tải `, { label: 'Status' })
console.log('------------')
} else {
    const activities = [
      { name: '!help | sodachan.tk', type: 'WATCHING' }, 
      { name: '@SodaChan', type: 'WATCHING' }
    ];
  

    this.client.user.setPresence({ status: 'online', activity: activities[0] });
  
    let activity = 1;

    setInterval(() => {
      activities[2] = { name: `!help | ${ this.client.guilds.cache.size} Server`, type: 'WATCHING' };
      activities[3] = { name: `!help | ${ this.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} users`, type: 'WATCHING' }; 
      if (activity > 3) activity = 0;
      this.client.user.setActivity(activities[activity]);
      activity++;
    }, 35000);

		 console.log('-----------')
		logger.info(`✅ đã tải: Trạng thái bot `, { label: 'Status' })
		console.log('------------')
	    console.log(
    chalk.bgMagentaBright.black(` ${this.client.guilds.cache.size} servers `),
    chalk.bgMagentaBright.black(` ${this.client.channels.cache.size} channels `),
    chalk.bgMagentaBright.black(` ${ this.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} members `),
  );
	}
  }
}