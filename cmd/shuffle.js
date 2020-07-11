const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "shuffle",
    alises: ["노ㅕㄹ릳", "섞어"],
    description: '재생 목록에 있는 노래를 섞어요.',
    category: 'music',
    usage: '/shuffle',
    run: async (client, message, args, ops) => {
        const player = client.musicManager.queue.get(message.guild.id)

        if (!player) return message.channel.send(ops.embed.musicError1)
        if (!message.member.voice.channel) return message.channel.send(ops.embed.musicError2)
        if (player && (message.member.voice.channelID !== player.voiceChannel.id)) return message.channel.send(ops.embed.musicError3(player))

        if (player.songs.length < 2) return message.channel.send(new MessageEmbed().setTitle("❌ 대기열이 2개 이상이어야 해요!").setColor(0xff0000))
        
        player.songs = [player.songs[0]].concat(player.songs.slice(1).sort(() => Math.random() - 0.5))
        message.channel.send(new MessageEmbed().setTitle("✅ 대기열이 섞어졌어요!").setColor(0x00ff00))
    }
}