const Discord = require('discord.js');
module.exports = {
    name: "ping",
    alises: ['핑', 'ping'],
    description: '봇의 현재 핑(지연 시간)을 보여줍니다.',
    run: async function (client, message, args, option) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} Pinging...`)
            .setColor(0xffff00)
            .setTimestamp()
        let m = await message.channel.send(embed);
        const embed2 = new Discord.MessageEmbed()
            .setTitle('PONG!')
            .setColor(0x00ffff)
            .setThumbnail('https://i.imgur.com/1Gk4tOj.png')
            .addField('Latency', `${m.createdAt - message.createdAt}ms`)
            .addField('API Latency', `${client.ws.ping}ms`)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        m.edit(embed2);
    }
}