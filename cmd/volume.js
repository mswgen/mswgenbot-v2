const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "volume",
    alises: ["vol", "볼륨", "사운드", "소리", "setvolume", "qhffba", "tkdnsem"],
    description: '현재 볼륨을 보거나 볼륨을 바꿔요.',
    category: 'music',
    usage: '/volume [볼륨 변경 시 변경할 볼륨]',
    run: async (client, message, args, ops) => {
        const player = client.musicManager.queue.get(message.guild.id)

        if (!player) return message.channel.send(ops.embed.musicError1)
        if (!message.member.voice.channel) return message.channel.send(ops.embed.musicError2)
        if (player && (message.member.voice.channelID !== player.voiceChannel.id)) return message.channel.send(ops.embed.musicError3(player))

        if (!args[1]) return message.channel.send(`현재 볼륨은 **\`${player.volume}%\`** (이)에요!`)

        if (isNaN(args[1]) || args[1].includes(".") || parseInt(args[1]) <= 0 || parseInt(args[1]) > 100) return message.channel.send(new MessageEmbed().setDescription(`❌ 1 ~ 100 까지의 자연수만 입력해 주세요!`).setColor(0x00FF00))

        player.setVolume(parseInt(args[1].replace("%", "")))
        message.channel.send(`✅ 볼륨을 **\`${parseInt(args[1])}%\`**(으)로 변경했어요!`)
    }
}