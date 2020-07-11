const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "loopqueue",
    alises: ["ㅣㅐㅐㅔ벼뎓", "queuerepeat", "qrepeat", "repeatq", "repeatqueue", "대기열반복", "eorldufqksqhr", "재생목록반복", "wotodahrfhrqksqhr", "loopqueue", "queueloop", "ㅣㅐㅐㅔ벼뎓", "벼뎌디ㅐㅐㅔ", "루프대기열", "fnvmeorlduf"],
    description: '현재 재생목록에 있는 노래 반복을 끄거나 켜요.',
    category: 'music',
    usage: '/loopqueue',
    run: async (client, message, args, ops) => {
        const player = client.musicManager.queue.get(message.guild.id)

        if (!player) return message.channel.send(ops.embed.musicError1)
        if (!message.member.voice.channel) return message.channel.send(ops.embed.musicError2)
        if (player && (message.member.voice.channelID !== player.voiceChannel.id)) return message.channel.send(ops.embed.musicError3(player))

        player.loopQueue = !player.loopQueue

        message.channel.send(new MessageEmbed().setColor(0x00FF00).setDescription(`✅ ${player.loopQueue ? "지금부터 대기열이 반복돼요!" : "지금부터 대기열 반복이 되지 않아요!"}`))
    }
}