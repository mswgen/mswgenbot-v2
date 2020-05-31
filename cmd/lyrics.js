const Discord = require('discord.js');
const Lyrics = require('slyrics');
const lyrics = new Lyrics();
module.exports = {
    name: 'lyrics',
    alises: ['가사', '가사검색', 'lyrics', '리릭스'],
    description: 'Melon이나 AtoZLyrics에서 노래의 가사를 검색해요.',
    category: 'crawling',
    usage: '/가사검색 <노래 이름>',
    run: async function (client, message, args, option) {
        if (!args[1]) return;
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} ${args.slice(1).join(' ')}의 가사 검색 중`)
            .setColor(0xffff00)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        let m = await message.channel.send(embed);
        const melon = await lyrics.get('melon', args.slice(1).join(' '))
        const atoz = await lyrics.get('atoz', args.slice(1).join(' '))
        if (melon.result) {
            console.log(melon);
            const imbed = new Discord.MessageEmbed()
                .setTitle(`${melon.title}의 가사(출처: Melon)`)
                .setColor(0x00ffff);
            if (melon.result.length > 1900) {
                imbed.setDescription(`노래 링크: ${melon.url}

${melon.result.substr(0, 1900)}...`);
            } else {
                imbed.setDescription(`노래 링크: ${melon.url}

${melon.result}`);
            }
            imbed.setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
                .setTimestamp()
            m.edit(imbed);
        } else if (atoz.result) {
            const imbed = new Discord.MessageEmbed()
                .setTitle(`${atoz.title}의 가사(출처: AtoZLyrics)`)
                .setColor(0x00ffff);
            if (atoz.result.length > 1900) {
                imbed.setDescription(`노래 링크: ${atoz.url}

${atoz.result.substr(0, 1900)}...`)
            } else {
                imbed.setDescription(`노래 링크: ${atoz.url}

${atoz.result}`)
            }
            imbed.setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
                .setTimestamp()
            m.edit(imbed);
        } else {
            const imbed = new Discord.MessageEmbed()
                .setTitle('가사 검색 실패...')
                .setColor(0xff0000)
                .setDescription(`${args.slice(1).join(' ')}의 가사를 찾을 수 없어요.`)
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            m.edit(imbed);
        }
    }
}