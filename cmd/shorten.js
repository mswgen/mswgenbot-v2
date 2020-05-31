const Discord = require('discord.js');
const axios = require('axios');
module.exports = {
    name: 'shorten', 
    alises: ['단축', 'shorten'],
    description: 'URL을 단축해요.',
    category: 'crawling',
    usage: '/단축 <단축할 url>',
    run: async function (client, message, args, option) {
        if (!args[1]) return message.channel.send('단축할 URL을 입력해주세요.');
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} URL 단축 중`)
            .setColor(0xffff00)
            .addField('단축할 URL', args.slice(1).join(' '), true)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true,
                format: 'jpg',
                size: 2048
            }))
            .setTimestamp();
        let m = await message.channel.send(embed);
        await axios.get(`https://openapi.naver.com/v1/util/shorturl?url=${encodeURIComponent(args.slice(1).join(' '))}`, {
            headers: {
                'X-Naver-Client-Id': process.env.NAVER_ID,
                'X-Naver-Client-Secret': process.env.NAVER_SECRET
            },
            validateStatus: () => true
        }).then(async function (response) {
            console.log(response);
            if (response.data.message == 'ok') {
                embed.setTitle(`${client.emojis.cache.find(x => x.name == 'botLab_done')} URL 단축이 완료되었어요`)
                    .addField('단축된 URL', response.data.result.url, true)
                    .setColor(0x00ffff)
                    .setImage(`${response.data.result.url}.qr`);
                await m.edit(embed);
            } else {
                embed.setTitle(`${client.emojis.cache.find(x => x.name == 'botLab_x')} URL을 단축하는 동안 오류가 발생했어요`)
                    .addField('오류 내용', response.data.message, true)
                    .setColor(0xff0000)
                await m.edit(embed);
            }
        })
    }
}