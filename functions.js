const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const fn = require('./functions.js');
module.exports = {
    parseDate: function (date) {
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
    },
    countTime: function (time) {
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
    },
    hasAFK: function (guild) {
        if (guild.afkChannel) {
            return guild.afkChannel.name;
        } else {
            return '없음';
        }
    },
    isVerified: function (guild) {
        if (guild.verified) {
            return '인증됨';
        } else {
            return '인증되지 않음';
        }
    },
    stat: function (user) {
        var toReturn = '';
        for (var i = 0; i < user.presence.activities.length; i++) {
            if (user.presence.activities[i].name == 'Custom Status') {
                if (user.presence.activities[i].emoji) {
                    toReturn += `${user.presence.activities[i].emoji}`;
                }
                if (user.presence.activities[i].state) {
                    toReturn += `${user.presence.activities[i].state}`;
                }
                toReturn += ' (상태 메세지)';
            } else if (user.presence.activities[i].name) {
            toReturn += `
            ${user.presence.activities[i].name} (게임)`;
            }
        }
        if (toReturn == '') {
            toReturn = '없음';
        }
        return toReturn;
    },
    myRoles: function (role, guild) {
        var r = new Array();
        role.forEach(function (x) {
            if (x.id != guild.roles.everyone.id) {
                r.push(`${x}`);
            }
        });
        var toReturn = r.join(', ');
        return toReturn;
    },
    area: function (user) {
        var stats = {
            online: '🟢 온라인',
            idle: '🌙 자리 비움',
            dnd: '⛔ 다른 용무 중'
        };
        var toReturn = '';
        if (user.presence.clientStatus) {
            if (user.presence.clientStatus.desktop) {
                toReturn += `
🖥 데스크톱 앱: ${stats[user.presence.clientStatus.desktop]}`;
            }
            if (user.presence.clientStatus.web) {
                toReturn += `
💻 데스크톱 웹: ${stats[user.presence.clientStatus.web]}`;
            }
            if (user.presence.clientStatus.mobile) {
                toReturn += `
📱 모바일 앱: ${stats[user.presence.clientStatus.mobile]}`;
            }
            if (toReturn == null || toReturn == undefined || toReturn == '') {
                toReturn = '⚪ 오프라인';
            }
        } else {
            toReturn = '없음';
        }
        return toReturn;
    },
    skip: function (message) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "음악을 스킵하려면 음성 채널에 들어가야 해요."
        );
        if (!message.serverQueue) return message.channel.send("현재 재생 중인 노래가 없어요.");
        if (message.serverQueue.songs[0].author.id != message.author.id) return message.channel.send('음악을 재생한 유저만 음악을 스킵할 수 있어요.');
        message.channel.send(`${message.serverQueue.songs[0].song.title}을/를 스킵했어요. `).then(function () {
            message.serverQueue.connection.dispatcher.end();
        });
    },
    stop: function (message) {
        if (!message.member.voice.channel) {
            return message.channel.send(
                "음악을 멈추려면 음성 채널에 들어가야 해요."
            );
        }
    message.serverQueue.songs = [];
        message.serverQueue.connection.dispatcher.end();
    },
    checkLength: function (input) {
        if (input.toString().length > 1000) {
            return `${input.substr(0, 1000)}...`;
        } else {
            return input.toString();
        }
    },
    codeBlock: function (input, type) {
        return `\`\`\`${type}\n${input}\n\`\`\``;
    },
    hype: function (client, flag) {
        if (flag.has('HOUSE_BRILLIANCE')) {
            return `${client.emojis.cache.find(x => x.name == 'hypesqaud_brilliance')} House of Brilliance`;
        } else if (flag.has('HOUSE_BRAVERY')) {
            return `${client.emojis.cache.find(x => x.name == 'hypesqaud_bravery')} House of Bravery`;
        } else if (flag.has('HOUSE_BALANCE')) {
            return `${client.emojis.cache.find(x => x.name == 'hypesqaud_balance')} House of Balance`;
        } else {
            return '없음';
        }
    }
}
