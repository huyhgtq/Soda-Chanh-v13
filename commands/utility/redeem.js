const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const Premium = require('../../database/schemas/GuildPremium');
const moment = require("moment");
const config = require('../../config.json');
const Discord = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const webhookClient = new Discord.WebhookClient({ 
id: `${config.webhook_id}`,
token: `${config.webhook_url}`});

let uniqid = require('uniqid');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'redeem',
        description: `Đổi mã Premium!`,
        category: 'Utility',
        cooldown: 3,
        userPermission: ["MANAGE_GUILD"]
      });
    }

    async run(message, args) {
     const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
    
      const language = require(`../../data/language/${guildDB.language}.json`)
      
   let code = args[0]

    if(!code) return message.reply({ embeds: [new Discord.MessageEmbed().setColor('RED').setDescription(`${message.client.emoji.fail} Vui lòng chỉ định mã để đổi`)]})
    
    if(guildDB.isPremium === "true") {

      return message.reply({ embeds: [new Discord.MessageEmbed().setColor('RED').setDescription(`${message.client.emoji.fail} máy chủ hiện tại đã là cao cấp`)]})
    }

    const premium = await Premium.findOne({
      code: code
    })

    if(premium){

const expires = moment(Number(premium.expiresAt)).format("MM-DD-YYYY")


    guildDB.isPremium = "true";
    guildDB.premium.redeemedBy.id = message.author.id;
    guildDB.premium.redeemedBy.tag = message.author.tag;
    guildDB.premium.redeemedAt = Date.now()
    guildDB.premium.expiresAt = premium.expiresAt;
    guildDB.premium.plan = premium.plan;

    await guildDB.save().catch(()=>{});

    await premium.deleteOne().catch(()=>{});

let ID = uniqid(undefined, `-${code}`);
const date = require('date-and-time');
const now = new Date();
let DDate = date.format(now, 'MM-DD-YYYY');  

    try {
	const row = new MessageActionRow()
          .addComponents(
              new MessageButton()
              .setLabel('liên hệ với tôi')
              .setURL(`https://discord.gg/2mHgQQz3GN`)
              .setStyle('LINK')
              .setEmoji('🔗')
          )
await message.reply({ embeds: [new Discord.MessageEmbed()
    .setDescription(`**Đăng ký Premium**\n\nGần đây, bạn đã đổi một mã trong **${message.guild.name}** và đây là biên lai của bạn:\n\n **ID biên nhận:** ${ID}\n**Đổi vào ngày:** ${DDate}\n**Tên máy chủ:** ${message.guild.name}\n**ID máy chủ:** ${message.guild.id}`)
      .setColor(message.guild.me.displayHexColor)
      .setFooter(message.guild.name)]})
    } catch (err){
console.log(err)
 message.reply({ embeds: [new Discord.MessageEmbed()
						  .setDescription(`**Xin chúc mừng!**\n\n**${message.guild.name}** Bây giờ là một máy chủ Premium! Cảm ơn rất nhiều!\n\nNếu bạn có bất kỳ câu hỏi \n\n**Không thể gửi Biên nhận của bạn qua dms nên đây là:**\n**ID biên nhận:** ${ID}\n**Đổi vào ngày:** ${DDate}\n**Tên máy chủ:** ${message.guild.name}\n**ID máy chủ:** ${message.guild.id}\n\n**Hãy đảm bảo giữ thông tin này an toàn, bạn có thể cần thông tin này nếu bạn muốn hoàn lại tiền / chuyển máy chủ.**\n\n**Hết hạn vào:** ${expires}`)
						  .setColor(message.guild.me.displayHexColor)
						  .setFooter(message.guild.name)], components: [row]});
     
      return;
    }
   
	const row2 = new MessageActionRow()
          .addComponents(
              new MessageButton()
              .setLabel('liên hệ với tôi')
              .setURL(`https://discord.gg/2mHgQQz3GN`)
              .setStyle('LINK')
              .setEmoji('🔗')
          )
    message.reply({ embeds: [new Discord.MessageEmbed()
			.setDescription(`**Xin chúc mừng!**\n\n**${message.guild.name}** Bây giờ là một máy chủ Premium! Cảm ơn rất nhiều!\n\nNếu bạn có bất kỳ câu hỏi, \n**biên lai của bạn đã được gửi qua dms**\n\n**Hết hạn vào:** ${expires}`)
							 .setColor(message.guild.me.displayHexColor)
							 .setFooter(message.guild.name)], components: [row2]});

const embedPremium = new Discord.MessageEmbed()
      .setDescription(`**Đăng ký Premium**\n\n**${message.author.tag}** Đã đổi mã trong **${message.guild.name}**\n\n **ID biên nhận:** ${ID}\n**Đổi vào ngày:** ${DDate}\n**Tên máy chủ:** ${message.guild.name}\n**ID máy chủ:** ${message.guild.id}\n**Thẻ đổi quà:** ${message.author.tag}\n**ID người đổi:** ${message.author.id}\n\n**Hết hạn vào:** ${expires}`)
      .setColor(message.guild.me.displayHexColor)

webhookClient.send({
        username: 'Soda Chan Premium',
        avatarURL: `${message.client.domain}/logo.png`,
        embeds: [embedPremium],
      });

    } else {
        return message.reply({ embeds: [new Discord.MessageEmbed().setColor('RED').setDescription(`${message.client.emoji.fail} Tôi không thể mã sau.`)]})
    }

    }
};
