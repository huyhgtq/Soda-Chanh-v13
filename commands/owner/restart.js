const Command = require('../../structures/Command');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'restart',
        aliases: [ 'reboot' ],
        description: 'Khởi động lại bot!',
        category: 'Owner',
        ownerOnly: true
      });
    }

    async run(message) {
      await message.reply("Đang khởi động lại!").catch(err => this.client.console.error(err));
      process.exit(1)
    }
};
