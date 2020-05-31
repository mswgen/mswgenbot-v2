﻿const Discord = require('discord.js');
const Pingpong = require('pingpong-builder');
const builder = new Pingpong.Ai();
module.exports = {
    name: 'pingpong',
    alises: ['핑퐁', 'pingpong', 'vldvhd'],
    description: '[핑퐁 빌더](https://pingpong.us)를 사용한 인공지능과 대화해요. ',
    category: 'play',
    usage: '/핑퐁 <할 말>',
    run: async function (client, message, args, option) {
        builder.get(process.env.PINGPONG_URL, process.env.PINGPONG_AUTH, message.author.id, args.slice(1).join(' ')).then(res => {
            for (var x of res) {
                const embed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setFooter(message.author.tag, message.author.avatarURL({
                        dynamic: true,
                        format: 'jpg',
                        size: 2048
                    }))
                    .setTimestamp();
                if (x.startsWith('http://') || x.startsWith('https://')) {
                    embed.setImage(x);
                } else {
                    embed.setDescription(x);
                }
                message.channel.send(embed);
            }
        });
    }
}