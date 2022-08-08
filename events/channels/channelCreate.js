const Event = require('../../structures/Event');
const logger = require('../../utils/logger');
const Logging = require('../../database/schemas/logging');
const discord = require("discord.js");
const moment = require('moment');
const cooldown =  new Set();

const Maintenance = require('../../database/schemas/maintenance')

module.exports = class extends Event {

async run(message, channel) {

if(!message || !channel) return;


const logging = await Logging.findOne({ guildId: message.guild.id })


const maintenance = await Maintenance.findOne({
  maintenance: "maintenance"
})

if(maintenance && maintenance.toggle == "true") return;

if(cooldown.has(message.guild.id)) return;

if (message.name.indexOf('Room') >= 0) return;

if(logging){
  if(logging.server_events.toggle == "true"){



const channelEmbed = await message.guild.channels.cache.get(logging.server_events.channel)

if(channelEmbed){

let color = logging.server_events.color;
if(color == "#000000") color = message.client.color.green;


  if(logging.server_events.channel_created == "true"){


if(message.type === "text"){

    const embed = new discord.MessageEmbed()
    .setDescription(`***Channel Created***`)
    .addField('Kênh', `${message}`)
    .addField('Tên kênh', `${message.name}`)
    .addField('Loại kênh', 'Kênh văn bản', true)
    .setFooter(`kênh ID: ${message.id}`)
    .setTimestamp()
    .setColor(color)
  
   if(message.parent && message.type !== 'thể loại')embed.addField(`Tên`, message.parent.name)
   
        if(channelEmbed &&
      channelEmbed.viewable &&
      channelEmbed.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])){
            channelEmbed.send({ embeds: [embed] }).catch(()=>{})
            cooldown.add(message.guild.id);
            setTimeout(()=>{
cooldown.delete(message.guild.id)
            }, 3000)
      }

} else {

    const embed = new discord.MessageEmbed()
    .setDescription(`🆕 ***Kênh được tạo***`)
    .addField('Tên kênh', message.name, true)
    .addField('Loại kênh', message.type, true)
    .setFooter(`kênh ID: ${message.id}`)
    .setTimestamp()
    .setColor(color)
     
    if(channelEmbed &&
      channelEmbed.viewable &&
      channelEmbed.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])){
            channelEmbed.send({ embeds: [embed] }).catch(()=>{})
                   cooldown.add(message.guild.id);
            setTimeout(()=>{
cooldown.delete(message.guild.id)
            }, 3000)
      }

}

  }


  }
 }
}


  }
};