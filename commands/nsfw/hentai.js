const Guild = require('../../database/schemas/Guild');
const Command = require('../../structures/Command');
const fetch = require('node-fetch');
const got = require("got");
const {MessageEmbed} =require('discord.js');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'hentai',
        description: 'Trả về một hình ảnh / gif hentai ngẫu nhiên',
        category: 'NSFW',
        nsfwOnly: true
      });
    }

    async run(message, args){
    const client = message.client
    const guildDB = await Guild.findOne({ guildId: message.guild.id });
    const language = require(`../../data/language/${guildDB.language}.json`)

    try {
      var errMessage = "This is not an NSFW Channel";
      if (!message.channel.nsfw) {
     const nsfwembed = new MessageEmbed()
      .setColor("RED")
      .setDescription(`<:Pepe_Anger:968354902080368731> | You can use this command only in an NSFW Channel!`)
      .setFooter(
       `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
      )
      .setImage("https://media.discordapp.net/attachments/721019707607482409/855827123616481300/nsfw.gif");
     return message.reply({ embeds: [nsfwembed] });
    }
      got("https://www.reddit.com/r/hentai/random.json")
        .then((response) => {
          let content = JSON.parse(response.body);
          var title = content[0].data.children[0].data.title;
          var amazeme = content[0].data.children[0].data.url;
          let wow = new MessageEmbed()
            .setDescription(`**` + title + `**`)
            .setImage(amazeme)
            .setFooter(`Credits to r/hentai`)
            .setColor("RANDOM");
          message.channel.send({ embeds: [wow] });
        })
        .catch(console.error);
    } catch (err) {
    console.log(err);
this.client.emit(error, message);
    }
  }
};
