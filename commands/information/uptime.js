const Command = require('../../structures/Command');
const ms = require('ms')
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const moment = require('moment');
require("moment-duration-format");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'uptime',
      aliases: [ 'ut', 'uptime'],
      cooldown: 2,
      description: 'Thời gian hoạt động của Soda Chan!',
      category: 'Information',
    });
  }

    async run(message, client) {

       const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
    
      const language = require(`../../data/language/${guildDB.language}.json`)

		let uptime = this.client.shard ? await this.client.shard.broadcastEval('this.uptime') : this.client.uptime;
      if (uptime instanceof Array) {
        uptime = uptime.reduce((max, cur) => Math.max(max, cur), -Infinity);
      }
      let seconds = uptime / 1000;
      let days = parseInt(seconds / 86400);
      seconds = seconds % 86400;
      let hours = parseInt(seconds / 3600);
      seconds = seconds % 3600;
      let minutes = parseInt(seconds / 60);
      seconds = parseInt(seconds % 60);
    
      uptime = `${seconds}s`;
      if (days) {
        uptime = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
      }
      else if (hours) {
        uptime = `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
      }
      else if (minutes) {
        uptime = `${minutes} minutes and ${seconds} seconds`;
      }
      else if (seconds) {
        uptime = `${seconds} seconds`;
      }
      
 try {
   const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
   const date = new Date();
   const timestamp = date.getTime() - Math.floor(client.uptime);
   const embed = new MessageEmbed() // Prettier
    .setTitle(
     `<:uptime:965816130914644018> Uptime`,
     message.guild.iconURL({
      dynamic: true,
      format: "png",
     })
    )
    .addField(`⏱ Uptime`, `\`\`\`${uptime}\`\`\``)
    .setTimestamp()
    .setFooter(
     `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
    )
    .setColor("RANDOM");
   if ('https://sodachan.tk/stats') {
    embed.addField(`<:online:965815224156454943> Servers Status`, "```" + 'https://sodachan.tk/stats' + "```");
    const row = new MessageActionRow().addComponents(
     new MessageButton() // Prettier
      .setURL(`https://sodachan.tk/stats`)
      .setEmoji('<:online:965815224156454943>')
      .setLabel("Check server status")
      .setStyle("LINK")
    );
    message.reply({ embeds: [embed], components: [row] });
   } else {
    message.reply({ embeds: [embed] });
   }
  } catch (err) {
   console.log(err);
   this.client.emit(error, message);
  }
 }
};