const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Command = require('../../structures/Command');
const Guild = require('../../database/schemas/Guild');
const discord = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');
const emojis = require('../../assets/emojis.json');
const domain = require("../../config.js");

module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'help',
        aliases: ['menu', 'bothelp', 'commands'],
        description: 'Hiển thị cho bạn mọi lệnh có sẵn trong máy chủ',
        category: 'Information',
        usage: '[command]',
        examples: [ 'help userinfo', 'help avatar' ],
        cooldown: 3
      });
    }

    async run(message, args) {


    const guildDB = await Guild.findOne({ guildId: message.guild.id });

    let disabledCommands = guildDB.disabledCommands;
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    const prefix = guildDB.prefix;

    const language = require(`../../data/language/${guildDB.language}.json`)
  

      const emoji = {
        altdetector: `${emojis.altdetector}`,
        applications: `${emojis.applications}`,
        config: `${emojis.config}`,
        utility: `${emojis.utility}`,
        economy: `${emojis.economy}`,
        fun: `${emojis.fun}`,
        images: `${emojis.images}`,
        information: `${emojis.information}`,
        moderation: `${emojis.moderation}`,
        nsfw: `${emojis.nsfw}`,
        reactionrole: `${emojis.reactionrole}`,
        tickets: `${emojis.tickets}`,
        owner: `${emojis.owner}`,
        game: `${emojis.game}`,
		voice: `${emojis.voice}`,
		activities: `${emojis.activities}`,
		random: `${emojis.random}`
      };
     
      const green = '<:2311Online:897806949737979954>';
      const red = '<:2311offline:897806790866141194>';

      const settings = await Guild.findOne({
        guildId: message.guild.id,
      });
	 const random = new MessageActionRow()
          .addComponents(
              new MessageButton()
              .setLabel("Buy ramdom")
      		  .setStyle("LINK")
              .setURL(`https://discord.gg/2mHgQQz3GN`)
          )
      const embed = new MessageEmbed()
        .setColor('#33FFCC')


      if (!args || args.length < 1) {

        let categories;
       categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd.category));


        if(this.client.config.developers.includes(message.author.id)) categories = this.client.utils.removeDuplicates(this.client.commands.map(cmd => cmd.category));


        for (const category of categories) {
          embed.addField(`${emoji[category.split(" ").join("").toLowerCase()]} **${capitalize(category)}**`, `\`${prefix}help ${category.toLowerCase()}\``, true)
        }
        embed.setTitle(`Soda Chan's Command List`)
        embed.setDescription(stripIndent`
        <:2311Online:897806949737979954> ${language.prefix} \`${prefix}\`
  
        `);


        embed.setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()


embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
        return message.reply({ embeds: [embed] })
     

      } else if(args && args.join(" ").toLowerCase() == "alt detector"  || args && args[0].toLowerCase() == "alt"){

        embed.setTitle(` ${emojis.altdetector} - Alt Detector`)
        embed.setDescription(this.client.commands.filter(cmd => 
            cmd.category.toLowerCase() === "alt detector").map(cmd => `${cmd.disabled || disabledCommands.includes(cmd.name || cmd) ? red : green} \`${cmd.name} ${" ".repeat(9 - Number(cmd.name.length))}:\` ${cmd.description}`).join("\n"));

        embed.setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()
        embed.addField(
          `\u200b`, 
          `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
          `[Support Server](${domain.support_server_link}) | ` +
          `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
        return message.reply({ embeds: [embed] })

      } else if(args && args[0].toLowerCase() == "owner"){

        if(!this.client.config.developers.includes(message.author.id)) return message.channel.send(`${message.client.emoji.fail} | Bạn không được phép xem danh mục này`)



        embed.setTitle(`${emojis.owner} Owner Commands`)
        embed.setDescription(this.client.commands.filter(cmd => 
            cmd.category.toLowerCase() === "owner").map(cmd => `${cmd.disabled || disabledCommands.includes(cmd.name || cmd) ? red : green} \`${cmd.name} ${" ".repeat(11 - Number(cmd.name.length))}:\` ${cmd.description}`).join("\n"));

        embed.setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()
        embed.addField(
          `\u200b`, 
          `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
          `[Support Server](${domain.support_server_link}) | ` +
          `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
        return message.reply({ embeds: [embed] })

      } else if(args && args[0].toLowerCase() == "applications"  || args && args[0].toLowerCase() == "apps"){

        embed.setTitle(` ${emojis.applications} - applications`)
        embed.setDescription(this.client.commands.filter(cmd => 
      
            cmd.category.toLowerCase() === "applications").map(cmd => `${cmd.disabled || disabledCommands.includes(cmd.name || cmd) ? red : green} \`${cmd.name} ${" ".repeat(11 - Number(cmd.name.length))}:\` ${cmd.description}`).join("\n"));

        embed.setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()

embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
      
        return message.reply({ embeds: [embed] })

      
        } else if(args && args[0].toLowerCase() == "config"  || args && args[0].toLowerCase() == "configuration"){

        embed.setTitle(` ${emojis.config} - Config`)
        embed.setDescription(this.client.commands.filter(cmd => 
      
            cmd.category.toLowerCase() === "config").map(cmd => `${cmd.disabled || disabledCommands.includes(cmd.name || cmd) ? red : green} \`${cmd.name} ${" ".repeat(14 - Number(cmd.name.length))}:\` ${cmd.description}`).join("\n"));

        embed.setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()
embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
        return message.reply({ embeds: [embed] })

      } else if(args && args[0].toLowerCase() == "utility"  || args && args[0].toLowerCase() == "utils"){

        embed.setTitle(` ${emojis.utility} - Utility`)
        embed.setDescription(this.client.commands.filter(cmd => 
      
            cmd.category.toLowerCase() === "utility").map(cmd => `${cmd.disabled || disabledCommands.includes(cmd.name || cmd) ? red : green} \`${cmd.name} ${" ".repeat(10 - Number(cmd.name.length))}:\` ${cmd.description}`).join("\n"));

        embed.setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()
embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
        return message.reply({ embeds: [embed] })

      
      } else if(args && args[0].toLowerCase() == "economy"  || args && args[0].toLowerCase() == "currency"){

        embed.setTitle(` ${emojis.economy} - Economy`)
        embed.setDescription(this.client.commands.filter(cmd => 
      
            cmd.category.toLowerCase() === "economy").map(cmd => `${cmd.disabled || disabledCommands.includes(cmd.name || cmd) ? red : green} \`${cmd.name} ${" ".repeat(9 - Number(cmd.name.length))}:\` ${cmd.description}`).join("\n"));

        embed.setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()
embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
        return message.reply({ embeds: [embed] })

      
        } else if(args && args[0].toLowerCase() == "fun"){

        embed.setTitle(` ${emojis.fun} - Fun`)
        embed.setDescription(this.client.commands.filter(cmd => 
      
            cmd.category.toLowerCase() === "fun").map(cmd => `${cmd.disabled || disabledCommands.includes(cmd.name || cmd) ? red : green} \`${cmd.name} ${" ".repeat(10 - Number(cmd.name.length))}:\` ${cmd.description}`).join("\n"));

        embed.setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()
embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
        return message.reply({ embeds: [embed] })

      
        } else if(args && args[0].toLowerCase() == "images"  || args && args[0].toLowerCase() == "image"){

        embed.setTitle(` ${emojis.images} - Image`)
        embed.setDescription(this.client.commands.filter(cmd => 
      
            cmd.category.toLowerCase() === "images").map(cmd => `${cmd.disabled || disabledCommands.includes(cmd.name || cmd) ? red : green} \`${cmd.name} ${" ".repeat(14 - Number(cmd.name.length))}:\` ${cmd.description}`).join("\n"));

        embed.setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()
embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
        return message.reply({ embeds: [embed] })

      
      } else if(args && args[0].toLowerCase() == "information"  || args && args[0].toLowerCase() == "info"){

        embed.setTitle(` ${emojis.information} - Info`)
              embed.setDescription(this.client.commands.filter(cmd => 
            cmd.category.toLowerCase() === "information").map(cmd => `${cmd.disabled || disabledCommands.includes(cmd.name || cmd) ? red : green} \`${cmd.name} ${" ".repeat(11 - Number(cmd.name.length))}:\` ${cmd.description}`).join("\n"));

        embed.setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()

        embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );

        return message.reply({ embeds: [embed] })

        }  else if(args && args[0].toLowerCase() == "game"  || args && args[0].toLowerCase() == "game"){

        embed.setTitle(` ${emojis.game} - Game`)
        embed.setDescription(this.client.commands.filter(cmd => 
      
            cmd.category.toLowerCase() === "game").map(cmd => `${cmd.disabled || disabledCommands.includes(cmd.name || cmd) ? red : green} \`${cmd.name} ${" ".repeat(14 - Number(cmd.name.length))}:\` ${cmd.description}`).join("\n"));

        embed.setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()

        embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
        return message.reply({ embeds: [embed] })

        embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
        return message.reply({ embeds: [embed] })

        }  else if(args && args[0].toLowerCase() == "moderation"  || args && args[0].toLowerCase() == "mod"){

        embed.setTitle(` ${emojis.moderation} - Moderation`)
            embed.setDescription(this.client.commands.filter(cmd => 
            cmd.category.toLowerCase() === "moderation").map(cmd => `${cmd.disabled || disabledCommands.includes(cmd.name || cmd) ? red : green} \`${cmd.name} ${" ".repeat(11 - Number(cmd.name.length))}:\` ${cmd.description}`).join("\n"));
        embed.setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()
embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
        return message.reply({ embeds: [embed] })

      	
        } else if(args && args[0].toLowerCase() == "random"  || args && args[0].toLowerCase() == "random"){

        embed.setTitle(` ${emojis.random} - Random`)
        embed.setDescription(this.client.commands.filter(cmd => 
      
            cmd.category.toLowerCase() === "random").map(cmd => `${cmd.disabled || disabledCommands.includes(cmd.name || cmd) ? red : green} \`${cmd.name} ${" ".repeat(14 - Number(cmd.name.length))}:\` ${cmd.description}`).join("\n"));

        embed.setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()

        embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
        return message.reply({ embeds: [embed], components: [random] })

        embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
        return message.reply({ embeds: [embed], components: [random]})

        } else if(args && args[0].toLowerCase() == "voice"  || args && args[0].toLowerCase() == "voice"){

        embed.setTitle(` ${emojis.voice} - voice`)
        embed.setDescription(this.client.commands.filter(cmd => 
      
            cmd.category.toLowerCase() === "voice").map(cmd => `${cmd.disabled || disabledCommands.includes(cmd.name || cmd) ? red : green} \`${cmd.name} ${" ".repeat(14 - Number(cmd.name.length))}:\` ${cmd.description}`).join("\n"));

        embed.setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()

        embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
        return message.reply({ embeds: [embed] })

        embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
        return message.reply({ embeds: [embed] })

        }
	  else if(args && args[0].toLowerCase() == "activities"  || args && args[0].toLowerCase() == "activities"){

        embed.setTitle(` ${emojis.activities} - activities`)
        embed.setDescription(this.client.commands.filter(cmd => 
      
            cmd.category.toLowerCase() === "activities").map(cmd => `${cmd.disabled || disabledCommands.includes(cmd.name || cmd) ? red : green} \`${cmd.name} ${" ".repeat(14 - Number(cmd.name.length))}:\` ${cmd.description}`).join("\n"));

        embed.setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()

        embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
        return message.reply({ embeds: [embed] })

        embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
        return message.reply({ embeds: [embed] })

        }else if(args && args[0].toLowerCase() == "nsfw"){


        embed.setTitle(` ${emojis.nsfw} - NSFW`)
            embed.setDescription(this.client.commands.filter(cmd => 
            cmd.category.toLowerCase() === "nsfw").map(cmd => `${cmd.disabled || disabledCommands.includes(cmd.name || cmd) ? red : green} \`${cmd.name} ${" ".repeat(20 - Number(cmd.name.length))}:\` ${cmd.description}`).join("\n"));

        embed.setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()
embed.addField(
        '\u200b', 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
      if(!message.channel.nsfw) embed.setDescription(`${language.nsfwchannels}`)
        return message.reply({ embeds: [embed] })

      } else if(args && args.slice(0).join(" ").toLowerCase() == "reaction role" || args && args[0].toLowerCase() == "rr"){

        embed.setTitle(` ${emojis.reactionrole} - Reaction Roles`)
        embed.setDescription(this.client.commands.filter(cmd => 
      
            cmd.category.toLowerCase() === "reaction role").map(cmd => `${cmd.disabled || disabledCommands.includes(cmd.name || cmd) ? red : green} \`${cmd.name} ${" ".repeat(12 - Number(cmd.name.length))}:\` ${cmd.description}`).join("\n"));

        embed.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()
embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
      
        return message.reply({ embeds: [embed] })

        } else if(args && args[0].toLowerCase() == "tickets" || args && args[0].toLowerCase() == "ticketing"){

        embed.setTitle(` ${emojis.tickets} - Tickets`)
        embed.setDescription(this.client.commands.filter(cmd => 
      
            cmd.category.toLowerCase() === "tickets").map(cmd => `${cmd.disabled || disabledCommands.includes(cmd.name || cmd) ? red : green} \`${cmd.name} ${" ".repeat(11 - Number(cmd.name.length))}:\` ${cmd.description}`).join("\n"));
embed.addField(
        `\u200b`, 
        `**[Invite](https://discord.com/api/oauth2/authorize?client_id=${domain.client_id}&permissions=8&scope=bot) | ` +
        `[Support Server](${domain.support_server_link}) | ` +
        `[Dashboard](${domain.domain || "https://sodachan.tk/dashboard"})**`
      );
        embed.setFooter(`${language.requested} ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        embed.setTimestamp()

        return message.reply({ embeds: [embed] })

      
      
      } else {




         const cmd = this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]))

        if (!cmd)  return message.channel.send(`${message.client.emoji.fail} ${language.fail}`)

        if(cmd.category === "Owner") return message.channel.send(`${message.client.emoji.fail} ${language.fail}`)
        

        embed.setTitle(`Command: ${cmd.name}`)
        embed.setDescription(cmd.description)
        embed.setThumbnail(`${message.client.domain}/logo.png`)
        embed.setFooter(cmd.disabled || disabledCommands.includes(args[0] || args[0].toLowerCase()) ? `${language.disabled1}` : message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
       
        
        embed.addField('Usage',  `\`${cmd.usage}\``, true)
        embed.addField('category',  `\`${capitalize(cmd.category)}\``, true)

        if(cmd.aliases && cmd.aliases.length && typeof(cmd.aliases) === "array") embed.addField('Aliases', cmd.aliases.map(alias => `\`${alias}\``, true).join(', '), true)
        if(cmd.cooldown && cmd.cooldown > 1) embed.addField('Cooldown', `\`${cmd.cooldown}s\``, true)
        if(cmd.examples && cmd.examples.length) embed.addField('__**Examples**__', cmd.examples.map(example => `<:2311Online:897806949737979954> \`${example}\``).join('\n'))
  
        
        return message.reply({ embeds: [embed] })
       
      }
    }
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
