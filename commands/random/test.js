const Command = require('../../structures/Command');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Guild = require('../../database/schemas/Guild');
const random = require('random-number-csprng');
const array = require('../../assets/json/thinh.json').data;
const RandomUser = require('../../database/schemas/random');
const moment = require('moment');
const emojis = require('../../assets/emojis.json');
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'random1',
      aliases: [],
      description: 'Điều này là dành cho các nhà phát triển.',
      category: 'random',
      usage: [ '<thing-to-exec>' ],
      ownerOnly: true
    });
  }

  async run(message, args) {
	
	const client = message.client
    const guildDB = await Guild.findOne({ guildId: message.guild.id });
    const language = require(`../../data/language/${guildDB.language}.json`)
	const text = array[Math.floor(Math.random() * array.length)];
	await message.channel.sendTyping()
    if (!args[0] || isNaN(args[0])) return message.reply('Số thứ nhất không hợp lệ, vui lòng thử lại');
    const first = parseInt(args[0]);
    const second = parseInt(args[1]) || null;
    if (first < 0 || second < 0) return message.channel.send('Số không thể nhỏ hơn 0');
    if (first > 1000000000 || second > 1000000000) return message.channel.send('Số không thể lớn hơn 1 000 000 000');
    if (args[1] && second === null) return message.reply('Số thứ hai không hợp lệ, vui lòng thử lại!');
	if (message.content.includes('0')) {
      return message.channel.send(`Số không thể nhỏ hơn 0`)
    }

 let member = message.mentions.members.last() || message.member;
	  if(!member) {try {member = await message.guild.members.fetch(args[0])  } catch {member = message.member;}}
      let userFind = await RandomUser.findOne({
        discordId: member.id
      });
      if(!userFind){
              const newUser = new RandomUser({
              discordId: member.id
            })
            newUser.save()
             userFind = await RandomUser.findOne({
        discordId: member.id
      });
      }
let randoms;
if(userFind && userFind.randoms){
randoms = userFind.randoms.join(" ")
if(!random || !random.length) random = `\`🎲 Yêu em **${Math.abs(randomNum)}** lần:\``
} else {
  randoms = `\`🎲 Yêu em **${Math.abs(randomNum)}** lần\``
}


	  
const randomNum = await random(second ? first : 0, second ? second : first);
  try {	

 const random = new MessageEmbed()
	.setColor('#0099ff')
	.setDescription(`${randoms ||`🎲 Yêu em **${Math.abs(randomNum)}** lần`}`)
	.setThumbnail('https://i.imgur.com/AfFp7pu.png') 
    .setFooter(
     `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
    );

    const row = new MessageActionRow() 
    .addComponents(
     new MessageButton() 
      .setLabel("SUPPORT")
      .setStyle("LINK")
      .setURL(`https://discord.gg/2mHgQQz3GN`)
        )
   return message.reply({ embeds: [random], components: [row] });
//MessageEmbed khach hang 




        }catch (err) {
   console.log(err);
this.client.emit(error, message);
        }
	    
  }
}