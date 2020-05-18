const Discord = require('discord.js');
module.exports = {
    name: 'channelinfo',
    alises: ['채널정보', '정보채널', 'channel-info', 'channelinfo'],
    description: '멘션한 채널의 정보를 보여줘요. ',
    run: async function (client, message, args, option) {
        var ch = null;
        if (message.mentions.channels.first()) {
            ch = message.mentions.channels.first();
        } else if (message.guild.channels.cache.find(x => x.name.startsWith(args.slice(1).join(' ')))) {
            ch = message.guild.channels.cache.find(x => x.name.startsWith(args.slice(1).join(' ')));
        } else if (message.guild.channels.cache.find(x => x.name.endsWith(args.slice(1).join(' ')))) {
            ch = message.guild.channels.cache.find(x => x.name.endsWith(args.slice(1).join(' ')));
        }
        if (!ch) {
            return await message.channel.send('채널 멘션이나 채널 이름을 써 주세요');
        }
        var types = {
            text: '채팅 채널',
            voice: '음성 채널',
            news: '공지 채널',
            store: '스토어 채널',
            category: '카테고리'
        }
        const embed = new Discord.MessageEmbed()
            .setTitle(`${ch.name} 정보`)
            .setColor(0x00ffff)
            .addField('채널 이름', ch.name, true)
            .addField('채널 타입', types[ch.type], true)
            .addField('채널 id', ch.id, true);
        if (ch.parent) {
            embed.addField('채널이 속한 카테고리', ch.parent.name);
        } else {
            embed.addField('채널이 속한 카테고리', '없음');
        }
        if (ch.type == 'text') {
            await embed.addField('채널 주제', ch.topic || '없음', true)
                .addField('채널 순서', ch.position, true)
                .addField('NSFW 여부', ch.nsfw, true)
                .addField('슬로우 모드', `${ch.rateLimitPerUser.toString().replace(/0/gi, '없음')}`, true);
        } else if (ch.type == 'voice') {
            embed.addField('최대 유저 수', ch.userLimit.toString().replace(/0/gi, '제한 없음'), true)
                .addField('비트레이트', `${ch.bitrate / 1000} kb/s`, true)
                .addField('채널 순서', ch.position, true);
        } else if (ch.type == 'category') {
            embed.addField('카테고리에 속한 채널 수', ch.children.size, true)
                .addField('채널 순서', ch.position, true);
        } else if (ch.type == 'news') {
            embed.addField('채널 주제', ch.topic || '없음', true)
                .addField('채널 순서', ch.position, true)
                .addField('NSFW 여부', ch.nsfw, true)
                .addField('슬로우 모드', `${ch.rateLimitPerUser.toString().replace(/0/gi, '없음')}`, true);
        } else if (ch.type == 'store') {
            embed.addField('채널 주제', ch.topic || '없음', true)
                .addField('채널 순서', ch.position, true)
                .addField('NSFW 여부', ch.nsfw, true);
        }
        embed.setFooter(message.author.tag, message.author.avatarURL({
            dynamic: true,
            size: 2048,
            format: 'jpg'
        }))
            .setTimestamp();
        await message.channel.send(embed);
    }
}