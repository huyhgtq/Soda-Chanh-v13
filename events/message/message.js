const Event = require('../../structures/Event');
const { Permissions, Collection } = require("discord.js");
const afk = require("../../models/afk");
const Statcord = require("statcord.js");
const jsconfig = require("../../config")
const moment = require('moment');
const discord = require("discord.js");
const config = require('./../../config.json');
const { WebhookClient, MessageEmbed } = require('discord.js');
const logger = require('../../utils/logger');
const nsfwplease = require('../../assets/json/nfsw.json');
const mongoose = require('mongoose');
const Guild = require('../../database/schemas/Guild');
const User = require('../../database/schemas/User');
const Moderation = require('../../database/schemas/logging');
const Blacklist = require('../../database/schemas/blacklist');
const customCommand = require('../../database/schemas/customCommand');
const autoResponse = require('../../database/schemas/autoResponse');
const autoResponseCooldown = new Set();
const inviteFilter = require('../../filters/inviteFilter');
const linkFilter = require('../../filters/linkFilter');
const maintenanceCooldown = new Set();
const metrics = require('datadog-metrics');
const permissions = require('../../assets/json/permissions.json')
const Maintenance = require('../../database/schemas/maintenance')
const axios = require('axios');
const fetch = require("node-fetch")
require("moment-duration-format");

