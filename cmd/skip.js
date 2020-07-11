const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "skip",
    alises: ["스킵", "tmzlq"],
    description: '현재 노래를 스킵해요.',
    category: 'music',
    usage: '/skip',
    run: async (client, message, args, ops) => {
        const player = client.musicManager.queue.get(message.guild.id)
        
        if (!player) return message.channel.send(ops.embed.musicError1)
        if (!message.member.voice.channel) return message.channel.send(ops.embed.musicError2)
        if (player && (message.member.voice.channelID !== player.voiceChannel.id)) return message.channel.send(ops.embed.musicError3(player))
        
        if (!player.playing) player.playing = true

        player.skip()

        message.channel.send(new MessageEmbed().setColor(0x00FF00).setTitle("스킵 완료!").setDescription(`✅ **[${player.songs[0].info.title}](${player.songs[0].info.uri})**이(가) 스킵되었어요!`))
    }
}