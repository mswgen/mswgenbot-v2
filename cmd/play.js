const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "play",
    alises: ["플레이", "재생", "ㅔㅣ묘", "vmffpdl", "wotod", "pla", "pl"],
    description: '유튜브에서 노래를 검색해 재생해요.',
    category: 'music',
    usage: '/play <노래 제목>',
    run: async (client, message, args, ops) => {
        const player = client.musicManager.queue.get(message.guild.id)

        if (!message.guild.me.hasPermission("CONNECT")) return message.channel.send(new MessageEmbed().setDescription("❌ 음성 채널에 들어갈 수 있는 권한이 필요해요! (CONNECT 권한)").setColor(0xFF0000))
        if (!message.guild.me.hasPermission("SPEAK")) return message.channel.send(new MessageEmbed().setDescription("❌ 음성 채널에서 말할 수 있는 권한이 필요해요! (SPEAK 권한)").setColor(0xFF0000))
        
        if (!message.member.voice.channel) return message.channel.send(ops.embed.musicError2)
        if (player && (message.member.voice.channelID !== player.voiceChannel.id)) return message.channel.send(ops.embed.musicError3(player))
        
        if (!args.slice(1).join(' ')) return message.channel.send(new MessageEmbed().setColor(0xFF0000).setDescription(`❌ 재생할 노래의 이름 또는 URL을 입력해 주세요!`))

        const song = await client.musicManager.queue.get(args.slice(1).join(' ')) || await client.musicManager.getSongs(`ytsearch: ${args.slice(1).join(' ')}`)
        const embed = new MessageEmbed()
        .setTitle('노래 선택')
        .setColor(0xffff00)
        .setDescription(`재생할 노래의 번호를 숫자만 입력해주세요`)
        .setFooter(message.author.tag, message.author.avatarURL())
        .setTimestamp()
        let i = 0;
        for (let x of song.slice(0, 10)) {
            i++;
            embed.setDescription(`${embed.description}
${i}. [${x.info.title} - ${x.info.author}](${x.info.uri})`)
        }
        let m = await message.channel.send(embed)
        const filter = msg => msg.author.id == message.author.id && !isNaN(parseInt(msg.content)) && parseInt(msg.content) <= 10 && parseInt(msg.content) >= 1;
        const collector = m.channel.createMessageCollector(filter, {
            max: 1
        });
        collector.on('end', collected => {
            client.musicManager.handleVideo(message, message.member.voice.channel, song[parseInt(collected.first().content)- 1])
        });
    }
}