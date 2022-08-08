const Event = require('../../structures/Event');
const logger = require('../../utils/logger');
const Logging = require('../../database/schemas/logging');
const discord = require("discord.js");
const moment = require('moment');
const Maintenance = require('../../database/schemas/maintenance')
module.exports = class extends Event {

async run(oldGuild, newGuild) {

     
const maintenance = await Maintenance.findOne({
  maintenance: "maintenance"
})

if(maintenance && maintenance.toggle == "true") return;
 
const logging = await Logging.findOne({ guildId: oldGuild.id })


if(logging){
  if(logging.server_events.toggle == "true"){


const channelEmbed = await oldGuild.channels.cache.get(logging.server_events.channel)

if(channelEmbed){

let color = logging.server_events.color;
if(color == "#000000") color = oldGuild.client.color.yellow;


  if(logging.server_events.channel_created == "true"){


    const embed = new discord.MessageEmbed()
    .setDescription(`***Đã cập nhật máy chủ***`)
    .setFooter(`ID máy chủ: ${oldGuild.id}`)
    .setTimestamp()
    .setColor(color)


if(oldGuild.name !== newGuild.name) {
    embed.addField('Cập nhật tên', `${oldGuild.name} --> ${newGuild.name}`, true)

 } else {
    embed.addField('Cập nhật tên', `Tên không được cập nhật`, true)

 }


if(oldGuild.verificationLevel !== newGuild.verificationLevel) {
    embed.addField('mức độ xác minh', `${oldGuild.verificationLevel || 'Không'} --> ${newGuild.verificationLevel || 'Không'}`, true)

 }

 if(oldGuild.icon !== newGuild.icon) {
    embed.addField('Icon', `[old Icon](${oldGuild.iconURL({ dynamic: true, size: 512 })}) --> [new Icon](${newGuild.iconURL({ dynamic: true, size: 512 })})`, true)

 }

 
 if(oldGuild.region !== newGuild.region) {
    embed.addField('Khu vực', `${oldGuild.region || 'Không'} --> ${newGuild.region || 'Không'}`, true)

 }


   if(oldGuild.ownerID !== newGuild.ownerID) {
    embed.addField('Chủ sở hữu', `<@${oldGuild.ownerID || 'Không'}> **(${oldGuild.ownerID})** --> <@${newGuild.ownerID}>**(${newGuild.ownerID})**`, true)

 }

   if(oldGuild.afkTimeout !== newGuild.afkTimeout) {
    embed.addField('afk Hết giờ', `${oldGuild.afkTimeout || 'Không'} --> ${newGuild.afkTimeout || 'Không'}`, true)

 }

   if(oldGuild.afkChannelID !== newGuild.afkChannelID) {
    embed.addField('Kênh afk', `${oldGuild.afkChannelID || 'Không'}> --> ${newGuild.afkChannelID || 'Không'}`, true)

 }


    
    if(channelEmbed &&
      channelEmbed.viewable &&
      channelEmbed.permissionsFor(newGuild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])){
            channelEmbed.send({ embeds: [embed] }).catch(()=>{})
      }


  

  }
  }
 }

}



  }
};