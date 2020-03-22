const Discord = require('discord.js');
const os = require('os');
const fn = require('../functions.js');
module.exports = {
    name: 'botinfo', 
    alises: ['봇정보', 'botinfo', '정보봇', 'bot-info'],
    description: '이 봇의 정보를 보여줍니다.',
    run: async function (client, message, args, option) {
        let m = await message.channel.send(new Discord.MessageEmbed().setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 핑 측정 중...`).setTimestamp());
        const embed2 = new Discord.MessageEmbed()
            .setTitle(`${client.user.username} 정보`)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .setColor(0x00ffff)
            .addField('봇 이름', client.user.tag)
            .addField('봇 id', client.user.id)
            .addField('봇 개발 시작일', fn.parseDate(client.user.createdAt))
            .addField('개발자', client.users.cache.get('647736678815105037').tag)
            .addField('함께하는 서버 개수', `${client.guilds.cache.size}개`)
            .addField('함께하는 유저 수', `${client.users.cache.size}명`)
            .addField('현재 핑(지연 시간)', `${m.createdAt - message.createdAt}ms`)
            .addField('현재 핑(API 지연 시간)', `${client.ws.ping}ms`)
            .addField('봇 업타임', fn.countTime(client.uptime))
            .addField('플랫폼', process.platform)
            .addField('아키덱쳐', process.arch)
            .addField('RAM 사용량', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB`)
            .addField('CPU 모델', os.cpus()[0].model)
            .addField('CPU 코어 수', os.cpus().length)
            .addField('개발 언어', `${client.emojis.cache.find(x => x.name == 'js')} Javascript(Node.js)`)
            .addField(`Node.js 버전`, `${client.emojis.cache.find(x => x.name == 'node_js')} v.${process.versions.node}`)
            .addField('Discord.js 버전', `${client.emojis.cache.find(x => x.name == 'discord_js')} v.${Discord.version}`)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        m.edit(embed2);
    }
}
