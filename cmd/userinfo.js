const Discord = require('discord.js');
const fn = require('../functions.js');
module.exports = {
    name: 'userInfo',
    alises: ['유저정보', 'userinfo', 'user-info', 'userinformation', 'user-information', '정보유저', '사용자정보', '정보사용자'],
    description: '멘션(또는 아이디 입력)한 유저의 정보를 보여줘요.',
    run: async function (client, message, args, option) {
        const mention = message.mentions.users.first();
        if (mention) {
            const member = message.guild.member(mention);
            if (!member) return;
            const embed = new Discord.MessageEmbed()
                .setTitle(`${mention.username} 정보`)
                .setThumbnail(mention.displayAvatarURL({
                    dynamic: true
                }))
                .setColor(0x00ffff)
                .addField('닉네임', mention.username, true)
                .addField('상세 닉네임(태그 포함)', mention.tag, true)
                .addField('유저 id', mention.id, true)
                .addField('서버 내 별명', member.nickname || mention.username, true)
                .addField('디스코드 가입일', fn.parseDate(mention.createdAt), true)
                .addField('서버 참가일', fn.parseDate(member.joinedAt), true)
                .addField('봇 여부', mention.bot, true)
                .addField('디스코드 클라이언트 상태', fn.area(mention) || '없음', true)
                .addField('현재 상태 메세지, 게임 목록', fn.stat(mention) || '없음')
                .addField('서버 내 역할', fn.myRoles(member.roles.cache, message.guild) || '없음', true);
            if (member.roles.highest.id == member.guild.roles.everyone.id) {
                embed.addField('가장 높은 역할', '없음', true);
            } else {
                embed.addField('가장 높은 역할', member.roles.highest || '없음', true);
            }
            embed.setFooter(mention.tag, mention.displayAvatarURL({
                dynamic: true
            }))
                .setTimestamp()
            message.channel.send(embed);
        } else {
            let member = message.guild.members.cache.get(args[1]);
            if (!member) {
                member = message.guild.members.cache.find(x => x.user.username.startsWith(args.slice(1).join(' ')) || x.user.username.endsWith(args.slice(1).join(' ')) || (x.nickname && x.nickname.startsWith(args.slice(1).join(' '))) || (x.nickname && x.nickname.endsWith(args.slice(1).join(' '))));
            }
            if (!member) return;
            const embed = new Discord.MessageEmbed()
                .setTitle(`${member.user.username} 정보`)
                .setThumbnail(member.user.displayAvatarURL({
                    dynamic: true
                }))
                .setColor(0x00ffff)
                .addField('닉네임', member.user.username, true)
                .addField('상세 닉네임(태그 포함)', member.user.tag, true)
                .addField('유저 id', member.user.id, true)
                .addField('서버 내 별명', member.nickname || member.user.username, true)
                .addField('디스코드 가입일', fn.parseDate(member.user.createdAt), true)
                .addField('서버 참가일', fn.parseDate(member.joinedAt), true)
                .addField('봇 여부', member.user.bot, true)
                .addField('디스코드 클라이언트 상태', fn.area(member.user) || '없음', true)
                .addField('현재 상태 메세지, 게임 목록', fn.stat(member.user) || '없음')
                .addField('서버 내 역할', fn.myRoles(member.roles.cache, message.guild) || '없음', true);
            if (member.roles.highest.id == member.guild.roles.everyone.id) {
                embed.addField('가장 높은 역할', '없음', true);
            } else {
                embed.addField('가장 높은 역할', member.roles.highest || '없음', true);
            }
            embed.setFooter(member.user.tag, member.user.displayAvatarURL({
                dynamic: true
            }))
                .setTimestamp()
            message.channel.send(embed);
        }
    }
}
