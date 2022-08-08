const Command = require('../../structures/Command');
const { WebhookClient, MessageEmbed } = require('discord.js');
const webhookClient = new WebhookClient({ 
id: '807251494520881232',
token: 'JpQapDJHsWHJJasugEk3ZpWaTPhxqP9c_sYcyABjSrkxpCIvBwJzt_0G6xL1GB0wS3iy'});
const logger = require('../../utils/logger');
const Blacklist = require('../../database/schemas/blacklist');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'unblacklist',
        description: 'Xóa người dùng khỏi danh sách đen.',
        category: 'Owner',
        usage: [ '<user>' ],
		disabled: true,
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
      if (args.length < 2) return message.reply(`Cung cấp cho tôi một người dùng`)
   
   


      if(!member) return message.reply(`Cung cấp cho tôi một người dùng hợp lệ`)
      //.then(logger.info(`I have added ${member.user.tag} to the blacklist!`, { label: 'Blacklist' }))

      if (args[0].includes('user')) {
        await Blacklist.findOne({
          discordId: member.id,
        }, (err, user) => {
          user.deleteOne()
        })
        message.reply({
          embed: {
            color: "BLURPLE",
            title: 'Người dùng bị xóa khỏi danh sách đen!',
            description: `${member.user.tag} - \`${reason}\``,
          }
        });

        const embed = new MessageEmbed()
          .setColor('BLURPLE')
          .setTitle(`Báo cáo danh sách đen`)
          .addField('Status', 'Đã xóa khỏi danh sách đen.')
          .addField('Người dùng', `${member.user.tag} (${member.id})`)
          .addField('Chịu trách nhiệm', `${message.author} (${message.author.id})`)
          .addField('Lý', reason)

        webhookClient.send({
          username: 'Soda Chan',
          embeds: [embed]
        });

        return;
      }

      if (args[0].includes('guild')) {
        await Blacklist.findOne({
          guildId: guild.id,
        }, (err, server) => {
          server.deleteOne()
        })
        
        message.reply({
          embed: {
            color: "BLURPLE",
            title: 'Máy chủ bị xóa khỏi danh sách đen!',
            description: `${guild.name} - \`${reason}\``,
          }
        });

        const embed = new MessageEmbed()
          .setColor('BLURPLE')
          .setTitle(`Blacklist Report`)
          .addField('Status', 'Đã xóa khỏi danh sách đen.')
          .addField('Máy chủ', `${guild.name} (${guild.id})`)
          .addField('Chịu trách nhiệm', `${message.author} (${message.author.id})`)
          .addField('Lý do', reason)

        webhookClient.send({
          username: 'Soda Chan',
          embeds: [embed]
        });
      }

    }
};
