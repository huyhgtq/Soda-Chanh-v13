  const Command = require('../../structures/Command');
const { MessageEmbed, MessageActionRow, MessageButton ,version: djsversion } = require('discord.js');
const { mem, cpu, drive } = require('node-os-utils');
const { oneLine, stripIndent } = require('common-tags');
const moment = require('moment');
const m = require("moment-duration-format");
const os = require('os');
const osutils = require("os-utils");
const ms = require("parse-ms");
const Guild = require('../../database/schemas/Guild');
const Discord = require("discord.js")
let cpuStat = require("cpu-stat");
const config = require("../../config.json");
const domain = require("../../config.js");
const { dependencies } = require("../../package.json");

function laysodep(num) {
        const pattern = /\B(?=(\d{3})+(?!\d))/g;
        return num.toString().replace(pattern, ',');
    }

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'stats',
        aliases: ['s', 'botinfo'],
        description: 'Hiển thị số liệu thống kê của Soda Chan',
        category: 'Information',
        cooldown: 3
      });
    }

    async run(message, args) {
    const client = message.client
	const guildDB = await Guild.findOne({ guildId: message.guild.id });
	const language = require(`../../data/language/${guildDB.language}.json`)
	const prefix = guildDB.prefix;
	const { totalGb, usedGb, freeGb, usedPercentage, freePercentage } = await drive.info();
	const core = os.cpus()[0];
   let cpuLol;
  cpuStat.usagePercent(function(err, percent, seconds) {
      if (err) {
          return console.log(err);
      }
      const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
      //
      let connectedchannelsamount = 0;
      let guilds = client.guilds.cache.map(guild=>guild)
      for(let i = 0; i< guilds.length; i++){
            if(guilds[i].me.voice.channel) connectedchannelsamount += 1;
            
      }
	  

	  const serverStats = stripIndent`
      OS -- ${os.platform()}
      CPU -- ${core.model}
      Cores -- ${cpu.count()}
      CPU Usage -- ${percent.toFixed(2)} %
	     Speed CPU -- ${core.speed}MHz
      RAM -- ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB
      RAM Usage -- ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
      Tổng bộ nhớ ${totalGb} GB
      Bộ nhớ sử dụng, ${usedGb} GB(${usedPercentage}%
      Bộ nhớ còn trống ${freeGb} GB(${freePercentage}%
    `;

	  const tech = stripIndent`
      Ping -- ${Math.round(message.client.ws.ping)}ms
      WebSocket Ping -- ${client.ws.ping}ms
      Uptime  -- ${duration}
      ${language.pogyVersion} -- Beta 3.0
      Library -- ${dependencies["discord.js"].replace("^", "v")}
      Environment -- ${process.version}
      Servers -- ${laysodep(client.guilds.cache.size)}
      ${language.users} -- ${laysodep(client.guilds.cache.reduce((a, b) => a + b.memberCount, 0))}
      ${language.channels} -- ${laysodep(message.client.channels.cache.size)}
      ${language.pogyCommands} -- ${laysodep(message.client.commands.size)}
      Aliases -- ${laysodep(message.client.aliases.size)}
	     Emojis Cache ${laysodep(client.emojis.cache.size)}
    `;
	  const info = stripIndent`
      SODA CHAN BOT ---
    `;
	  const devs= stripIndent`
     -------
     ${language.pogyOwners}
    • Harry#8479

     ${language.pogyDevelopers}
    • Harry#8479

     ${language.pogyContributor}
    • ly#5580
    • ! Losy . Anh Cả#3214
    -------
    `;
	  const row = new MessageActionRow() // Prettier
       .addComponents(
        new MessageButton() // Prettier
         .setURL(`https://discord.gg/2mHgQQz3GN`)
         .setEmoji('<:member_role:964292126814900234>')
         .setLabel("Support")
         .setStyle("LINK")
       )
       .addComponents(
        new MessageButton() // Prettier
         .setURL(`https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot`)
         .setEmoji('<:Channel:964292621478531072>')
         .setLabel("Invite me")
         .setStyle("LINK")
       );
      if (process.env.DOMAIN) {
       row.addComponents(
        new MessageButton() // Prettier
         .setURL(`${process.env.DOMAIN}`)
         .setEmoji('<:StopStream:964292991298711624>')
         .setLabel("Dashboard")
         .setStyle("LINK")
       );
      }
      const botinfo = new MessageEmbed()
          .setAuthor(client.user.username, config.AVATARURL) 
          .setTitle("__**Stats:**__")
          .setColor('RANDOM')
          .setTitle(`${language.pogyInfo}`, `\`\`\`css\n${info}\`\`\``)
	  	  .addField(`${language.pogyStats}`, `\`\`\`css\n${serverStats}\`\`\``)
          .addField(`${language.pogyGeneral}`, `\`\`\`css\n${tech}\`\`\``, true)
		  .addField(`${language.pogyTeam}`, `\`\`\`css\n${devs}\`\`\``, true)
          .setFooter("Coded by:    ! Losy | Harry#8479",config.AVATARURL)
      message.reply({ embeds: [botinfo], components: [row] })
  });
  }
  };