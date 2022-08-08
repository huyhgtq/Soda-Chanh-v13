const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const https = require("https");
const striptags = require("striptags");
const Guild = require('../../database/schemas/Guild');
const Command = require('../../structures/Command');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: '4chan',
        aliases: [ '4chan'],
        description: 'Hiển thị một hình ảnh ngẫu nhiên từ bảng 4chan đã chọn',
        category: 'Fun',
        cooldown: 3
      });
    }

    async run(message, args)  {
		  const client = message.client
    const guildDB = await Guild.findOne({ guildId: message.guild.id });
    const language = require(`../../data/language/${guildDB.language}.json`)
  try {
   if (!message.channel.nsfw) {
    const nsfwembed = new MessageEmbed() // Prettier
     .setColor("RED")
     .setDescription(`<:Pepe_Anger:968354902080368731> | You can use this command only in an NSFW Channel!`)
     .setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
     .setImage("https://media.discordapp.net/attachments/721019707607482409/855827123616481300/nsfw.gif");
    return message.reply({ embeds: [nsfwembed] });
   }
	
   const chanargs = args.slice(0).join(" ");
   const boards = ["3", "a", "aco", "adv", "an", "b", "bant", "biz", "c", "cgl", "ck", "cm", "co", "d", "diy", "e", "f", "fa", "fit", "g", "gd", "gif", "h", "hc", "his", "hm", "hr", "i", "ic", "int", "jp", "k", "lgbt", "lit", "m", "mlp", "mu", "n", "news", "o", "out", "p", "po", "pol", "pw", "qa", "qst", "r", "r9k", "s", "s4s", "sci", "soc", "sp", "t", "tg", "toy", "trash", "trv", "tv", "u", "v", "vg", "vip", "vm", "vmg", "vp", "vr", "vrpg", "vst", "vt", "w", "wg", "wsg", "wsr", "x", "xs", "y"];
   const board_error = new MessageEmbed() // Prettier
    .setTitle(`<:Pepe_Anger:968354902080368731> Please enter a vaild board!\n\n**Usage:** \`${client.prefix} 4chan <board>\``)
    .setColor("RED")
    .setDescription(`\`${boards.join("`, `")}\``);
   if (!chanargs) {
    return message.reply({ embeds: [board_error] });
   }
   if (boards.indexOf(chanargs) == -1) {
    return message.reply({ embeds: [board_error] });
   }
   const wait_embed = new MessageEmbed() // Prettier
    .setColor("5865f2")
    .setDescription(`<:loading_cat:968354902051020840> | I'm downloading random image from \`/${chanargs}/\`. Please wait...`);
   message.reply({ embeds: [wait_embed] }).then((process_message) => {
    var board = chanargs;
    var page = Math.floor(Math.random() * 10 + 1);
    var url = "https://a.4cdn.org/" + board + "/" + page + ".json";
    https.get(url, (res) => {
     res.setEncoding("utf8");
     let body = "";
     res.on("data", (data) => {
      body += data;
     });
     res.on("end", (end) => {
      body = JSON.parse(body);
      var postNr = Math.floor(Math.random() * body.threads.length);
      var imgId = body.threads[postNr].posts[0].tim;
      var imgExt = body.threads[postNr].posts[0].ext;
      var com = body.threads[postNr].posts[0].com;
      var sub = body.threads[postNr].posts[0].sub;
      var replies = body.threads[postNr].posts[0].replies;
      var images = body.threads[postNr].posts[0].images;
      if (!sub) {
       sub = "Random 4chan thread";
      }
      if (com == null) {
       com = "**No description!**";
      } else {
       com = striptags(com);
      }
      var thread = "https://boards.4chan.org/" + board + "/thread/";
      thread += body.threads[postNr].posts[0].no;
      var imgUrl = "https://i.4cdn.org/" + board + "/";
      imgUrl += imgId + "" + imgExt;
      let embed = new MessageEmbed() // Prettier
       .setColor("RANDOM")
       .setTitle(
        `🍀 ` + sub,
        message.guild.iconURL({
         dynamic: true,
         format: "png",
        }),
        thread
       )
       .setDescription(`>>> ${com}`)
       // .addField(`${client.bot_emojis.edit} Thread: `, thread)
       // .addField(`${client.bot_emojis.picture_frame} Image: `, imgUrl)
       .setURL(thread)
       .setTimestamp()
       .setFooter(
        `💬 ${replies} replies | 🖼 ${images} images | ${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }),
        message.author.displayAvatarURL({
         dynamic: true,
         format: "png",
         size: 2048,
        })
       );
      if (embed.description.length >= 2048) {
       embed.description = `${embed.description.substr(0, 2045)}...`;
      }
      const row = new MessageActionRow() // Prettier
       .addComponents(
        new MessageButton() // Prettier
         .setURL(thread)
         .setLabel("Board")
         .setStyle("LINK")
       )
       .addComponents(
        new MessageButton() // Prettier
         .setURL(imgUrl)
         .setLabel("Image")
         .setStyle("LINK")
       );
      process_message.edit({ embeds: [embed], files: [imgUrl], components: [row] });
     });
    });
   });
  } catch (err) {
   console.log(err);
   this.client.emit(error, message);
  }
 }
};
