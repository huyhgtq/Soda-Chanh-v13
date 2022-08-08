const Command = require('../../structures/Command');
const fetch = require('node-fetch');
const Guild = require('../../database/schemas/Guild');
const { MessageEmbed } = require('discord.js');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'birdfact',
        aliases: [ 'birdfacts', 'bf' ],
        description: 'Tạo ra một dữ kiện ngẫu nhiên về loài chim vô dụng',
        category: 'Fun',
        cooldown: 3
      });
    }

    async run(message) {
      const data = await fetch("https://some-random-api.ml/facts/bird").then(res => res.json()).catch(()=>{})

      if (!data) return message.reply(`The API is currently down, come back later!`)
    
      const { fact } = data

      message.reply({ embeds: [ new MessageEmbed()

.setColor(message.client.color.blue)
.setDescription(`${fact}`)
         .setFooter("/some-random-api/bird") 
      ]})
    }
};