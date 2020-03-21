const Discord = require('discord.js');
const fn = require('../functions.js');
module.exports = {
    name: 'myInfo',
    alises: ['내정보', 'myinfo', 'my-info', 'myinformation', 'my-information'],
    description: '나의 정보를 보여줍니다.',
    run: async function (client, message, args, option) {
        const embed = new Discord.MessageEmbed()
            .setTitle(` ${message.author.username} 정보`)
            .setThumbnail(message.author.displayAvatarURL({
                dynamic: true
            }))
            .setColor(0x00ffff)
            .addField('닉네임', message.author.username)
            .addField('상세 닉네임(태그 포함)', message.author.tag)
            .addField('유저 id', message.author.id)
            .addField('서버 내 별명', message.member.nickname || message.author.username)
            .addField('디스코드 가입일', fn.parseDate(message.author.createdAt))
            .addField('서버 참가일', fn.parseDate(message.member.joinedAt))
            .addField('봇 여부', message.author.bot)
            .addField('디스코드 클라이언트 상태', fn.area(message.author))
            .addField('현재 상태 메세지, 게임 목록', fn.stat(message.author))
            .addField('서버 내 역할', fn.myRoles(message.member.roles.cache, message.guild))
            .addField('가장 높은 역할', `${message.member.roles.highest}`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({
                dynamic: true
            }))
            .setTimestamp()
        message.channel.send(embed);
    }
}
