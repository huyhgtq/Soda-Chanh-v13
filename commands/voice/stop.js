const { developers } = require('../../config.json');
const voice = require('@discordjs/voice')
const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const db = require('quick.db');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'stop',
        aliases: ['pause', 'stop'],
        description: 'cho Soda đi ngủ',
        category: 'Voice',
        usage: [ '<PREFIX>stop' ],
        cooldown: 3
      });
    }

    async run(message, args)  {
		const client = message.client
    const guildDB = await Guild.findOne({ guildId: message.guild.id });
    const language = require(`../../data/language/${guildDB.language}.json`)
	   if(!message.member.voice.channel) return message.reply('Bạn phải chung room với Soda cơ mới có thể dùng lệnh');
       const connection = voice.joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        })
		
        if(!connection) return message.reply({embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription('Soda không ở trong phòng nào!')
        ]})
        const stopEmbed = new MessageEmbed()
            .setColor ('RED')
            .setTitle(`Đã ngắt kết nối...`)
            .setDescription(`**Soda đi ngủ đây gặp lại sau!**`)
        await connection.destroy(true);
        await message.reply({ embeds: [stopEmbed]});
    }
}