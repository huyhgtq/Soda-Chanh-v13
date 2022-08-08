const ms = require("ms")
const so = require('../../data/so.json');
const { MessageEmbed } = require('discord.js')
const diceUtils = require('dice-utils');
const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const { roll } = diceUtils;
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'taixiu',
        aliases: [ 'tx' ],
        description: `tài xỉu nàoo`,
        category: 'Game',
        cooldown: 3
      });
    }
 async run (message)  {
    const dice = roll('3d6');
    const result = dice.results;
    const total = dice.total;

    const emo = '<a:laclacnao:903596713581875221>'

    const map = {
      '1': '<:1_:903596713221189652>',
      '2': '<:877242325028438068:903596712910802964>',
      '3': '<:877242324680343583:903596712868851803>',
      '4': '<:877242324705509476:903596713007271946>',
      '5': '<:6_:903596712688484413>',
      '6': '<:4_:903596712910798868> '
        }

    const message1 = await message.channel.send(`**<a:896604708255436810:903599040917299222> Bỏ cái tay bỏ cái tay để mở bát nào...<a:896604708255436810:903599040917299222>**`)
        if (result[0] == result[1] == result[2], total == 3, total == 18) {

          let msg = await message.reply(` ${emo}  ${emo}  ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${emo} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${map[result[2]]}`)
            
            message.reply(`**__Kết Quả :__\n${total}**`)
            
          

          
        }

        if (total == 18) {
    let msg = await message.channel.send(` ${emo}  ${emo}  ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${emo} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${map[result[2]]}`)
            
            message.channel.send(`**__Kết Quả :__\n${total} • Chẵn • Tài**`)
    
        }


        if (total == 3) {
    let msg = await message.channel.send(` ${emo}  ${emo}  ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${emo} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${map[result[2]]}`)
            
            message.channel.send(`**__Kết Quả :__\n${total} • Lẻ • Xỉu**`)
   
        }

        if (total <= 4) {
     let msg = await message.channel.send(` ${emo}  ${emo}  ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${emo} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${map[result[2]]}`)
            
            message.channel.send(`**__Kết Quả :__\n${total} • Chẵn • Xỉu**`)   
}
      if (total == 5) {
    let msg = await message.channel.send(` ${emo}  ${emo}  ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${emo} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${map[result[2]]}`)
            
            message.channel.send(`**__Kết Quả :__\n${total} • Lẻ • Xỉu**`)
   
          }
     if (total == 6) {
    let msg = await message.channel.send(` ${emo}  ${emo}  ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${emo} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${map[result[2]]}`)
            
            message.channel.send(`**__Kết Quả :__\n${total} • Chẵn • Xỉu**`)
   
      }
  if (total == 7) {
    let msg = await message.channel.send(` ${emo}  ${emo}  ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${emo} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${map[result[2]]}`)
            
            message.channel.send(`**__Kết Quả :__\n${total} • Lẻ • Xỉu**`)
   
      }
   if (total == 8) {
    let msg = await message.channel.send(` ${emo}  ${emo}  ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${emo} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${map[result[2]]}`)
            
            message.channel.send(`**__Kết Quả :__\n${total} • Chẵn • Xỉu**`)
   
      }
  if (total == 9) {
    let msg = await message.channel.send(` ${emo}  ${emo}  ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${emo} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${map[result[2]]}`)
            
            message.channel.send(`**__Kết Quả :__\n${total} • Lẻ • Xỉu**`)
   
      }
   if (total == 10) {
    let msg = await message.channel.send(` ${emo}  ${emo}  ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${emo} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${map[result[2]]}`)
            
            message.channel.send(`**__Kết Quả :__\n${total} • Chẵn • Xỉu**`)
   
      }
    if (total == 11) {
    let msg = await message.channel.send(` ${emo}  ${emo}  ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${emo} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${map[result[2]]}`)
            
            message.channel.send(`**__Kết Quả :__\n${total} • Lẻ • Tài**`)
   
      }
    if (total == 12) {
    let msg = await message.channel.send(` ${emo}  ${emo}  ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${emo} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${map[result[2]]}`)
            
            message.channel.send(`**__Kết Quả :__\n${total} • Chẵn • Tài**`)
   
      }
    if (total == 13) {
    let msg = await message.channel.send(` ${emo}  ${emo}  ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${emo} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${map[result[2]]}`)
            
            message.channel.send(`**__Kết Quả :__\n${total} • Lẻ • Tài**`)
   
      }
 if (total == 14) {
    let msg = await message.channel.send(` ${emo}  ${emo}  ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${emo} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${map[result[2]]}`)
            
            message.channel.send(`**__Kết Quả :__\n${total} • Chẵn • Tài**`)
   
      }
  if (total == 15) {
    let msg = await message.channel.send(` ${emo}  ${emo}  ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${emo} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${map[result[2]]}`)
            
            message.channel.send(`**__Kết Quả :__\n${total} • Lẻ • Tài**`)
   
      }
    if (total == 16) {
    let msg = await message.channel.send(` ${emo}  ${emo}  ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${emo} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${map[result[2]]}`)
            
            message.channel.send(`**__Kết Quả :__\n${total} • Chẵn • Tài**`)
   
      }
    if (total == 17) {
    let msg = await message.channel.send(` ${emo}  ${emo}  ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${emo} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${emo}`)
    await wait(2000)
    await msg.edit(` ${map[result[0]]} ${map[result[1]]} ${map[result[2]]}`)
            
            message.channel.send(`**__Kết Quả :__\n${total} • Lẻ • Tài**`)
   
         }

       



  }
}
function wait(ms) {
  let start = new Date().getTime();
  let end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
      } 
