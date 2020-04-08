const Discord = require('discord.js');
const util = require('util');
module.exports = {
    name: 'eval', 
    alises: ['eval', '실행', 'compile', '컴파일', 'evaluate', 'ㄷㅍ미', '채ㅡㅔㅑㅣㄷ', 'ㄷㅍ미ㅕㅁㅅㄷ'],
    description: '자바스크립트 코드를 바로 실행합니다.(봇 제작자만 가능)',
    run: async function (client, message, args, option) {
        message.delete();
        if (!option.ownerId.includes(message.author.id)) return message.channel.send(`${client.user.username} 개발자만 가능합니다.`);
        let input = args.slice(1).join(' ');
        if (!input) return message.channel.send('내용을 써 주세요.');
        for (var x in process.env) {
            input = input.replace(x, 'Secret');
        }
        input = input.replace(/client.token/gi, '"Secret"').replace(/process.env/gi, '"Secret"')
        const code = `const Discord = require('discord.js');
const fs = require('fs');
const util = require('util');
const ascii = require('ascii-table');
const cheerio = require('cheerio');
const os = require('os');
const dotenv = require('dotenv');
const axios = require('axios');
const fetch = require('node-fetch');
const request = require('request');
const ytdl = require('ytdl-core');
const isgd = require('isgd');
const http = require('http');
const qs = require('querystring');
const url = require('url');

${input}`;
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} Evaling...`)
            .setColor(0xffff00)
            .addField('Input', '```js\n' + args.slice(1).join(' ') + '\n```')
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        let m = await message.channel.send(embed);
        try {
            let output = eval(code);
            let type = typeof output;
            if (typeof output !== "string") {
                output = util.inspect(output);
            }
            if (output.length >= 1020) {
                output = `${output.substr(0, 1010)}...`;
            }
            while (true) {
                if (!output.includes(process.env.TOKEN)) {
                    break;
                }
                output = output.replace(process.env.TOKEN, 'Secret');
            }
            const embed2 = new Discord.MessageEmbed()
                .setTitle('Eval result')
                .setColor(0x00ffff)
                .addField('Input', '```js\n' + args.slice(1).join(' ') + '\n```')
                .addField('Output', '```js\n' + output + '\n```')
                .addField('Type', '```js\n' + type + '\n```')
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            m.edit(embed2);
        } catch (err) {
            const embed3 = new Discord.MessageEmbed()
                .setTitle('Eval error...')
                .setColor(0xff0000)
                .addField('Input', '```js\n' + args.slice(1).join(' ') + '\n```')
                .addField('Error', '```js\n' + err + '\n```')
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            m.edit(embed3);
        }
    }
}