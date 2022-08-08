const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const discord = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');
const domain = require("../../config.js");

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'checkperm',
        aliases: ["check-perm", "perm-check", "checkperms", "check-perms", "perms-check"],
        description: 'Cung cấp liên kết trang web để liên hệ với chúng tôi',
        category: 'Information',
        usage: 'checkperm',
        examples: [ '' ],
        cooldown: 3
      });
    }

    async run(message, args){

		const guildDB = await Guild.findOne({ guildId: message.guild.id });
		const language = require(`../../data/language/${guildDB.language}.json`)
		
  try {
   const embed = new MessageEmbed()
    .setTitle(`<:sodaa:963940635675623424> Kiểm tra quyền của bot`)
    .setDescription(
     `Đây là các quyền của bot trên máy chủ này. Nếu <@830459482634453022> bỏ lỡ chúng, một số lệnh và chức năng sẽ bị vô hiệu hóa!
     • \`ADMINISTRATOR\`: ${message.guild.me.permissions.has("ADMINISTRATOR") ? `✅` : `❌`}\n
     • \`MANAGE_MESSAGES\`: ${message.guild.me.permissions.has("MANAGE_MESSAGES") ? `✅` : `❌ Lỗi!`}
     • \`MANAGE_CHANNELS\`: ${message.guild.me.permissions.has("MANAGE_CHANNELS") ? `✅` : `❌ Lỗi!`}
     • \`KICK_MEMBERS\`: ${message.guild.me.permissions.has("KICK_MEMBERS") ? `✅` : `❌ Lỗi!`}
     • \`BAN_MEMBERS\`: ${message.guild.me.permissions.has("BAN_MEMBERS") ? `✅` : `❌ Lỗi!`}
     • \`ADD_REACTIONS\`: ${message.guild.me.permissions.has("ADD_REACTIONS") ? `✅` : `❌ Lỗi!`}
     • \`MANAGE_EMOJIS_AND_STICKERS\`: ${message.guild.me.permissions.has("MANAGE_EMOJIS_AND_STICKERS") ? `✅` : `❌ Lỗi!`}
     • \`VIEW_AUDIT_LOG\`: ${message.guild.me.permissions.has("VIEW_AUDIT_LOG") ? `✅` : `❌ Lỗi!`}
     • \`SEND_MESSAGES\`: ${message.guild.me.permissions.has("SEND_MESSAGES") ? `✅` : `❌ Lỗi!`}
     • \`MANAGE_MESSAGES\`: ${message.guild.me.permissions.has("MANAGE_MESSAGES") ? `✅!` : `❌ Lỗi!`}
     • \`EMBED_LINKS\`: ${message.guild.me.permissions.has("EMBED_LINKS") ? `✅` : `❌ Lỗi!`}
     • \`ATTACH_FILES\`: ${message.guild.me.permissions.has("ATTACH_FILES") ? `✅` : `❌ Lỗi!`}
     • \`USE_EXTERNAL_EMOJIS\`: ${message.guild.me.permissions.has("USE_EXTERNAL_EMOJIS") ? `✅` : `❌ Lỗi!`}
     • \`CONNECT\`: ${message.guild.me.permissions.has("CONNECT") ? `✅` : `❌ Lỗi!`}
     • \`SPEAK\`: ${message.guild.me.permissions.has("SPEAK") ? `✅` : `❌ Lỗi!`}
     `
    )
    .setTimestamp()
    .setColor("RANDOM")
    .setFooter(
     `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
    );
    message.reply({ embeds: [embed]})
  } catch (err) {
   console.log(err);
	  this.client.emit(error, message);
  }
 }
};
