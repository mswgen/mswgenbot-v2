const Discord = require('discord.js');
const isgd = require('isgd');
module.exports = {
    name: 'shorten', 
    alises: ['단축', 'shorten'],
    description: 'http://is.gd/ 사이트를 이용해 URL을 단축합니다.',
    run: async function (client, message, args, option) {
        if (!args[1]) return;
        if (!args[2]) {
            isgd.shorten(args[1], function (res) {
                const embed = new Discord.MessageEmbed()
                    .setTitle('URL 단축 완료!')
                    .setColor(0x00ffff)
                    .addField('원본 URL', args[1])
                    .addField('단축된 URL', res)
                    .setFooter(message.author.tag, message.author.avatarURL({
                        dynamic: true
                    }))
                    .setTimestamp()
                message.channel.send(embed);
            });
        } else {
            isgd.custom(args[1], args[2], function (res) {
                if (!res.startsWith('http://') && !res.startsWith('https://')) {
                    const embed = new Discord.MessageEmbed()
                        .setTitle('URL 단축 실패...')
                        .setColor(0xff0000)
                        .addField('원본 URL', args[1])
                        .addField('커스텀 URL 이름', args[2])
                        .addField('에러 내용', res)
                        .setFooter(message.author.tag, message.author.avatarURL({
                            dynamic: true
                        }))
                        .setTimestamp()
                    message.channel.send(embed);
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setTitle('URL 단축 완료!')
                        .setColor(0x00ffff)
                        .addField('원본 URL', args[1])
                        .addField('커스텀 URL 이름', args[2])
                        .addField('단축된 URL', res)
                        .setFooter(message.author.tag, message.author.avatarURL({
                            dynamic: true
                        }))
                        .setTimestamp()
                    message.channel.send(embed);
                }
            });
        }
    }
}