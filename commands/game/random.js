const Discord = require("discord.js");
const {MessageEmbed} =require('discord.js');
const db = require("quick.db");
const ms = require("parse-ms");
const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');

  function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
const random = require('random-number-csprng');

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'random',
        aliases: [ 'rd' ],
        description: `Ra số ngẫu nhiên`,
        category: 'Game',
        cooldown: 3
      });
    }
 async run (message, args)  {
        let number = args[0] || 1000000000
            let so = await random(1, number)

    if (number === 2) return message.channel.send('<:cross:879611212097290240> Vui lòng nhập một số')
    if (!number) return message.channel.send(`<:littlestart1:885766628975988766> **${message.author.username}**, con số của bạn là: __**${formatNumber(so)}**__ `)
    if (number < 0) return message.channel.send('<:cross:879611212097290240> Vui lòng nhập một số nguyên dương')
    if (number > 999999999999999999999999999999) return message.channel.send('<:cross:879611212097290240> Số Không Giới hạn')

    message.reply(`<a:902372129796935701:903357810039996416> **__${message.author.username}__**, Số lần may mắn của bạn là : __**${formatNumber(so)}**__ <a:902372129796935701:903357810039996416>`)
    }}
