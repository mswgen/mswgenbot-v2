const Discord = require('discord.js');
const fn = require('./functions.js');
module.exports = {
    name: 'userInfo',
    alises: ['유저정보', 'userinfo', 'user-info', 'userinformation', 'user-information', '정보유저', '사용자정보', '정보사용자'],
    description: '멘션한 유저의 정보를 보여줍니다.',
    run: async function (client, message, args, option) {
        const mention = message.mentions.users.first();
        if (!mention) return;
        const member = message.guild.member(mention);
        if (!member) return;
        const embed = new Discord.MessageEmbed()
            .setTitle(`${mention.username} 정보`)
            .setThumbnail(mention.displayAvatarURL({
                dynamic: true
            }))
            .setColor(0x00ffff)
            .addField('닉네임', mention.username)
            .addField('상세 닉네임(태그 포함)', mention.tag)
            .addField('유저 id', mention.id)
            .addField('서버 내 별명', member.name || mention.username)
            .addField('디스코드 가입일', fn.parseDate(mention.createdAt))
            .addField('서버 참가일', fn.parseDate(member.joinedAt))
            .addField('봇 여부', mention.bot)
            .addField('디스코드 클라이언트 상태', fn.area(mention) || '없음')
            .addField('현재 상태 메세지, 게임 목록', fn.stat(mention) || '없음')
            .addField('서버 내 역할', fn.myRoles(member.roles.cache, message.guild))
            .addField('가장 높은 역할', `${member.roles.highest}`)
            .setFooter(mention.tag, mention.displayAvatarURL({
                dynamic: true
            }))
            .setTimestamp()
        message.channel.send(embed);
    }
}
