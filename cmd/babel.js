const Discord = require('discord.js');
const babel = require('@babel/core');
const fn = require('../functions.js');
const fs = require('fs');
module.exports = {
    name: 'babel',
    alises: ['바벨', '성경'],
    description: 'babel을 이용해 코드를 압축하고 옛날 브라우저에서도 실행되도록 해요.',
    category: 'other',
    usage: '/babel <JavaScript 코드>',
    run: async (client, message, args, option) => {
        if (!args[1]) return message.channel.send('컴파일할 코드를 써 주세요!')
        const embed = new Discord.MessageEmbed()
        .setTitle(`${client.emojis.cache.find(x => x.name == 'loading')} Compiling...`)
        .setColor(0xffff00)
        .addField('Input', fn.codeBlock(fn.checkLength(args.slice(1).join(' ')), 'js'))
        .setFooter(message.author.tag, message.author.avatarURL({
            dynamic: true,
            format: 'jpg',
            size: 2048
        }))
        .setTimestamp()
        let m = await message.channel.send(embed);
        let compiled = babel.transform(args.slice(1).join(' '), {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            env: {
                production: {
                    presets: ["minify", "es2015", "@babel/preset-react"]
                }
            }
        });
        embed.setColor(0x00ffff)
        .setTitle('Compiled')
        .setTimestamp()
        if (compiled.code.length > 1000) {
            embed.addField('Output', '코드가 너무 길어서 대신 파일을 올렸어요. 아래 파일을 다운로드해주세요.')
            await m.edit(embed);
            let random = Math.floor(Math.random() * 100000);
            fs.writeFile(`./tmp/${message.author.id}_${random}.txt`, compiled.code, async () => {
                await message.channel.send(new Discord.MessageAttachment(`./tmp/${message.author.id}_${random}.txt`, 'code.js'));
                fs.unlinkSync(`./tmp/${message.author.id}_${random}.txt`);
            });
        } else {
            embed.setColor(0x00ffff)
            .setTitle('Compiled')
            .addField('Output', fn.codeBlock(compiled.code, 'js'))
            await m.edit(embed);
        }
    }
}