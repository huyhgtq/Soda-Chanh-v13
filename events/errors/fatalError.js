const Event = require('../../structures/Event');
const Discord = require('discord.js');
const config = require('../../config.json');
const webhookClient = new Discord.WebhookClient({ 
id: `${config.webhook_id}`,
token: `${config.webhook_url}`});

const fatalCooldown = new Set();
const uuid = require("uuid");
const id = uuid.v4();

module.exports = class extends Event {

  async run(error, message, command) {
    console.log(error);
/*
	  if(message.channel &&
      message.channel.viewable &&
      message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])){
     if(!fatalCooldown.has(message.channel.id)){
 message.channel.send(`${message.client.emoji.fail} Hey Pogger. An error Just occured and will be reported.\n\`code: ${id}\`\n\nmake sure to report it here (important) https://discord.gg/FqdH4sfKBg `).catch(()=>{});
     
    

     fatalCooldown.add(message.channel.id)
     setTimeout(()=>{
       fatalCooldown.delete(message.channel.id)
     }, 100000)
     }
      }
*/
    const embed = new Discord.MessageEmbed()
    .setColor('GREEN')
    .setDescription(`**Người sử dụng:** ${message.author} (${message.author.tag} - ${message.author.id})\n**Tin nhắn:** ${message.content}\n**Lỗi:** ${error}\n**ID:** \`${id}\`\n\n__**Thông tin Bang hội**__\nTên: ${message.guild.name}\nID: ${message.guild.id}\nKênh: ${message.channel.name} (${message.channel.id})`)
    .setTimestamp()

    webhookClient.send({ embeds: [embed] })

  }
};
