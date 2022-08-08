const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js');

const ReactionRole = require("../../packages/reactionrole/models/schema")
const config = require("../../config.json");


module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'rrwipe',
        aliases: ["reactionrolewipe", "reactionroleswipe"],
        description: 'Xóa tất cả các trò chơi Vai trò phản hồi từ máy chủ hiện tại',
        category: 'Reaction Role',
        cooldown: 3,
        userPermission: ['MANAGE_GUILD'],
      });
    }

    async run(message, args) {
    let client = message.client

       const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
    
      const language = require(`../../data/language/${guildDB.language}.json`)
      


const conditional = {
   guildid: message.guild.id
}
const results = await ReactionRole.find(conditional)

if (results && results.length) {
    for (const result of results) {
        const { guildid } = result

        try {
            await ReactionRole.deleteOne(conditional)
        } catch (e) {
            console.log(e)
        }

    }

}


let resultsHeheLol = results.length
let resultsHehe = `reaction roles`
if (resultsHeheLol == '1') resultsHehe = 'reaction role';

if (resultsHeheLol === '0' || !results || !results.length){

let wipeEmbed3 = new MessageEmbed()
.setColor(message.client.color.green)
.setAuthor(message.author.tag, message.author.displayAvatarURL())
.setDescription(`Máy chủ hiện tại không có Vai trò phản ứng hiện tại!`)
.setFooter(`https://sodachan.tk/`)

message.channel.send(wipeEmbed3)

  return;
}

let wipeEmbed = new MessageEmbed()
.setColor(message.client.color.green)
.setAuthor(message.author.tag, message.author.displayAvatarURL())
.setDescription(`Đã xóa thành công **${results.length}** ${resultsHehe}`)
.setFooter(`https://sodachan.tk/`)


message.channel.send(wipeEmbed)
    }
};