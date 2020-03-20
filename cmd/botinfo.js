const Discord = require('discord.js');
const os = require('os');
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
function countTime(time) {
    var remaining = time;
    var day = 0;
    var hour = 0;
    var minute = 0;
    var second = 0;
    var ms = 0;
    day = parseInt(remaining / 86400000);
    remaining -= day * 86400000;
    hour = parseInt(remaining / 3600000);
    remaining -= hour * 3600000;
    minute = parseInt(remaining / 60000);
    remaining -= minute * 60000;
    second = parseInt(remaining / 1000);
    remaining -= second * 1000;
    ms = remaining;
    return (
        day + "일 " + hour + "시간 " + minute + "분 " + second + "초 " + ms + "ms"
    );
}
module.exports = {
    name: 'botinfo', 
    alises: ['봇정보', 'botinfo', '정보봇', 'bot-info'],
    description: '이 봇의 정보를 보여줍니다.',
    run: async function (client, message, args, option) {
        let m = await message.channel.send(new Discord.MessageEmbed().setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 핑 측정 중...`).setTimestamp());
        const embed2 = new Discord.MessageEmbed()
            .setTitle(`${client.user.username} 정보`)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .setColor(0x00ffff)
            .addField('봇 이름', client.user.tag)
            .addField('봇 id', client.user.id)
            .addField('봇 개발 시작일', parseDate(client.user.createdAt))
            .addField('개발자', 'It\'s time to ditch Skype and ...#5458')
            .addField('함께하는 서버 개수', `${client.guilds.cache.size}개`)
            .addField('함께하는 유저 수', `${client.users.cache.size}명`)
            .addField('현재 핑(지연 시간)', `${m.createdAt - message.createdAt}ms`)
            .addField('현재 핑(API 지연 시간)', `${client.ws.ping}ms`)
            .addField('봇 업타임', countTime(client.uptime))
            .addField('플랫폼', process.platform)
            .addField('arch', process.arch)
            .addField('RAM 사용량', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB`)
            .addField('CPU 모델', os.cpus()[0].model)
            .addField('개발 언어', `${client.emojis.cache.find(x => x.name == 'js')} Javascript(Node.js)`)
            .addField(`Node.js 버전`, `${client.emojis.cache.find(x => x.name == 'node_js')} v.${process.versions.node}`)
            .addField('Discord.js 버전', `${client.emojis.cache.find(x => x.name == 'discord_js')} v.${Discord.version}`)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        m.edit(embed2);
    }
}
