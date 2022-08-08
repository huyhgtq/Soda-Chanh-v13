const baucua = require('../../data/baucua.json');
const ms = require("ms")
const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');

function rditem() {
  const JworkR = baucua[Math.floor(Math.random() * baucua.length)];
  return JworkR
}
function wait(ms) {
  let start = new Date().getTime();
  let end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}
const { MessageEmbed } = require('discord.js')
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'baucua',
        aliases: [ 'bc' ],
        description: `ra con gì đây`,
        category: 'Game',
        cooldown: 3
      });
    }
 async run (message)  {  
    const emo = '<a:laclac:903592480702889994>'

    const i1 = rditem()
    const i2 = rditem()
    const i3 = rditem()

    const message1 = await message.reply(`<a:laclac:903592480702889994> **Bỏ cái tay lên để mở bát nè** <a:laclac:903592480702889994>`)
  
    await wait()
    const msg = await message.channel.send(` ${emo}  ${emo}  ${emo}`)
    await wait(3000)
    await msg.edit(` ${i1}  ${emo}  ${emo}`)
    await wait(3000)
    await msg.edit(` ${i1}  ${i2}  ${emo}`)
    await wait(4000)
    await msg.edit(` ${i1}  ${i2}  ${i3}`)
    //message.channel.send('')

  }

};

