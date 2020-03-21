module.exports = {
    parseDate: async function (date) {
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
    countTime: async function (time) {
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
    hasAFK: async function (guild) {
        if (guild.afkChannel) {
            return guild.afkChannel.name;
        } else {
            return '없음';
        }
    },
    isVerified: async function (guild) {
        if (guild.verified) {
            return '인증됨';
        } else {
            return '인증되지 않음';
        }
    },
    stat: async function (user) {
        var toReturn = '';
        for (var i = 0; i < user.presence.activities.length; i++) {
            if (user.presence.activities[i].name == 'Custom Status') {
                if (user.presence.activities[i].emoji) {
                    toReturn += user.presence.activities[i].emoji.name;
                }
                toReturn += `${user.presence.activities[i].state} (상태 메세지)`;
            } else {
                toReturn += `
            ${user.presence.activities[i].name} (게임)`;
            }
        }
        return toReturn;
    },
    myRoles: async function (role, guild) {
        var r = new Array();
        role.forEach(function (x) {
            r.push(`${guild.roles.cache.find(a => a.name == x.name)}`);
        });
        var toReturn = r.join(', ');
        return toReturn;
    },
    area: async function (user) {
        var toReturn = '';
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
}