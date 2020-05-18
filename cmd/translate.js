const Discord = require('discord.js');
const axios = require('axios');
module.exports = {
    name: 'translate',
    alises: ['번역', 'translate'],
    description: '네이버 파파고를 이용해 문장을 번역해요.',
    run: async function (client, message, args, option) {
        var lang = {
            한국어: 'ko',
            영어: 'en',
            일본어: 'jp',
            중국어간체: 'zh-CN',
            중국어번체: 'zh-TW',
            english: 'en',
            japanese: 'jp',
            'chinese-simplified': 'zh-CN',
            'chinese-traditional':'zh-TW'
        }
        if (!args[2]) return;
        if (!lang[args[1]]) return message.channel.send('현재 한국어, 영어, 중국어간체, 중국어번체, 일본어만 가능해요.');
        axios.post('https://openapi.naver.com/v1/papago/detectLangs', {
            query: args.slice(2).join(' ')
        },
        {
            headers: {
                'X-Naver-Client-Id': process.env.NAVER_ID,
                'X-Naver-Client-Secret': process.env.NAVER_SECRET
             }
            }).then(async function (response) {
            axios.post('https://openapi.naver.com/v1/papago/n2mt', {
                source: response.data.langCode,
                target: lang[args[1]] || args[1],
                text: args.slice(2).join(' ')
             },
             {
                headers: {
                    'X-Naver-Client-Id': process.env.NAVER_ID,
                    'X-Naver-Client-Secret': process.env.NAVER_SECRET
                 }
            }).then(async function (response2) {
                const embed = new Discord.MessageEmbed()
                    .setTitle('번역 결과')
                    .setColor(0x00ffff)
                    .setThumbnail('https://papago.naver.com/favicon.ico')
                    .addField('원본 언어', response.data.langCode, true)
                    .addField('번역할 언어', lang[args[1]], true)
                    .addField('번역할 내용', args.slice(2).join(' '), true)
                    .addField('번역된 내용', response2.data.message.result.translatedText, true)
                    .setFooter(message.author.tag, message.author.avatarURL({
                        dynamic: true,
                        size: 2048,
                        format: 'jpg'
                    }))
                    .setTimestamp()
                message.channel.send(embed);
            });
        });
    }
}