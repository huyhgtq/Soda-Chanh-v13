const Command = require('../../structures/Command');
const { WebhookClient, MessageEmbed } = require('discord.js');
const webhookClient = new WebhookClient({ 
id: '893957973032984646',
token: 'AHoKy0CvTcDXH16kvXJx15llew6qhgxC6Nbca25azLZQGXvkPrvsOJNEG01tgbRUXd7J'});


const logger = require('../../utils/logger');
const Blacklist = require('../../database/schemas/blacklist');
const Guild = require("../../database/schemas/Guild.js");
const mongoose = require("mongoose")
const ms = require("ms")
 const msRegex = RegExp(/(\d+(s|m|h|w))/)
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'blacklist',
        aliases: ['bl'],
        description: 'Adds a user to the blacklist.',
        category: 'Owner',
        usage: [ '<user> <reason>' ],
        ownerOnly: true
      });
    }

    async run(message, args) {

      const match = message.content.match(/\d{18}/);
      let member;
      try {
member =  match ? message.mentions.members.first() || message.guild.members.fetch(args[1]) : null;
      } catch {
        return message.reply(`Cung cấp cho tôi một người dùng`)
      }
   
      let guild = this.client.guilds.cache.get(args[1]);
      let reason = args.slice(2).join(' ') || 'Không được chỉ định';

      if (args.length < 1) return message.reply(`Vui lòng cung cấp cho tôi danh sách đen của người dùng hoặc máy chủ`)
      if (args.length < 2) return message.reply(`Provide me with a user`)
 
   


      if(!member) return message.reply(`Cung cấp cho tôi một người dùng hợp lệ`)

      if (args[0] === 'user') {
        await Blacklist.findOne({
          discordId: member.id,
        }, (err, user) => {
          if (!user) {
            const blacklist = new Blacklist({ discordId: member.id, length: null, type: 'user', isBlacklisted: true, reason })
            blacklist.save()
          } else {
            user.updateOne({ type: 'user', isBlacklisted: true, reason,length: null, })
          }
        });

       

        channel.send({
          embed: {
            color: "BLURPLE",
            title: `Người dùng đã được thêm vào danh sách đen! `,
            description: `${member.user.tag} - \`${reason}\``,
          }
        });

        const embed = new MessageEmbed()
          .setColor('BLURPLE')
          .setTitle(`Báo cáo danh sách đen`)
          .addField('Status', 'Đã thêm vào danh sách đen.')
          .addField('Người sử dụng', `${member.user.tag} (${member.id})`)
          .addField('Chịu trách nhiệm', `${message.author} (${message.author.id})`)
          .addField('Lý do', reason)

        return webhookClient.send({
          username: 'Soda chan',
          embeds: [embed]
        });
      }


// guild blacklist
      if (args[0] === 'guild') {
        await Blacklist.findOne({
          guildId: guild,
        }, (err, server) => {
          if (!server) {
            const blacklist = new Blacklist({ guildId: guild.id, length: null, type: 'guild', isBlacklisted: true, reason })
            blacklist.save()
          } else {
            server.updateOne({ type: 'guild', isBlacklisted: true, reason, length:null })
          }
        });
        

        channel.send({
          embed: {
            color: "BLURPLE",
            title: 'Máy chủ được thêm vào danh sách đen!',
            description: `${guild.name} - \`${reason}\``,
          }
        });

        const embed = new MessageEmbed()
          .setColor('BLURPLE')
          .setTitle(`Báo cáo danh sách đen`)
          .addField('Status', 'Đã thêm vào danh sách đen.')
          .addField('Máy chủ', `${guild.name} (${guild.id})`)
          .addField('Chịu trách nhiệm', `${message.author} (${message.author.id})`)
          .addField('Lý do', reason)

        return webhookClient.send({
          username: 'Soda Blacklists',
          embeds: [embed]
        });
      }
    }
};