module.exports = class extends Event {
  constructor(...args) {
    super(...args);

    this.impliedPermissions = new Permissions([
      "VIEW_CHANNEL",
      "SEND_MESSAGES",
      "SEND_TTS_MESSAGES",
      "EMBED_LINKS",
      "ATTACH_FILES",
      "READ_MESSAGE_HISTORY",
      "MENTION_EVERYONE",
      "USE_EXTERNAL_EMOJIS",
      "ADD_REACTIONS"
    ]);

    this.ratelimits = new Collection();
  }

  async run(message) {
    try {

      if (!message.guild) return;
      
      if(config.datadogApiKey){
    metrics.init({ apiKey: this.client.config.datadogApiKey, host: 'soda', prefix: 'soda.' });

      }
      const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
      const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}>`);
    
      if (!message.guild || message.author.bot) return;

      const settings = await Guild.findOne({
        guildId: message.guild.id,
      }, async (err, guild) => {
        if (err) console.log(err)
        
        if (!guild) {
          const newGuild = await Guild.create({
            guildId: message.guild.id,
            prefix: config.prefix || '!',
            language: "english"
          });
        }
      });

      if (!settings) return message.channel.send('Oops, this server was not found in the database. Please try to run the command again now!');

if(config.datadogApiKey){
      // Add increment after every fucking message lmfao!
     metrics.increment('messages_seen');
}

      // Filters
      if (settings && await inviteFilter(message)) return;
      if (settings && await linkFilter(message)) return;

      let mainPrefix = settings ? settings.prefix : '!';

      const prefix = message.content.match(mentionRegexPrefix) ? 
        message.content.match(mentionRegexPrefix)[0] : mainPrefix 




      const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });

	       const moderation = await Moderation.findOne({
        guildId: message.guild.id
      });
	    
	    if(!moderation){
		    
		    Moderation.create({
			    guildId: message.guild.id
		    })
		    
	    }
// maintenance mode 


const maintenance = await Maintenance.findOne({
  maintenance: "maintenance"
})




   const userBlacklistSettings = await Blacklist.findOne({ discordId: message.author.id,});
  const guildBlacklistSettings = await Blacklist.findOne({ guildId: message.guild.id });
      //autoResponse

           
      const autoResponseSettings = await autoResponse.findOne({ guildId: message.guild.id, name: message.content.toLowerCase() });


      if (autoResponseSettings && autoResponseSettings.name) {

      if (userBlacklistSettings && userBlacklistSettings.isBlacklisted)  return;
     if(maintenance && maintenance.toggle == "true") return;
        if(autoResponseCooldown.has(message.author.id)) return message.reply(`${message.client.emoji.fail} Chậm lại nào - ${message.author}`)

         message.reply(autoResponseSettings.content  

        .replace(/{user}/g, `${message.author}`)

	 .replace(/{user_tag}/g, `${message.author.tag}`)
        .replace(/{user_name}/g, `${message.author.username}`)
        .replace(/{user_ID}/g, `${message.author.id}`)
        .replace(/{guild_name}/g, `${message.guild.name}`)
        .replace(/{guild_ID}/g, `${message.guild.id}`)
        .replace(/{memberCount}/g, `${message.guild.memberCount}`)
        .replace(/{size}/g, `${message.guild.memberCount}`)
        .replace(/{guild}/g, `${message.guild.name}`)
        .replace(/{member_createdAtAgo}/g, `${moment(message.author.createdTimestamp).fromNow()}`)
        .replace(/{member_createdAt}/g, `${moment(message.author.createdAt).format('MM-DD-YYYY')}`))
    

    autoResponseCooldown.add(message.author.id)
    setTimeout(()=>{
    autoResponseCooldown.delete(message.author.id)
    }, 2000)
    

    return;
      }

    
      //afk
      let language = require(`../../data/language/english.json`)
      if(guildDB) language = require(`../../data/language/${guildDB.language}.json`)
      

      moment.suppressDeprecationWarnings = true;

      if(message.mentions.members.first()){
        if(maintenance && maintenance.toggle == "true") return;
        const afklist = await afk.findOne({ userID: message.mentions.members.first().id, serverID: message.guild.id});
        if(afklist){
          
           await message.guild.members.fetch(afklist.userID).then(member => {
           let user_tag = member.user.tag;
           return message.reply(`**${afklist.oldNickname || user_tag || member.user.username}** ${language.afk6} ${afklist.reason} **- ${moment(afklist.time).fromNow()}**`).catch(() => {});
           });
        }
        }
        
        
        const afklis = await afk.findOne({ userID: message.author.id, serverID: message.guild.id});
        
        
        if(afklis) {
          if(maintenance && maintenance.toggle == "true") return;
          let nickname =  `${afklis.oldNickname}`;
          message.member.setNickname(nickname).catch(() => {});
          await afk.deleteOne({ userID: message.author.id });
          return  message.reply(new discord.MessageEmbed().setColor('GREEN').setDescription(`${language.afk7} ${afklis.reason}`)).then(m => {
                setTimeout(() => {
                    m.delete().catch(() => {});
                }, 10000);
              });
        
        };
        
      if (!message.content.startsWith(prefix)) return;
      
      // eslint-disable-next-line no-unused-vars  
      const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
      const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));



// maintenance mode 

if(!this.client.config.developers.includes(message.author.id)){

if(maintenance && maintenance.toggle == "true") {
 
if(maintenanceCooldown.has(message.author.id)) return;

message.reply(`${jsconfig.bot_name} hiện đang được bảo trì sẽ không cho phép bất kỳ ai truy cập ${jsconfig.bot_name}'s. Vui lòng thử lại sau. Để cập nhật: https://discord.gg/2mHgQQz3GN`)

maintenanceCooldown.add(message.author.id);
setTimeout(() => {
maintenanceCooldown.delete(message.author.id)
}, 10000);

  return;
}
}



      // Custom Commands
      const customCommandSettings = await customCommand.findOne({ guildId: message.guild.id, name: cmd.toLowerCase() });

      const customCommandEmbed = await customCommand.findOne({ guildId: message.guild.id, name: cmd.toLowerCase() });

       if (customCommandSettings && customCommandSettings.name && customCommandSettings.description) {

         if (userBlacklistSettings && userBlacklistSettings.isBlacklisted) return;


let embed = new MessageEmbed()
 .setTitle(customCommandEmbed.title)                                 
 .setDescription(customCommandEmbed.description)
 .setFooter(``)

if( customCommandEmbed.image !== "none") embed.setImage(customCommandEmbed.image)
if( customCommandEmbed.thumbnail !== "none") embed.setThumbnail(customCommandEmbed.thumbnail)
                                 
if( customCommandEmbed.footer !== "none") embed.setFooter(customCommandEmbed.footer)
if( customCommandEmbed.timestamp !== "no") embed.setTimestamp()
if( customCommandEmbed.color == 'default') {

embed.setColor(message.guild.me.displayHexColor)

                        } else embed.setColor(`${customCommandEmbed.color}`)

return message.reply({ embeds: [embed] });
       }


      if (customCommandSettings && customCommandSettings.name && !customCommandSettings.description && customCommandSettings.json == "false") {
  if (userBlacklistSettings && userBlacklistSettings.isBlacklisted)  return;
        return message.reply(customCommandSettings.content
        
        
    .replace(/{user}/g, `${message.author}`)

	 .replace(/{user_tag}/g, `${message.author.tag}`)
        .replace(/{user_name}/g, `${message.author.username}`)
        .replace(/{user_ID}/g, `${message.author.id}`)
        .replace(/{guild_name}/g, `${message.guild.name}`)
        .replace(/{guild_ID}/g, `${message.guild.id}`)
        .replace(/{memberCount}/g, `${message.guild.memberCount}`)
        .replace(/{size}/g, `${message.guild.memberCount}`)
        .replace(/{guild}/g, `${message.guild.name}`)
        .replace(/{member_createdAtAgo}/g, `${moment(message.author.createdTimestamp).fromNow()}`)
        .replace(/{member_createdAt}/g, `${moment(message.author.createdAt).format('MM-DD-YYYY')}`)
    
    )
      }

      
      if (customCommandSettings && customCommandSettings.name && !customCommandSettings.description && customCommandSettings.json == "true") {
  if (userBlacklistSettings && userBlacklistSettings.isBlacklisted)  return;
        const command = JSON.parse(customCommandSettings.content)
        return message.reply(command).catch((e)=>{message.reply(`Đã xảy ra sự cố khi gửi tệp nhúng của bạn, đây có thể là lỗi JSON.\nĐọc thêm tại đây -> https://${jsconfig.domain}/embeds\n\n__Error:__\n\`${e}\``)})
      }

      if (command) {
        await User.findOne({
          discordId: message.author.id
        }, (err, user) => {
          if (err) console.log(err)
          
          if (!user) {
            const newUser = new User({
              discordId: message.author.id
            })
  
            newUser.save()
          }
        });

     
        
        const disabledCommands = guildDB.disabledCommands;
        if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');


        const rateLimit = this.ratelimit(message, cmd);

        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;

        // Check if user is Blacklisted
        if (userBlacklistSettings && userBlacklistSettings.isBlacklisted) {
          logger.warn(`${message.author.tag} đã cố gắng sử dụng "${cmd}" lệnh nhưng người dùng bị đưa vào danh sách đen`, { label: 'Commands' })
          return message.reply(`${message.client.emoji.fail} Bạn bị đưa vào danh sách đen của bot :(`);
        }

        // Check if server is Blacklisted
        if (guildBlacklistSettings && guildBlacklistSettings.isBlacklisted) {
          logger.warn(`${message.author.tag} đã cố gắng sử dụng "${cmd}" chỉ huy nhưng guild bị đưa vào danh sách đen`, { label: 'Commands' })
          return message.reply(`${message.client.emoji.fail} Máy chủ này bị đưa vào danh sách đen :(`);
        }
        
        let number = Math.floor((Math.random() * 10) + 1);
        if (typeof rateLimit === "string") return message.reply(` ${message.client.emoji.fail} Vui lòng chờ **${rateLimit}** trước khi chạy **${cmd}** ra lệnh một lần nữa - ${message.author}\n\n${number === 1 ? `*Bạn có biết rằng ${jsconfig.bot_name} có bảng điều khiển riêng của nó? ${jsconfig.domain}` : ""}`).then((s)=>{
          message.delete().catch(()=>{});
          s.delete({timeout: 100000000}).catch(()=>{})
        }).catch(()=>{})
  

        if (command.botPermission) {

          const missingPermissions =
      message.channel.permissionsFor(message.guild.me).missing(command.botPermission).map(p => permissions[p]);

          if (missingPermissions.length !== 0) {
       const embed = new MessageEmbed()
        .setAuthor(`${this.client.user.tag}`, message.client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`Thiếu quyền của Bot`)
        .setDescription(`Tên lệnh: **${command.name}**\nQuyền được yêu cầu: **${missingPermissions.map(p => `${p}`).join(' - ')}**`)
        .setTimestamp()
        .setFooter(`https://${jsconfig.domain}`)
        .setColor(message.guild.me.displayHexColor);
      return message.reply({ embeds: [embeds] }).catch(()=>{})
          }
        }

   
      

  
        if (command.userPermission) {
             const missingPermissions =
        message.channel.permissionsFor(message.author).missing(command.userPermission).map(p => permissions[p]);
      if (missingPermissions.length !== 0) {
        const embed = new MessageEmbed()
          .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
          .setTitle(`Thiếu quyền của người dùng`)
          .setDescription(`Tên lệnh: **${command.name}**\nQuyền được yêu cầu: **${missingPermissions.map(p => `${p}`).join('\n')}**`)
          .setTimestamp()
          .setFooter(`https://${jsconfig.domain}`)
          .setColor(message.guild.me.displayHexColor);
       return message.reply({ embeds: [embed] }).catch(()=>{})
      }

        }
        if(disabledCommands.includes(command.name || command)) return;


        if (command.ownerOnly) {
          if (!this.client.config.developers.includes(message.author.id)) return
        }

if(config.datadogApiKey){
       metrics.increment('commands_served');
}

    
        
        await this.runCommand(message, cmd, args)

        .catch(error => {
          if(config.datadogApiKey){
        metrics.increment('command_error');
          }

          return this.client.emit("commandError", error, message, cmd);
        })
      }
    } catch(error) {
      if(config.datadogApiKey){
       metrics.increment('command_error');
      }
      return this.client.emit("fatalError", error, message);
    }
  } 

    async runCommand(message, cmd, args) {

        if (!message.channel.permissionsFor(message.guild.me) || !message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS'))
          return message.reply(`${message.client.emoji.fail} Thiếu quyền của bot - **liên kết Embeds**`)

        const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
        logger.info(`"${message.content}" (${command.name}) ran by "${message.author.tag}" (${message.author.id}) on guild "${message.guild.name}" (${message.guild.id}) channel "#${message.channel.name}" (${message.channel.id})`, { label: 'Command' })
      
        await command.run(message, args)
    }
	

    ratelimit(message, cmd) {
      try {
        const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
        if (message.author.permLevel > 4) return false;
    
        const cooldown = command.cooldown * 1000
        const ratelimits = this.ratelimits.get(message.author.id) || {}; // get the ENMAP first.
        if (!ratelimits[command.name]) ratelimits[command.name] = Date.now() - cooldown; // see if the command has been run before if not, add the ratelimit
        const difference = Date.now() - ratelimits[command.name]; // easier to see the difference
        if (difference < cooldown) { // check the if the duration the command was run, is more than the cooldown
          return moment.duration(cooldown - difference).format("D [ngày], H [tiếng], m [phút], s [giây]", 1); // returns a string to send to a channel
        } else {
          ratelimits[command.name] = Date.now(); // set the key to now, to mark the start of the cooldown
          this.ratelimits.set(message.author.id, ratelimits); // set it
          return true;
        }
      } catch(e) {
        this.client.emit("fatalError", error, message);
      }
    }
}
