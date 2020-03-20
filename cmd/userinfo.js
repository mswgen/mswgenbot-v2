const Discord = require('discord.js');
function stat(user) {
    var toReturn = '';
    for (var i = 0; i < user.presence.activities.length; i++) {
        if (user.presence.activities[i].name == 'Custom Status') {
            toReturn += `
            ${user.presence.activities[i].emoji.name}${user.presence.activities[i].state} (상태 메세지)`;
        } else {
            toReturn += `
            ${user.presence.activities[i].name} (게임)`;
        }
    }
    return toReturn;
}
function parseDate(date) {
    var days = {
        Sun: '일',
        Mon: '월',
        Tue: '화',
        Wed: '수',
        Thu: '목',
        Fri: '금',
        Sat: '토'
    };
    var months = {
        Jan: '1',
        Feb: '2',
        Mar: '3',
        Apr: '4',
        May: '5',
        Jun: '6',
        Jul: '7',
        Aug: '8',
        Sep: '9',
        Oct: '10',
        Nov: '11',
        Dec: '12'
    };
    var toParse = date.toString().split(/ /g);
    var toReturn = new Array();
    toReturn.push(toParse[3] + '년');
    toReturn.push(months[toParse[1]] + '월');
    toReturn.push(toParse[2] + '일');
    toReturn.push(days[toParse[0]] + '요일');
    var time = toParse[4].split(':');
    toReturn.push(time[0] + '시');
    toReturn.push(time[1] + '분');
    toReturn.push(time[2] + '초');
    var timeZone = toParse.slice(6).join(' ');
    toReturn.push(timeZone);
    var Final = toReturn.join(' ');
    return Final;
}
function myRoles(role, guild) {
    var r = new Array();
    role.forEach(function (x) {
        r.push(`${guild.roles.cache.find(a => a.name == x.name)}`);
    });
    var toReturn = r.join(', ');
    return toReturn;
}
function area(user) {
    var toReturn = '';
    if (!user.presence.clientStatus) return '없음';
    if (user.presence.clientStatus.desktop) {
        toReturn += `
        데스크톱 앱: ${user.presence.clientStatus.desktop}`;
    }
    if (user.presence.clientStatus.web) {
        toReturn += `
        데스크톱 웹: ${user.presence.clientStatus.web}`;
    }
    if (user.presence.clientStatus.mobile) {
        toReturn += `
        모바일 앱: ${user.presence.clientStatus.mobile}`;
    }
    return toReturn;
}
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
            .addField('디스코드 가입일', parseDate(mention.createdAt))
            .addField('서버 참가일', parseDate(member.joinedAt))
            .addField('봇 여부', mention.bot)
            .addField('디스코드 클라이언트 상태', area(mention) || '없음')
            .addField('현재 상태 메세지, 게임 목록', stat(mention) || '없음')
            .addField('서버 내 역할', myRoles(member.roles.cache, message.guild))
            .addField('가장 높은 역할', `${member.roles.highest}`)
            .setFooter(mention.tag, mention.displayAvatarURL({
                dynamic: true
            }))
            .setTimestamp()
        message.channel.send(embed);
    }
}