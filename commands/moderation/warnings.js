const Command = require('../../structures/Command');
const Discord = require("discord.js")
const moment = require("moment")
const Guild = require("../../database/schemas/Guild.js");
const Economy = require('../../models/economy.js');
const { MessageEmbed } = require('discord.js');
const warnModel = require('../../models/moderation.js');
const mongoose = require('mongoose');
const ReactionMenu = require('../../data/ReactionMenu.js');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'warns',
        aliases: ['ws', 'warnings'],
        description: 'Kiểm tra một số cảnh báo người dùng nhất định',
        category: 'Moderation',
        usage: '<người dùng>',
        examples: [ 'warnings @Yuunya' ],
        guildOnly: true,
        botPermission: ['ADD_REACTIONS'],
        userPermissions: ['KICK_MEMBERS'],
      });
    }

    async run(message, args) {

        let client = message.client
        const settings = await Guild.findOne(
            {
                guildId: message.guild.id
            },
            (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        _id: mongoose.Types.ObjectId(),
                        guildId: message.guild.id,
                        guildName: message.guild.name,
                        prefix: client.config.prefix,
                        language: 'english'
                    });
    
                    newGuild
                        .save()
                        .then(result => console.log(result))
                        .catch(err => console.error(err));
    
                    return message.reply('Máy chủ này không có trong cơ sở dữ liệu của chúng tôi! Chúng tôi đã thêm nó, vui lòng nhập lại lệnh này.')
                        .then(m => m.delete({ timeout: 10000 }));
                }
            }
        );
        
    const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
      let language = require(`../../data/language/${guildDB.language}.json`)
      
      const mentionedMember = message.mentions.members.first()
            || message.guild.members.cache.get(args[0])
            || message.member
    
        const warnDoc = await warnModel.findOne({
            guildID: message.guild.id,
            memberID: mentionedMember.id,
        }).catch(err => console.log(err))
    
        if (!warnDoc || !warnDoc.warnings.length) {
            return message.channel.send(new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription(`${message.client.emoji.fail} | **${mentionedMember.user.tag}** ${language.warningsNoError}`)
                .setTimestamp(message.createdAt)
                .setColor(client.color.red))
        }
    
        const data = []
    
    
        for (let i = 0; warnDoc.warnings.length > i; i++) {
            data.push(`**Người điều hành:** ${await message.client.users.fetch(warnDoc.moderator[i])}\n**Lý do:** ${warnDoc.warnings[i]}\n**Ngày tháng:** ${moment(warnDoc.date[i]).format("MM-DD-YYYY")}\n**ID cảnh báo:** ${i + 1}\n`)
        }
    
        const count = warnDoc.warnings.length;
    
    
    const embed = new MessageEmbed()
          .setAuthor(mentionedMember.user.tag, mentionedMember.user.displayAvatarURL({ dynamic: true }))
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(client.color.blue);
    
         const buildEmbed = (current, embed) => {
          const max = (count > current + 4) ? current + 4 : count;
          let amount = 0;
          for (let i = current; i < max; i++) {
    

    if (warnDoc.warnings[i].length > 1000) warnDoc.warnings[i] = warnDoc.warnings[i].slice(0, 1000) + '...';
            embed // Build warning list
              .addField('\u200b', `**${language.warnName || 'unknown'} \`#${i + 1}\`**`)
              .addField(`${language.warnModerator || 'unknown' }`, message.guild.members.cache.get(warnDoc.moderator[i]), true)
              
              .addField(`${language.warnAction || 'unknown'}`, warnDoc.modType[i], true) //it says if its mute or warn or ban etc

              .addField(`${language.warnReason || 'unknown'}`, warnDoc.warnings[i], true)
              .addField(`${language.warnID || 'unknown'}`, `${warnDoc.warningID[i]}`, true)
              .addField(`${language.warnDateIssued || 'unknown'}`, `${moment(warnDoc.date[i]).format("MM-DD-YYYY")}`);
            amount += 1;
          }
    
         
          return embed
            .setTitle(`${language.warnList} [${current} - ${max}]`)
            .setDescription(`Hiển thị \`${amount}\` của ${mentionedMember}'s \`${count}\` tổng số cảnh báo.`);
        };
    
     
     
        if (count < 4) return message.channel.send(buildEmbed(0, embed));
        else {
    
          let n = 0;
          const json = embed.setFooter(
            `${language.warnExpire}\n` + message.member.displayName, 
            message.author.displayAvatarURL({ dynamic: true })
          ).toJSON();
          
          const first = () => {
            if (n === 0) return;
            n = 0;
            return buildEmbed(n, new MessageEmbed(json));
          };
    
          const previous = () => {
            if (n === 0) return;
            n -= 4;
            if (n < 0) n = 0;
            return buildEmbed(n, new MessageEmbed(json));
          };
    
          const next = () => {
            const cap = count - (count % 4);
            if (n === cap || n + 4 === count) return;
            n += 4;
            if (n >= count) n = cap;
            return buildEmbed(n, new MessageEmbed(json));
          };
    
          const last = () => {
            const cap = count - (count % 4);
            if (n === cap || n + 4 === count) return;
            n = cap;
            if (n === count) n -= 4;
            return buildEmbed(n, new MessageEmbed(json));
          };
    
          const reactions = {
             '⏪': first,
             '◀️': previous,
             '⏹️': null,
             '▶️': next,
             '⏩': last,
          };
    
          const menu = new ReactionMenu(
            message.client,
            message.channel, 
            message.member, 
            buildEmbed(n, new MessageEmbed(json)), 
            null,
            null,
            reactions, 
            180000
          )
    
          menu.reactions['⏹️'] = menu.stop.bind(menu)
        
        
      
    };
    
};
};