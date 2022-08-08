const Command = require('../../structures/Command');
const rgx = /^(?:<@!?)?(\d+)>?$/;
const { MessageEmbed , createInvite } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'fetchinvite',
        aliases: ['finvite', 'finv'],
        description: 'Tìm nạp một lời mời!',
        category: 'Owner',
		disabled: true,
        ownerOnly: true
      });
    }

    async run(message, args) {
      
      const guildId = args[0];
    if (!rgx.test(guildId))
      return message.channel.send(`Cung cấp một máy chủ`)
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return message.channel.send(`ID máy chủ không hợp lệ`)
   
    const array = []
    var textChats = guild.channels.cache
        .find(ch => ch.type === 'text' && ch.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'))

    if(!textChats) message.channel.send(`Không có kênh`)
    
 await textChats.createInvite({
maxAge: 0, 
  maxUses: 0 
}).then(inv => {
  
  console.log(`${guild.name} | ${inv.url}`);
  message.channel.send(`${guild.name} | ${inv.url}`);
})
.catch(err => {
    message.channel.send("Không có sự cho phép");
});











}
};
