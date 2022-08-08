const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js');

const ReactionRole = require("../../packages/reactionrole/index.js")
const react = new ReactionRole()
const config = require("../../config.json");
react.setURL(config.mongodb_url)

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'rrtypes',
        aliases: ["rrtype", "reactionroletypes"],
        description: 'Enable / Disable DMs của vai trò phản ứng',
        category: 'Reaction Role',
        cooldown: 3,
      });
    }

    async run(message, args) {
    let client = message.client

       const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
    
      const language = require(`../../data/language/${guildDB.language}.json`)
      
    
      let fail = message.client.emoji.fail;
      let success = message.client.emoji.success;


  const embedType = new MessageEmbed()
  .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription(`\`Type 1\` - React thêm vai trò, việc không thực hiện sẽ xóa vai trò\n\`Type 2\` - Phản ứng sẽ mang lại vai trò nhưng không phản ứng sẽ không loại bỏ vai trò\n\`Type 3\` - Phản ứng sẽ xóa vai trò của người dùng và không phản ứng sẽ không trả lại vai trò đó\n\`Type 4\` - Khi phản ứng, nó sẽ xóa vai trò, không phản ứng sẽ thêm vai trò\n\`Type 5\` - Khái niệm tương tự như số 3 nhưng loại bỏ phản ứng của người dùng\n\`Type 6\` - Phản ứng để nhận vai trò và phản ứng lại để xóa vai trò`)
  .setFooter(`https://sodachan.tk/`)
   .setColor(client.color.red)

message.channel.send(embedType)


    }
};