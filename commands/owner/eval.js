const Command = require('../../structures/Command');
const util = require('util');
const { MessageEmbed } = require("discord.js");
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'eval',
        aliases: ['ev'],
        description: 'Điều này là dành cho các nhà phát triển.',
        category: 'Owner',
        usage: [ '<thing-to-eval>' ],
        ownerOnly: true
      });
    }

    async run(message, args) {
      const input = args.join(' ');
     try {
		  let output = eval(input);
        if (typeof output !== 'string') output = require('util').inspect(output, { depth: 0 });
      const code = args.join(" ");
      if (!code) {
        return message.reply("What do you want to evaluate?");
      }
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      let embed = new MessageEmbed()
        .setAuthor("Eval", message.author.avatarURL())
        .addField("Input", `\`\`\`js\n${code}\`\`\``)
        .addField("Output", `\`\`\`js\n${evaled}\`\`\``)
        .setColor("GREEN");

      message.reply({ embeds: [embed] });
    } catch (err) {
    console.log(err);
this.client.emit(error, message);
    }
  }
};
