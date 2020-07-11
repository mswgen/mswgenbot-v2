const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "scplay",
    aliases: ["사운드클라우드", "사클", "tkzmf", "sc", "tkdnsemzmffkdnem", "soundcloud", "ㄴ치묘", "내ㅕㅜㅇ치ㅐㅕㅇ", "soundcloudplay", "내ㅕㅜㅇ치ㅐㅕ에ㅣ묘"],
    description: '사운드클라우드에서 노래를 검색해 재생해요.',
    category: 'music',
    usage: '/scplay <노래 제목>',
    run: async (client, message, args, ops) => {
        const player = client.musicManager.queue.get(message.guild.id)

        if (!message.guild.me.hasPermission("CONNECT")) return message.channel.send(new MessageEmbed().setDescription("❌ 음성 채널에 들어갈 수 있는 권한이 필요해요! (CONNECT 권한)").setColor(0xFF0000))
        if (!message.guild.me.hasPermission("SPEAK")) return message.channel.send(new MessageEmbed().setDescription("❌ 음성 채널에서 말할 수 있는 권한이 필요해요! (SPEAK 권한)").setColor(0xFF0000))
        
        if (!message.member.voice.channel) return message.channel.send(ops.embed.musicError2)
        if (player && (message.member.voice.channelID !== player.voiceChannel.id)) return message.channel.send(ops.embed.musicError3(player))

        if (!args.slice(1).join(' ')) return message.channel.send(new MessageEmbed().setColor(0xFF0000).setDescription(`❌ 재생할 노래의 이름 또는 URL을 입력해 주세요!`))

        const song = await client.musicManager.getSongs(`scsearch: ${args.slice(1).join(' ')}`)
        if (!song[0]) return message.channel.send(new MessageEmbed().setDescription(`❌ **${args.slice(1).join(' ')}**(이)라는 노래를 찾을 수 없어요.`).setColor(0xFF0000))

        client.musicManager.handleVideo(message, message.member.voice.channel, song[0])
    }
}