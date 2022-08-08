const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Guild = require('../../database/schemas/Guild');
const Command = require('../../structures/Command');
const { stripIndent } = require('common-tags');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'donate',
        aliases: [],
        description: 'Hãy quyên góp dự án giúp chúng tôi!',
        category: 'Information',
        cooldown: 3
      });
    }

    async run(message, args) {
	const client = message.client
    const guildDB = await Guild.findOne({ guildId: message.guild.id });
    const language = require(`../../data/language/${guildDB.language}.json`)
  try {
	const donate = stripIndent`
          Agribank     | ${'8209205274729 | NGUYEN XUAN HUY'}
    MB bank      | ${'0384398901 | NGUYEN XUAN HUY '}	  
    Momo         | ${'0384398901 | NGUYEN XUAN HUY'}
		  ViettelMoney | ${'9704229200947824487'}
		  Paypal       | ${'huyn9589@gmail.com'}
                      
        `;
   const embed = new MessageEmbed() // Prettier
    .setTitle(`<:starsright:968895572184543272> Donate to ${client.user.username}`) //
    .setTimestamp()
    .setThumbnail(
     client.user.displayAvatarURL({
      dynamic: true,
      format: "png",
      size: 2048,
     })
    )
    .setColor("RANDOM")
    .setFooter(
     `${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true })
    ) // Prettier
    .setDescription(`${client.config.patreon ? `• <:patreon:968897787058065538>  **Patreon:** https://patreon.com/huyhgtqhuyhgtq` + client.config.patreon : `<:patreon:968897787058065538>  **Patreon:** -`}
    ${client.config.ko_fi ? `• <:876452398934155264:968897785510387762> **Ko-Fi:** https://ko-fi.com/huyhgtq` + client.config.ko_fi : `<:876452398934155264:968897785510387762> **Ko-Fi:** -`}
    ${client.config.buymeacoffee ? `• <:878937137574211644:968897785619439686> **BuyMeaCoffee:** https://buymeacoffee.com/huyhgtq` + client.config.buymeacoffee : `<:878937137574211644:968897785619439686> **BuyMeaCoffee:** -`}
	${`**--NOTE--**`}
	${`Mình chỉ nhận qua duy nhất 1 stk: **0384398901 MB BANK Nguyen xuan huy**`}
	${`Lưu ý : không chuyển khoản cho bất kì tài khoản nào không có như trên để tránh nhưng tình huống không mong muốn`}
    `)
	.addField(`Ủng hộ mình để có tiền duy trì Bot / Server: `, `\`\`\`js\n${donate}\`\`\``)

   const row = new MessageActionRow();
    row.addComponents(
     new MessageButton() // Prettier
      .setURL(`https://patreon.com/huyhgtq`)
      .setEmoji('<:patreon:968897787058065538>')
      .setLabel("Patreon")
      .setStyle("LINK")
    );
    row.addComponents(
     new MessageButton() // Prettier
      .setURL(`https://ko-fi.com/huyhgtq`)
      .setEmoji('<:876452398934155264:968897785510387762>')
      .setLabel("Ko-Fi")
      .setStyle("LINK")
    );
    row.addComponents(
     new MessageButton() // Prettier
      .setURL(`https://buymeacoffee.com/huyhgtq`)
      .setEmoji('<:878937137574211644:968897785619439686>')
      .setLabel("Coffee")
      .setStyle("LINK")
    );
    row.addComponents(
     new MessageButton() // Prettier
      .setURL(`https://me.momo.vn/nguyenhuy`)
      .setEmoji('<:MoMo:968931359227785257>')
      .setLabel("MOMO")
      .setStyle("LINK")
    );

   message.reply({ embeds: [embed], components: [row] });
  } catch (err) {
   console.log(err);
   this.client.emit(error, message);
  }
 }
};
