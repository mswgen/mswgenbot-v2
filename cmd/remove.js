const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "remove",
    alises ["제거", "wprj", "ㄱ드ㅐㅍㄷ"],
    description: '재생목록에서 노래를 지워요.',
    category: 'music',
    usage: '/remove <대기열에서 지울 음악의 순서>',
    run: async (client, message, args, ops) => {
        const player = client.musicManager.queue.get(message.guild.id)
        
        if (!player) return message.channel.send(ops.embed.musicError1)
        if (!message.member.voice.channel) return message.channel.send(ops.embed.musicError2)
        if (player && (message.member.voice.channelID !== player.voiceChannel.id)) return message.channel.send(ops.embed.musicError3(player))

        if (!player.playing) player.playing = true

        if (args[1] > player.songs.length || args[1] < 0 || isNaN(args[1]) || args[1].includes(".")) return message.channel.send(new MessageEmbed().setDescription(`❌ **${args[1]}**번째 대기열을 제거할 수 없어요.`).setColor(0xFF0000))

        player.songs.splice(parseInt(args[1]), 1)
        message.channel.send(new MessageEmbed().setDescription(`✅ **${args[1]}**번째 음악이 제거되었어요!`).setColor(0x00FF00))
    }
}