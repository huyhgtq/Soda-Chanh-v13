const Command = require('../../structures/Command');
const RandomUser = require('../../database/schemas/random');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'addrandom',
        aliases: [ 'ar' ],
        description: 'Thêm một random nhất định cho người dùng.',
        category: 'Owner',
        ownerOnly: true
      });
    }

    async run(message, args) {

      const client = message.client;

      let user = message.mentions.users.first() || client.users.cache.get(args[0]) || match(args.join(" ").toLowerCase(), message.guild) || message.author;

      if(!user) return message.channel.send('Cung cấp cho tôi một người dùng.');
      

      const randoms = args[1]
      if(!randoms) return message.channel.send('Cung cấp cho tôi một huy hiệu');

      let userFind = await RandomUser.findOne({
        discordId: user.id
      });
      
      if(!userFind){
              const newUser = new RandomUser({
              discordId: message.author.id
            })
  
            newUser.save()
             userFind = await RandomUser.findOne({
        discordId: user.id
      });

      }

          if(userFind.randoms.includes(randoms)) return message.channel.send(`Anh ấy đã có huy hiệu đó rồi.`)

          userFind.randoms.push(randoms)
          await userFind.save().catch(()=>{})
          message.channel.send(`Thêm ${randoms} Anh ấy đã có huy hiệu đó rồi! `)

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