const Event = require('../../structures/Event');
const Discord = require('discord.js');
const config = require('../../config.json');
const webhookClient = new Discord.WebhookClient({ 
id: `${config.webhook_id}`,
token: `${config.webhook_url}`});

module.exports = class extends Event {

  async run(error, message) {
    console.error(error)
    
                  if(message.channel &&
      message.channel.viewable &&
      message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])){
 message.channel.send(`${message.client.emoji.fail} Này! Một lỗi vừa xảy ra, hãy đảm bảo báo cáo nó tại đây https://discord.gg/2mHgQQz3GN`).catch(()=>{})
      }

   

    webhookClient.send(`${message.author.username} (${message.author.id})\n${message.content}\n${error}`);
    
  }
};
