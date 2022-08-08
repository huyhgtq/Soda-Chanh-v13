const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Guild = require('../../database/schemas/Guild');
const User = require('../../database/schemas/User');
const Nickname = require('../../database/schemas/nicknames');

const Usernames = require('../../database/schemas/usernames');
const moment = require('moment');
const emojis = require('../../assets/emojis.json');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'userinfo',
        aliases: ['ui', 'user', 'whois'],
        description: 'Hiển thị thông tin về người dùng được cung cấp.',
        category: 'Information',
        usage: '[user]',
        examples: [ 'userinfo', 'userinfo 451699780423385089' ],
        guildOnly: true,
        cooldown: 3
      });
    }

    async run(message, args) {
      const client = message.client

            const guildDB = await Guild.findOne({
        guildId: message.guild.id
      });
    
      const language = require(`../../data/language/${guildDB.language}.json`)
  let member = message.mentions.members.last() || message.member;
 
     
     if(!member) {

      try {

       member = await message.guild.members.fetch(args[0])

     } catch {

member = message.member;

     }
        
        

       }

      
        let userFind = await User.findOne({
        discordId: member.id
      });
      
      if(!userFind){
              const newUser = new User({
              discordId: member.id
            })
  
            newUser.save()
             userFind = await User.findOne({
        discordId: member.id
      });

      }
let badge;
if(userFind && userFind.badges){
badge = userFind.badges.join(" ")
if(!badge || !badge.length) badge = `\`Không có\``
} else {
  badge = `\`Không có\``
}
  try {
   const mention = (await message.mentions.members.first()) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find((r) => r.user.username.toLowerCase().includes() === args.join(" ").toLocaleLowerCase()) || message.guild.members.cache.find((r) => r.displayName.toLowerCase().includes() === args.join(" ").toLocaleLowerCase()) || message.member;
   const user = await message.guild.members.fetch(mention.id);
   var flags = {
    "": "Không có!",
    DISCORD_EMPLOYEE: '<:blurpleemployee:964295442919718992>',
    DISCORD_PARTNER: '<:Partner:964297173682511962>',
    BUGHUNTER_LEVEL_1: '<:Bug_Hunter_1:964297411965124619>',
    BUGHUNTER_LEVEL_2: '<:Bug_Hunter_2:964297513899290644>',
    HYPESQUAD_EVENTS: '<:WumpusHypeSquad:964297999389962313>',
    HOUSE_BRILLIANCE: '<:hypesquad_brilliance:964298196299948062>',
    HOUSE_BRAVERY: '<:hypesquad_bravery:964298382128603216>',
    HOUSE_BALANCE: '<:hypesquad_balance:964298558851407882>',
    EARLY_SUPPORTER: '<:early_supporter:964298784400105502>',
    TEAM_USER: "Team User (?)",
    VERIFIED_BOT: `<:bot_badge_1:964299524262727690><:bot_badge_2:964299583498878996>`,
    EARLY_VERIFIED_DEVELOPER: '<:verified_bot_developer:964300273155735562>',
   };
   const embed = new MessageEmbed() // Prettier
    .setColor("RANDOM")
    .setAuthor(`${language.userinformation}`, user.user.displayAvatarURL())
    .setThumbnail(
     user.user.displayAvatarURL({
      dynamic: true,
      format: "png",
      size: 2048,
     })
    )
    .setTimestamp()
    .setFooter(
     `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
    );
   embed.addField(`<:member_role:964292126814900234> ID`, `> \`${user.user.id}\``, true);
   embed.addField(`<:Channel:964292621478531072> ${language.usertag}`, `> \`#${user.user.discriminator}\``, true);
   if (user.nickname) 
   embed.addField(`<:member_role:964292126814900234> ${language.nickname}`, `> \`${user.nickname}\``);
   embed.addField(`<:stopwatch:964300969414373466> ${language.joinedserver}`, `> <t:${parseInt(user.joinedTimestamp / 1000)}> (<t:${parseInt(user.joinedTimestamp / 1000)}:R>)`);
   embed.addField(`<:stopwatch:964300969414373466> ${language.accountcreated}`, `> <t:${parseInt(user.user.createdAt / 1000)}> (<t:${parseInt(user.user.createdAt / 1000)}:R>)`);
   embed.addField(`<:member_role:964292126814900234> ${language.highestrole}`, `> ${user.roles.highest}`, true);
   embed.addField(`<:Badge:964294685243875338> ${language.badges}`, `> ${flags[mention.user.flags.toArray().join(", ")]}`, true);
   embed.addField(`<:sodaa:963940635675623424> ${language.botBadges}`, `>  ${badge ||`\`**Không có**\``}`, true);
   embed.addField(`<:member_role:964292126814900234> ${language.accountbanned}`, `> ${user.deleted ? `${language.accountbanned2}` : `${language.accountbanned3}`}`);
   embed.setTitle(`${user.user.tag} ${user.user.bot ? `<:bot_badge_1:964299524262727690><:bot_badge_2:964299583498878996>` : ""}`);
	  message.reply({ embeds: [embed]})
  } catch (err) {
   console.log(err);
	this.client.emit(error, message);
  }
 }
};
