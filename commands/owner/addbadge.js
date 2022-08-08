const Command = require('../../structures/Command');
const User = require('../../database/schemas/User')
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'addbadge',
        aliases: [ 'ab' ],
        description: 'Thêm một huy hiệu nhất định cho người dùng.',
        category: 'Owner',
        ownerOnly: true
      });
    }

    async run(message, args) {

      const client = message.client;
		const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.slice(0).join(' ') || x.user.username === args[0]) || message.member;
      
      if(!user && !args[0]) return message.reply('Cung cấp cho tôi một người dùng.');
      

      const badge = args[1]
      if(!badge) return message.reply('Cung cấp cho tôi một huy hiệu');

      let userFind = await User.findOne({
        discordId: user.id
      });
      
      if(!userFind){
              const newUser = new User({
              discordId: message.author.id
            })
  
            newUser.save()
             userFind = await User.findOne({
        discordId: user.id
      });

      }

          if(userFind.badges.includes(badge)) return message.reply(`Anh ấy đã có huy hiệu đó rồi.`)

          userFind.badges.push(badge)
          await userFind.save().catch(()=>{})
          message.reply(`Thêm ${badge} Anh ấy đã có huy hiệu đó rồi! `)

    }
};

          function match(msg, i) {
          if (!msg) return undefined;
          if (!i) return undefined;
          let user = i.members.cache.find(
            m =>
              m.user.username.toLowerCase().startsWith(msg) ||
              m.user.username.toLowerCase() === msg ||
              m.user.username.toLowerCase().includes(msg) ||
              m.displayName.toLowerCase().startsWith(msg) ||
              m.displayName.toLowerCase() === msg ||
              m.displayName.toLowerCase().includes(msg)
          );
          if (!user) return undefined;
          return user.user;
        }