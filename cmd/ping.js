const Discord = require('discord.js');
module.exports = {
    name: "ping",
    alises: ['핑', 'ping'],
    description: '봇의 현재 핑(지연 시간)을 보여줍니다.',
    run: async function (client, message, args, option) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 핑 측정 중...`)
            .setTimestamp()
        let m = await message.channel.send(embed);
        const embed2 = new Discord.MessageEmbed()
            .setTitle('퐁!')
            .setColor(0x00ffff)
            .setThumbnail('https://i.imgur.com/1Gk4tOj.png')
            .addField('지연 시간(ms)', m.createdAt - message.createdAt)
            .addField('API 지연 시간(ms)', client.ws.ping)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        m.edit(embed2);
    }
}