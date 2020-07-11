const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "nowplaying",
    alises: ["np", "ㅞ", "now-playing", "nowplay", "ㅜㅐ제ㅣ묘ㅑㅜㅎ", "현재음악", "현재곡", "guswodmadkr", "gusworhr", "지금곡", "wlrmarhr", "지금음악", "wlrmadmadkr", "지금노래", "wlrmashfo", "현재노래", "guswoshfo"],
    description: '현재 재생중인 노래를 보여줘요.',
    category: 'music',
    usage: '/nowplaying',
    run: async (client, message, args, ops) => {
        const player = client.musicManager.queue.get(message.guild.id)

        if (!player) return message.channel.send(ops.embed.musicError1)

        const song = player.songs[0]

        message.channel.send(new MessageEmbed().setThumbnail(`https://img.youtube.com/vi/${song.info.identifier}/mqdefault.jpg`).setTitle(song.info.title).setURL(song.info.uri).setDescription(`**${player.playing ? "🎶 재생 중" : "⏸ 일시 정지됨"}**\n\n추가한 사람: **${song.requestedBy.tag}**\n채널: **${song.info.author}**\n\n\`${player.songProgress()}\`\n${player.duration(player.player.state.position)} / ${player.duration(song.info.length)} (${player.percent()}%)`).setColor(0x00FF00))
    }
}