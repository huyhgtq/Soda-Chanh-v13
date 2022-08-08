const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { stripIndent } = require('common-tags');

const verificationLevels = {
  NONE: '`Không`',
  LOW: '`Thấp`',
  MEDIUM: '`Trung bình`',
  HIGH: '`Cao`',
  VERY_HIGH: '`Cao nhất`'
};
const notifications = {
  ALL: '`Tất cả`',
  MENTIONS: '`Đề cập`'
};

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'server',
        aliases: [],
        description: 'Kiểm tra máy chủ',
        category: 'Owner',
		disabled: true,
        ownerOnly: true
      });
    }

    async run(message, args) {
     
 function checkDays(date) {
      let now = new Date();
      let diff = now.getTime() - date.getTime();
      let days = Math.floor(diff / 86400000);
      return days + (days == 1 ? " day" : " days") + " ago";
  };
  let verifLevels = ["Không", "Thấp", "Trung bình", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];
  let region = {
    "eu-central": ":flag_eu: Central Europe",
    "singapore": ":flag_sg: Singapore",
    "us-central": ":flag_us: U.S. Central",
    "sydney": ":flag_au: Sydney",
    "us-east": ":flag_us: U.S. East",
    "us-south": ":flag_us: U.S. South",
    "us-west": ":flag_us: U.S. West",
    "eu-west": ":flag_eu: Western Europe",
    "vip-us-east": ":flag_us: VIP U.S. East",
    "london": ":flag_gb: London",
    "amsterdam": ":flag_nl: Amsterdam",
    "hongkong": ":flag_hk: Hong Kong",
    "russia": ":flag_ru: Russia",
    "southafrica": ":flag_za:  South Africa",
    "brazil": ":flag_br: Brazil"
};
const guildId = args[0];
const guild = message.client.guilds.cache.get(guildId);
if (!guild) return message.reply(`Invalid guild ID`)

const embed = new MessageEmbed() 
.setAuthor(guild.name, guild.iconURL())
.addField("General", [
                `**--> ID máy chủ, ${guild.id}`,
                `**--> Chủ sở hữu, <@${guild.ownerId}>`,
                `**--> ID chủ sở hữu, ${guild.ownerId}`,
                `**--> Vùng đất, ${guild.region}`,
                `**--> Tổng số | Người dùng | Bots, ${guild.members.cache.size} | ${guild.members.cache.filter(member => !member.user.bot).size} | ${guild.members.cache.filter(member => member.user.bot).size}`,
                `**--> Mức độ xác minh, ${guild.verificationLevel}`,
                `**--> Kênh, ${guild.channels.cache.size}`,
                `**--> Vai trò, ${guild.roles.cache.size}`,
                `**--> Ngày thành lập, ${guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(guild.createdAt)})`,
                '\u200b',
            ])

.setThumbnail(guild.iconURL())
.setColor(message.guild.me.displayHexColor);
    message.channel.send({ embeds: [embed]}).catch(error => {
        mmessage.reply(`Lỗi: ${error}`)

  });
    

    }
};
