const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "queue",
    alises: ["que", "재생목록", "wotodahrfhr", "벼뎓", "대기열", "eorlduf"],
    description: '현재 재생목록을 보여줘요.',
    category: 'music',
    usage: '/queue',
    run: async (client, message, args, ops) => {
        const player = client.musicManager.queue.get(message.guild.id)

        if (!player) return message.channel.send(ops.embed.musicError1)

        let i = 0, song = player.songs[0]

        message.channel.send(new MessageEmbed().setColor(0x00FF00).setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(`**현재 재생 중인 곡**\n[${song.info.title}](${song.info.uri})\n\n**대기열**\n${player.songs[1] ? `${player.songs.map((songs) => `**${i++}.** [${songs.info.title}](${songs.info.uri})`).splice(1, 10).join("\n")}${player.songs.length > 11 ? `\n\n${player.songs.length - 11} more...` : ""}` : "없음"}`))
    }
};