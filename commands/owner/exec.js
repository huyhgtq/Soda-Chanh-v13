const Command = require('../../structures/Command');
const { exec } = require('child_process'); 

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'exec',
      aliases: ['execute'],
      description: 'Điều này là dành cho các nhà phát triển.',
      category: 'Owner',
      usage: [ '<thing-to-exec>' ],
      ownerOnly: true
    });
  }

  async run(message, args) {
    if (message.content.includes('config.json')) return message.reply('Vì lý do riêng tư, chúng tôi có thể\'t hiển thị tệp config.json.');

    if (args.length < 1) return message.reply('Bạn phải cung cấp cho tôi một số văn bản để thực hiện!')
    
    exec(args.join(' '), (error, stdout) => {
      const response = stdout || error;
      channel.send(response, { split: true, code: true });
    });
  }
};
