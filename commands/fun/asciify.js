const Command = require('../../structures/Command');
const figlet = require('util').promisify(require('figlet'));
const Guild = require('../../database/schemas/Guild');
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'asciify',
      aliases: [ 'bigtext', 'banner' ],
      description: 'Biến văn bản của bạn thành một tác phẩm nghệ thuật ASCII.',
      category: 'Fun',
      usage: '<text>',
      cooldown: 3
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id
  });


    const language = require(`../../data/language/${guildDB.language}.json`)
    
    if (args.length < 1) {
      return message.reply(`${message.client.emoji.fail} ${language.changeErrorValid}`)
    }

    return message.reply(await figlet(args), { code: true }).catch(() => {
      message.reply (`${language.bigError}`)
    });
  }

};