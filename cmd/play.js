const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const opus = require('@discordjs/opus');
const opusscript = require('opusscript');
const search = require('yt-search');
async function play (client, guild, song, info, m, message) {
	const serverQueue = client.queue.get(guild.id);
	if (!song) {
		serverQueue.voiceChannel.leave();
		client.queue.delete(guild.id);
		return;
    }
    const dispatcher = serverQueue.connection.play(ytdl(song.song.url));
    var _m = await message.channel.send(`${song.song.title} 재생 중\n🔘--------------------`);
    var intvl = setInterval(() => {
        _m.edit(_m.content.replace('🔘--', '--🔘'));
    }, info.length_seconds * 1000 / 10);
    const imbed = new Discord.MessageEmbed()
        .setTitle('노래를 재생하기 시작했어요.')
        .setDescription('노래가 들리지 않으면 봇의 마이크가 음소거되어있는지 확인해주세요.')
        .setColor(0x00ffff)
        .setThumbnail(info.author.avatar)
        .addField('노래 제목', info.title, true)
        .addField('노래 URL', info.video_url, true)
        .addField('상세 설명', info.description || '없음')
        .addField('재생 시간', `${Math.floor(info.length_seconds / 3600)}시간 ${Math.floor(parseInt(Math.floor((Math.floor(info.length_seconds - Math.floor(info.length_seconds / 3600) * 3600) / 60)).toString().split('.')[0]))}분 ${info.length_seconds - Math.floor(info.length_seconds / 60) * 60}초`, true)
        .addField('제작자 id', info.author.id, true)
        .addField('제작자 채널 이름', info.author.name, true)
        .setImage(info.player_response.videoDetails.thumbnail.thumbnails[info.player_response.videoDetails.thumbnail.thumbnails.length - 1].url)
        .setFooter(message.author.tag, message.author.avatarURL({
            dynamic: true
        }))
    .setTimestamp()
    m.edit(imbed);
    dispatcher.on('finish', function () {
            serverQueue.songs.shift();
            _m.delete();
            clearInterval(intvl);
            delete intvl;
            delete _m;
			play(client, guild, serverQueue.songs[0], info, m, message);
		});
    dispatcher.on('error', function (error) {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}
module.exports = {
    name: 'play', 
    alises: ['재생', 'play'],
    description: '유튜브에서 노래를 검색해 재생해요. (url, 유튜브 검색어 둘 다 가능)',
    run: async function (client, message, args, option) {
        message.delete();
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return message.channel.send(
                "음악을 재생하려면 음성 채널에 들어가야 해요."
            );
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send(
                "음성 채널 연결 권한과 말하기 권한이 필요해요."
            );
        }
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 노래 로딩 중`)
            .setColor(0xffff00)
            .addField('검색어 또는 노래 URL', args.slice(1).join(' '), true)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        let m = await message.channel.send(embed);
        var url = null;
        if (!(args.slice(1).join(' ').startsWith('http://www.youtube.com') || args.slice(1).join(' ').startsWith('https://www.youtube.com') || args.slice(1).join(' ').startsWith('youtube.com') || args.slice(1).join(' ').startsWith('www.youtube.com') || args.slice(1).join(' ').startsWith('http://youtube.com') || args.slice(1).join(' ').startsWith('https://youtube.com'))) {
            search(args.slice(1).join(' '), async function (err, response) {
                if (err) console.log(err);
                url = response.videos[0].url;
                const songInfo = await ytdl.getInfo(url);
                const song = {
                    title: songInfo.title,
                    url: songInfo.video_url
                };
                if (!message.serverQueue) {
                    const queueContruct = {
                        textChannel: message.channel,
                        voiceChannel: voiceChannel,
                        connection: null,
                        songs: [],
                        volume: 5,
                        playing: true
                    };
                    queueContruct.songs.push({
                        song: song,
                        author: message.author
                    });
                    try {
                        var connect = await voiceChannel.join();
                        queueContruct.connection = connect;
                        client.queue.set(message.guild.id, queueContruct);
                        play(client, message.guild, queueContruct.songs[0], songInfo, m, message);
                    } catch (err) {
                        console.error(err);
                    }
                } else {
                    message.serverQueue.songs.push({
                        song: song,
                        author: message.author
                    });
                    const emved = new Discord.MessageEmbed()
                        .setTitle(`노래 재생 대기 중(대기열 ${message.serverQueue.songs.length - 1}번)`)
                        .setColor(0x00ffff)
                        .setThumbnail(songInfo.author.avatar)
                        .addField('노래 제목', songInfo.title, true)
                        .addField('노래 URL', songInfo.video_url, true)
                        .addField('상세 설명', songInfo.description || '없음')
                        .addField('재생 시간', `${Math.floor(songInfo.length_seconds / 3600)}시간 ${Math.floor(parseInt(Math.floor((Math.floor(songInfo.length_seconds - Math.floor(songInfo.length_seconds / 3600) * 3600) / 60)).toString().split('.')[0]))}분 ${songInfo.length_seconds - Math.floor(songInfo.length_seconds / 60) * 60}초`, true)
                        .addField('제작자 id', songInfo.author.id, true)
                        .addField('제작자 채널 이름', songInfo.author.name, true)
                        .setImage(songInfo.player_response.videoDetails.thumbnail.thumbnails[songInfo.player_response.videoDetails.thumbnail.thumbnails.length - 1].url)
                        .setFooter(message.author.tag, message.author.avatarURL({
                            dynamic: true
                        }))
                        .setTimestamp()
                    m.edit(emved);
                    return;
                }
            })
        } else {
            url = args.slice(1).join(' ');
            const songInfo = await ytdl.getInfo(url);
            const song = {
                title: songInfo.title,
                url: songInfo.video_url
            };
            if (!message.serverQueue) {
                const queueContruct = {
                    textChannel: message.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true
                };
                queueContruct.songs.push({
                    song: song,
                    author: message.author
                });
                try {
                    var connect = await voiceChannel.join();
                    queueContruct.connection = connect;
                    client.queue.set(message.guild.id, queueContruct);
                    play(client, message.guild, queueContruct.songs[0], songInfo, m, message);
                } catch (err) {
                    console.log(err);
                    client.queue.delete(message.guild.id);
                    return message.channel.send(err);
                }
            } else {
                message.serverQueue.songs.push(song);
                const emved = new Discord.MessageEmbed()
                    .setTitle(`노래 재생 대기 중(대기열 ${message.serverQueue.songs.length - 1}번)`)
                    .setColor(0x00ffff)
                    .setThumbnail(songInfo.author.avatar)
                    .addField('노래 제목', songInfo.title, true)
                    .addField('노래 URL', songInfo.video_url, true)
                    .addField('상세 설명', songInfo.description || '없음')
                    .addField('재생 시간', `${Math.floor(songInfo.length_seconds / 3600)}시간 ${Math.floor(parseInt(Math.floor((Math.floor(songInfo.length_seconds - Math.floor(songInfo.length_seconds / 3600) * 3600) / 60)).toString().split('.')[0]))}분 ${songInfo.length_seconds - Math.floor(songInfo.length_seconds / 60) * 60}초`, true)
                    .addField('제작자 id', songInfo.author.id, true)
                    .addField('제작자 채널 이름', songInfo.author.name, true)
                    .setImage(songInfo.player_response.videoDetails.thumbnail.thumbnails[songInfo.player_response.videoDetails.thumbnail.thumbnails.length - 1].url)
                    .setFooter(message.author.tag, message.author.avatarURL({
                        dynamic: true
                    }))
                    .setTimestamp()
                m.edit(emved);
                return;
            }
        }
    }
}