const { getAudioUrl } = require('google-tts-api');
const voice = require('@discordjs/voice')
const { VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'speak',
        aliases: ['say', 's'],
        description: 'đọc tin nhắn của bạn trên kênh voice',
        category: 'Voice',
        usage: [ '<PREFIX>speak [lang] <text>' ],
        cooldown: 3
      });
    }

    async run(message, args)  {
		const client = message.client
        const guildID = message.guild.id;
          if (!args[0]) return message.channel.send('Vui lòng nhập gì đó để Soda nói!');
        const string = args.join(' ');
        if (string.length > 200) return message.channel.send('Vui lòng nhập dưới 200 kí tự!');

        if(!message.member.voice.channel) return message.reply('Bạn phải vào room voice để sử dụng lệnh này!');
        const audioURL = await getAudioUrl(string, {
            lang: 'vi',
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000,
        });

        const connection = voice.joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        })
        //create source
        const resource = voice.createAudioResource(audioURL)
        const player = voice.createAudioPlayer()
        try {
            //tạo âm thanh
            player.play(resource)
            connection.subscribe(player)
            
            
            
            //check nếu play xong thì out voice
            player.on(voice.AudioPlayerStatus.Idle, () => {
                // out kênh thoại
                //connection.destroy()
            })
        } catch(e) {
            message.channel.send('Bot lỗi, vui lòng thử lại sau!');
            console.error(e);
        };
        const msg = await message.channel.send('Đang chuyển chữ thành âm thanh...');

        setTimeout(() => msg.delete(), 5000);
    }
};





const { getAudioUrl } = require('google-tts-api');
const voice = require('@discordjs/voice')
const { VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const textToSpeech = require('@google-cloud/text-to-speech');
const streamBuffers = require('stream-buffers');
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'speak',
        aliases: ['say', 's'],
        description: 'đọc tin nhắn của bạn trên kênh voice',
        category: 'Voice',
        usage: [ '<PREFIX>speak <text>' ],
        cooldown: 3
      });
    }

    async run(message, args)  {
		const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message.reply('Bạn cần tham gia một kênh thoại để làm điều này!');
        }

        const client = new textToSpeech.TextToSpeechClient();
	            // The text to synthesize
            const text = args.join(' ');
            // check that the text is no more than 5000 characters
            if (text.length > 5000) {
                return message.reply('Văn bản của bạn quá dài rồi Soda không thể đọc! (tối đa 5000 ký tự)');
            }
            // Construct the request
            const request = {
                input: {text: text},
                // Select the language and SSML voice gender (optional)
                voice: {languageCode: 'vi-VN', name: 'vi-VN-Wavenet-C', "ssmlGender":"FEMALE"},
                // select the type of audio encoding
                audioConfig: {audioEncoding: 'LINEAR16'},
            };
            // Performs the text-to-speech request
            const [response] = await client.synthesizeSpeech(request);

            // Write the binary audio content to a local file
            // const writeFile = util.promisify(fs.writeFile);
            // await writeFile(`${__dirname}/output.ogg`, response.audioContent, 'binary');

            // creating a readableStream directly from the buffer
            const voiceReadStream = new streamBuffers.ReadableStreamBuffer({
                frequency: 1,
                chunkSize: 1024,
            });
            voiceReadStream.put(response.audioContent);

            const connection = await voiceChannel.join();
            const dispatcher = connection.play(voiceReadStream, {type: 'ogg/opus'});
            // const dispatcher = connection.play(fs.createReadStream(`${__dirname}/output.ogg`), {type: 'ogg/opus'});
           
                } catch (err) {
   console.log(err);
	this.client.emit(error, message);
  }
}