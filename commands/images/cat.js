const Command = require('../../structures/Command');
const request = require('request-promise-native');
const fetch = require('node-fetch');
const Guild = require('../../database/schemas/Guild');
const config = require('../../config.json');
const discord = require('discord.js');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'cat',
        description: 'Nhận một hình ảnh con mèo!',
        category: 'Images',
        cooldown: 5
      });
    }

    async run(message, args) {

      const client = message.client;
      const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
    
  
      const language = require(`../../data/language/${guildDB.language}.json`)
      const apiKey = config.cat_api_key;
        try {
          const res = await fetch('https://api.thecatapi.com/v1/images/search', { headers: { 'x-api-key': apiKey }});
          const img = (await res.json())[0].url;
          const embed = new discord.MessageEmbed()
            .setImage(img)
            .setFooter(`/api.thecatapi.com/v1/images/search`)
            .setTimestamp()
            .setColor(client.color.blue)
			.setFooter(
      `${language.requested} ${message.author.username}` + " • (Aww cute =＾´• ⋏ •`＾=)", message.author.displayAvatarURL({ dynamic: true })
      )
          message.reply({ embeds: [embed]});
        } catch (err) {
         console.log(`${err}, command name: cat`)
         message.channel.send(language.catError)
        }

        }}    
