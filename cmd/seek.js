const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "seek",
    alises: ["ㄴㄷ다"],
    description: '현재 노래 안에서 스킵해요.',
    category: 'music',
    usage: '/seek <스킵할 시간>',
    run: async (client, message, args, ops) => {
        const player = client.musicManager.queue.get(message.guild.id);

        if (!player) return message.channel.send(ops.embed.musicError1);
        if (!message.member.voice.channel) return message.channel.send(ops.embed.musicError2)
        if (player && (message.member.voice.channelID !== player.voiceChannel.id)) return message.channel.send(ops.embed.musicError3(player))

        if (args[1].includes(".") || args[1].split(":").some(t => isNaN(t))) return message.channel.send(new MessageEmbed().setColor(0xff0000).setDescription(`❌ **${args[1]}**(으)로 스킵을 할 수 없어요.`))
        
        const seeked = player.seek(...args[1].split(":").reverse().map(t => parseInt(t)))

        message.channel.send(new MessageEmbed().setColor(0x00FF00).setDescription(`✅ **${[seeked]}**(으)로 스킵되었어요!`))
    }
}