const Discord = require('discord.js');
const fs = require('fs');
const noInv = require('../assets/noInvite.json');
module.exports = {
    name: 'invite_visible',
    alises: ['초대설정', 'invite_setting', 'invite_visibleity', '초대숨기기'],
    description: '/서버목록 커멘드에서 초대 링크를 보여줄지 결정해요.(서버 관리 권한 필요)',
    category: 'admin',
    usage: '/초대설정',
    run: async function (client, message, args, option) {
        if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('서버 관리 권한이 필요해요.');
        if (noInv.guilds[message.guild.id]) {
            delete noInv.guilds[message.guild.id];
            fs.writeFile('../assets/noInvite.json', JSON.stringify(noInv), () => {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle('초대링크가 이제 보여요.')
                    .setColor(0x00ffff)
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.avatarURL({
                        dynamic: true,
                        format: 'jpg',
                        size: 2048
                    }))
                );
            });
        } else {
            noInv.guilds[message.guild.id] = message.guild.id;
            fs.writeFile('../assets/noInvite.json', JSON.stringify(noInv), () => {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle('초대링크가 이제 보이지 않아요.')
                    .setColor(0x00ffff)
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.avatarURL({
                        dynamic: true,
                        format: 'jpg',
                        size: 2048
                    }))
                );
            });
        }
    }
}