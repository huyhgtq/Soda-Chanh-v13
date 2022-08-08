const Command = require('../../structures/Command');
const SlayBotDB = require('../../database/schemas/Pogy');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'setnews',
      description: 'Điều này dành cho các nhà phát triển.',
      category: 'Owner',
      usage: [ '<bản văn>' ],
      ownerOnly: true
    });
  }

  async run(message, args) {
    let news = args.join(' ').split('').join('') 
    if(!SlayBotDB.news) return  await SlayBotDB.create({ news: news, tag: '893953109334843422', time: new Date() }) + await SlayBotDB.updateOne({ news: news, tag: '893953109334843422', time: new Date()}) +  message.reply(' Tin tức cập nhật!')
    await SlayBotDB.updateOne({ news: news, tag: '893953109334843422', time: new Date() })
    message.reply(' Tin tức cập nhật!')
  }
};
