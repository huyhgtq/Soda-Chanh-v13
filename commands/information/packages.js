const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const discord = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');

 module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'packages',
        aliases: ["packages", "pkgs"],
        description: `Trả về số lượng packages mà tôi sử dụng`,
        category: 'Information',
        cooldown: 5
      });
    }
 async run(message, args) {

	const guildDB = await Guild.findOne({ guildId: message.guild.id });
	const language = require(`../../data/language/${guildDB.language}.json`)
	 
  try {
	   
   const embed = new MessageEmbed() // Prettier
    .setTitle(`📦 Packages`)
    .setDescription(`> <@830459482634453022> chạy bằng ${Object.keys(require("../../package").dependencies).length} [NPM packages](https://www.npmjs.com) (Javascript power!)`)
    .setTimestamp()
    .setImage("https://i.redd.it/tfugj4n3l6ez.png")
    .setColor("RANDOM")
    .setFooter(
     `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
    );
   message.reply({ embeds: [embed]})
    }catch (err) {
        console.log(err);
	  	this.client.emit(error, message);
       }
    }
 }
