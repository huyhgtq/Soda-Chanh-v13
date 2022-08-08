const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const discord = require("discord.js")
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

const emojiArray = require('../../data/structures/optionArray');
const pollModel = require('../../database/schemas/poll');
const squigglyRegex = RegExp(/{(.*?)}/);
const squareRegex = RegExp(/\[[^[]+\]/g);
const timeRegex = RegExp(/"(\d+(s|m|h|d|w))"/);
const moment = require('moment');
const ms = require('ms');


module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'poll',
        description: 'Tạo một cuộc thăm dò ý kiến trong máy chủ của bạn!',
        category: 'Utility',
        cooldown: 3,
        botPermission: ["ADD_REACTIONS"],
        userPermission: ["MANAGE_MESSAGES"]
      });
    }

    async run(message, args) {
let client = message.client

       const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
    
      const language = require(`../../data/language/${guildDB.language}.json`)
      
      let prefix = guildDB.prefix

       const pollParameters = args.join(' ');


        const pollTitle = squigglyRegex.test(pollParameters) ? squigglyRegex.exec(pollParameters)[1] : null;

     //   console.log(squigglyRegex.exec(pollParameters));


let embedValid = new MessageEmbed()
.setAuthor(message.author.tag, message.author.displayAvatarURL())
.setDescription(`${language.poll1.replace(/{prefix}/g, `${prefix}`)}`)
.setFooter('https://sodachan.tk/')
.setColor(message.guild.me.displayHexColor)

let embedValid2 = new MessageEmbed()
.setAuthor(message.author.tag, message.author.displayAvatarURL())
.setDescription(`__**${language.poll2}**${language.poll1.replace(/{prefix}/g, `${prefix}`)}`)
.setFooter('https://sodachan.tk/')
.setColor(message.guild.me.displayHexColor)


        if (!pollTitle) {
            return message.reply({ embeds: [embedValid] }).catch(err => console.log(err));
        }

        pollParameters.replace(`{${pollTitle}}`, '');
        const pollsArray = pollParameters.match(squareRegex);

        if (!pollsArray) {
            return message.reply({ embeds: [embedValid] }).catch(() => {});
        }
        else if (pollsArray.length > 20) {
            return message.reply({ embeds: [embedValid2] }).catch(() => {});
        }

        let i = 0;
        const pollString = pollsArray.map(poll => `${emojiArray()[i++]} ${poll.replace(/\[|\]/g, '')}`).join('\n\n');

const text = args.slice(0).join(' ')
//console.log(text)
        const timedPoll = timeRegex.test(args[0]) ? timeRegex.exec(args[0])[1] : null;


        const embed = {
            color: 'BLUE',
            title: pollTitle,
            description: pollString,
            footer: {text: timedPoll ? `${language.poll3} ${moment(Date.now() + ms(timedPoll)).format('LLLL')}` : '', },
        };

        
let msg = await message.reply({ embeds: [embed] }).catch(() => {});

        if (timedPoll) {
          if(guildDB.isPremium === "false"){
if(msg){
msg.delete().catch(()=>{})
}
message.reply({ embeds: [new MessageEmbed().setColor(message.guild.me.displayHexColor).setDescription(`${message.client.emoji.fail} Hãy chậm lại ở đây, các cuộc thăm dò theo thời gian chỉ dành cho các máy chủ cao cấp.\n\n[Kiểm tra Premium tại đây](https://sodachan.tk/premium/)`)]})
	return; }
           

            const pollDoc = new pollModel({
                guild: message.guild.id,
                textChannel: message.channel.id,
                message: msg.id,
                expiryDate: Date.now() + ms(timedPoll),
                title: pollTitle
            });

            await pollDoc.save().catch(err => console.log(`Lỗi thăm dò ý kiến trong cuộc thăm dò ý pollDoc.save: ${err}`));
        }


        for (i = 0; i < pollsArray.length; i++) {
            await msg.react(emojiArray()[i]).catch(() => {});
            await delay(750);
        }

    }
};
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}