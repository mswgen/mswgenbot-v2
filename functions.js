const ytdl = require('ytdl-core');
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
        return toReturn;
    },
    skip: function (message) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "음악을 스킵하려면 음성 채널에 들어가야 합니다."
        );
    if (!message.serverQueue)
        return message.channel.send("현재 재생 중인 노래가 없습니다.");
        message.serverQueue.connection.dispatcher.end();
    },
    stop: function (message) {
        if (!message.member.voice.channel) {
            return message.channel.send(
                "음악을 멈추려면 음성 채널에 들어가야 합니다."
            );
        }
    message.serverQueue.songs = [];
        message.serverQueue.connection.dispatcher.end();
    },
    play: function (client, guild, song) {
    const serverQueue = client.queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        client.queue.delete(guild.id);
        return;
    }
        const dispatcher = serverQueue.connection;
        console.log(serverQueue + '\n\n\n\n\n');
        console.log(song + '\n\n\n\n\n');
        console.log(ytdl(song.url));
        dispatcher.play(ytdl(song.url));
        dispatcher.on("finish", () => {
            serverQueue.songs.shift();
            fn.play(guild, serverQueue.songs[0]);
        });
        dispatcher.on("error", error => {
            console.log(error);
        });
    //dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`${song.title}이 곧 재생됩니다.`);
}
}
/*
{
  textChannel: TextChannel,
  voiceChannel: VoiceChannel,
  connection: VoiceConnection {
    _events: [Object: null prototype] {
      closing: [Array],
      debug: [Function],
      failed: [Function],
      disconnect: [Function]
    },
    _eventsCount: 4,
    _maxListeners: undefined,
    voiceManager: ClientVoiceManager {
      connections: [Collection [Map]],
      broadcasts: []
    },
    channel: VoiceChannel {
      type: 'voice',
      deleted: false,
      id: '688681923702423642',
      name: '64kb/s',
      rawPosition: 0,
      parentID: '688681923702423594',
      permissionOverwrites: [Collection [Map]],
      bitrate: 64000,
      userLimit: 0,
      guild: [Guild]
    },
    status: 0,
    speaking: Speaking { bitfield: 0 },
    authentication: {
      sessionID: 'd4e5da0bfec947cb24d137ac3ffad09a',
      token: 'd19264306c677f3f',
      endpoint: 'south-korea586.discord.media',
      ssrc: 1610827,
      port: 50002,
      modes: [Array],
      ip: '107.155.37.186',
      experiments: [Array],
      mode: 'xsalsa20_poly1305_lite',
      video_codec: 'VP8',
      secret_key: [Uint8Array],
      media_session_id: '032c892f4b18025f3623a82e04b78b0d',
      audio_codec: 'opus'
    },
    player: AudioPlayer {
      _events: [Object: null prototype],
      _eventsCount: 2,
      _maxListeners: undefined,
      dispatcher: null,
      streamingData: [Object],
      voiceConnection: [Circular],
      [Symbol(kCapture)]: false
    },
    ssrcMap: Map {},
    _speaking: Map {},
    sockets: { ws: [VoiceWebSocket], udp: [VoiceConnectionUDPClient] },
    receiver: VoiceReceiver {
      _events: [Object: null prototype] {},
      _eventsCount: 0,
      _maxListeners: undefined,
      connection: [Circular],
      packets: [PacketHandler],
      [Symbol(kCapture)]: false
    },
    connectTimeout: Timeout {
      _idleTimeout: -1,
      _idlePrev: null,
      _idleNext: null,
      _idleStart: 15110,
      _onTimeout: null,
      _timerArgs: undefined,
      _repeat: null,
      _destroyed: true,
      [Symbol(refed)]: true,
      [Symbol(asyncId)]: 4541,
      [Symbol(triggerId)]: 0
    },
    [Symbol(kCapture)]: false
  },
  songs: [
    {
      title: 'SRT 로고송 - 우리 곁에 SRT (오리지널 ver)',
      url: 'https://www.youtube.com/watch?v=sBlMT_pin_w'
    }
  ],
  volume: 5,
  playing: true
}
*/