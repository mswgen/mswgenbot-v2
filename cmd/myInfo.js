const Discord = require('discord.js');
const fn = require('../functions.js');
module.exports = {
    name: 'myInfo',
    alises: ['내정보', 'myinfo', 'my-info', 'myinformation', 'my-information'],
    description: '나의 정보를 보여줘요.',
    category: 'info',
    usage: '/내정보',
    run: async function (client, message, args, option) {
        let userFlag = await message.author.fetchFlags();
        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.author.username} 정보`)
            .setThumbnail(message.author.displayAvatarURL({
                dynamic: true
            }))
            .setColor(0x00ffff)
            .addField('닉네임', message.author.username, true)
            .addField('상세 닉네임(태그 포함)', message.author.tag, true)
            .addField('유저 id', message.author.id, true)
            .addField('서버 내 별명', message.member.nickname || message.author.username, true)
            .addField('디스코드 가입일', fn.parseDate(message.author.createdAt), true)
            .addField('HypeSquad', fn.hype(client, userFlag), true)
            .addField('서버 참가일', fn.parseDate(message.member.joinedAt), true)
            .addField('봇 여부', message.author.bot, true)
            .addField('디스코드 클라이언트 상태', fn.area(message.author), true)
            .addField('현재 상태 메세지, 게임 목록', fn.stat(message.author))
            .addField('서버 내 역할', fn.myRoles(message.member.roles.cache, message.guild) || '없음', true);
        if (message.member.roles.highest.id == message.guild.roles.everyone.id) {
            embed.addField('가장 높은 역할', '없음', true);
        } else {
            embed.addField('가장 높은 역할', message.member.roles.highest || '없음', true);
        }
            embed.setFooter(message.author.tag, message.author.displayAvatarURL({
                dynamic: true
            }))
            .setTimestamp()
        message.channel.send(embed);
    }
}
