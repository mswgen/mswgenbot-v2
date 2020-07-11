const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "loop",
    aliases: ["루프", "뤂", "ㅣㅐㅐㅔ", "fnvm", "반복", "qksqhr"],
    description: '현재 노래 반복을 끄거나 켜요.',
    category: 'music',
    usage: '/loop',
    run: async (client, message, args, ops) => {
        const player = client.musicManager.queue.get(message.guild.id)

        if (!player) return message.channel.send(ops.embed.musicError1)
        if (!message.member.voice.channel) return message.channel.send(ops.embed.musicError2)
        if (player && (message.member.voice.channelID !== player.voiceChannel.id)) return message.channel.send(ops.embed.musicError3(player))

        player.loop = !player.loop
        
        message.channel.send(new MessageEmbed().setColor(0x00FF00).setDescription(`✅ ${player.loop ? "지금부터 현재 노래가 반복돼요!" : "지금부터 노래 반복이 되지 않아요!"}`))
    }
}