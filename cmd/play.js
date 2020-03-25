const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const opus = require('@discordjs/opus');
const opusscript = require('opusscript');
function play(client, guild, song) {
	const serverQueue = client.queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		client.queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.play(ytdl(song.url));
		dispatcher.on('finish', () => {
			console.log('Music ended!');
			serverQueue.songs.shift();
			play(client, guild, serverQueue.songs[0]);
		});
		dispatcher.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}
module.exports = {
    name: 'play', 
    alises: ['재생', 'play'],
    description: '유튜브에서 노래를 검색해 재생합니다.',
    run: async function (client, message, args, option) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return message.channel.send(
                "음악을 재생하려면 음성 채널에 들어가야 합니다."
            );
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send(
                "음성 채널 연결 권한과 말하기 권한이 필요합니다."
            );
        }

        const songInfo = await ytdl.getInfo(args.slice(1).join(' '));
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
            queueContruct.songs.push(song);
            try {
                var connect = await voiceChannel.join();
                queueContruct.connection = connect;
                client.queue.set(message.guild.id, queueContruct);
                play(client, message.guild, queueContruct.songs[0]);
            } catch (err) {
                console.log(err);
                client.queue.delete(message.guild.id);
                return message.channel.send(err);
            }
        } else {
            message.serverQueue.songs.push(song);
            return message.channel.send(`${song.title}이 대기열 ${message.serverQueue.songs.length - 1}번에 추가되었습니다.`);
        }
    }
}