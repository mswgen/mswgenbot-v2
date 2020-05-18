const Discord = require('discord.js');
const os = require('os');
const fn = require('../functions.js');
const arch = {
    x64: '64비트',
    x86: '32비트'
};
function getOs(client) {
    const os2 = {
        win32: `${client.emojis.cache.find(x => x.name == 'windows_logo')} Windows`,
        linux: `${client.emojis.cache.find(x => x.name == 'linux')} Linux`,
        darwin:`${client.emojis.cache.find(x => x.name == 'mac')} Mac`
    }
    return os2[process.platform];
}

module.exports = {
    name: 'botinfo', 
    alises: ['봇정보', 'botinfo', '정보봇', 'bot-info'],
    description: '이 봇의 정보를 보여줘요.',
    run: async function (client, message, args, option) {
        let m = await message.channel.send(new Discord.MessageEmbed().setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 핑 측정 중...`).setTimestamp());
        const embed2 = new Discord.MessageEmbed()
            .setTitle(`${client.user.username} 정보`)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .setColor(0x00ffff)
            .addField('봇 이름', client.user.tag, true)
            .addField('봇 id', client.user.id, true)
            .addField('봇 개발 시작일', fn.parseDate(client.user.createdAt), true)
            .addField('서버 추가일', fn.parseDate(message.guild.member(client.user).joinedAt), true)
            .addField('클라이언트 상태', fn.area(client.user), true)
            .addField('개발자', client.users.cache.get(option.ownerId[0]).tag, true)
            .addField('현재 게임, 상태 메세지 목록', fn.stat(client.user))
            .addField('함께하는 서버 개수', `${client.guilds.cache.size}개`, true)
            .addField('함께하는 유저 수', `${client.users.cache.size}명`, true)
            .addField('현재 핑(지연 시간)', `${m.createdAt - message.createdAt}ms`, true)
            .addField('현재 핑(API 지연 시간)', `${client.ws.ping}ms`, true)
            .addField('봇 업타임', fn.countTime(client.uptime))
            .addField('플랫폼', getOs(client) || process.platform, true)
            .addField('아키덱쳐', arch[process.arch] || process.arch, true)
            .addField('RAM 사용량', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB`, true)
            .addField('CPU 모델', os.cpus()[0].model)
            .addField('CPU 코어 수', os.cpus().length, true)
            .addField('개발 언어', `${client.emojis.cache.find(x => x.name == 'JS')} Javascript(Node.js)`)
            .addField(`Node.js 버전`, `${client.emojis.cache.find(x => x.name == 'node_js')} v.${process.versions.node}`, true)
            .addField('Discord.js 버전', `${client.emojis.cache.find(x => x.name == 'discord_js')} v.${Discord.version}`, true)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        m.edit(embed2);
    }
}
