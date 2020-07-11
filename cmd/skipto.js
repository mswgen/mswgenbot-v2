const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "skipto",
    aliases: ["스킵투", "나ㅑㅔ새", "tmzlqxn"],
    description: '대기열에서 원하는 노래로 스킵해요.',
    category: 'music',
    usage: '/skipto <스킵할 노래의 대기열 내 순서>',
    run: async (client, message, args, ops) => {
        const player = client.musicManager.queue.get(message.guild.id)

        if (!player) return message.channel.send(ops.embed.musicError1)
        if (!message.member.voice.channel) return message.channel.send(ops.embed.musicError2)
        if (player && (message.member.voice.channelID !== player.voiceChannel.id)) return message.channel.send(ops.embed.musicError3(player))
        
        if (!player.playing) player.playing = true

        if (args[1] > player.songs.length || args[1] < 0 || isNaN(args[1]) || args[1].includes(".")) return message.channel.send(new MessageEmbed().setDescription(`❌ **${args[1]}**으로 스킵할 수 없어요.`).setColor(0xFF0000))

        player.songs.splice(0, parseInt(args[1] - 1))
        player.skip()
    }
}