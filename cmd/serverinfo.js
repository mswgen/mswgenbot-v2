const Discord = require('discord.js');
const fn = require('../functions.js')
var verify = {
    NONE: '없음',
    LOW: '낮음',
    MEDIUM: '보통',
    HIGH: '높음',
    VERY_HIGH: '매우 높음'
};
var filter = {
    DISABLED: '미디어 콘텐츠를 스캔하지 않음',
    MEMBERS_WITHOUT_ROLES: '역할 없는 멤버의 미디어 콘텐츠를 스캔함',
    ALL_MEMBERS: '모든 멤버의 미디어 콘텐츠를 스캔함'
};
var notify = {
    ALL: '모든 알림',
    MENTIONS: '@mentions만'
};
var mfa = {
    0: '필요하지 않음',
    1: '필요함'
}
module.exports = {
    name: 'serverinfo',
    alises: ['서버정보', '정보서버', 'server-info', 'serverinfo'],
    description: '메세지를 입력한 서버의 정보를 알려줍니다.',
    run: async function (client, message, args, option) {
        const imbed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 서버 정보를 받아오는 중...`)
            .setTimestamp()
            .setColor(0xffff00)
        let m = await message.channel.send(imbed);
        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.guild.name} 정보`)
            .setColor(0x00ffff)
            .setThumbnail(message.guild.iconURL({
                dynamic: true
            }))
            .addField('서버 이름', message.guild.name, true)
            .addField('서버 주인', `${message.guild.owner.user}`, true)
            .addField('서버 생성일', fn.parseDate(message.guild.createdAt), true)
            .addField('서버 인원 수', `${message.guild.memberCount}명(유저: ${message.guild.members.cache.filter(x => !x.user.bot).size}명, 봇: ${message.guild.members.cache.filter(x => x.user.bot).size}개)`, true)
            .addField('서버 부스트 레벨', message.guild.premiumTier, true)
            .addField('서버 위치', message.guild.region, true)
            .addField('서버 보안 레벨', verify[message.guild.verificationLevel], true)
            .addField('서버 관리 2단계 인증 필수 여부', mfa[message.guild.mfaLevel], true)
            .addField('기본 알림 설정', notify[message.guild.defaultMessageNotifications], true)
            .addField('서버 인증 여부', fn.isVerified(message.guild), true)
            .addField('시스템 메세지 채널', `${message.guild.systemChannel}` || '없음', true)
            .addField('잠수 채널 이름', fn.hasAFK(message.guild), true)
            .addField('잠수 시간', `${message.guild.afkTimeout / 60}분`, true)
            .addField('유해 미디어 콘텐츠 필터', filter[message.guild.explicitContentFilter], true)
            .setImage(message.guild.splashURL({
                dynamic: true
            }))
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        m.edit(embed);
        const ymbed = new Discord.MessageEmbed()
            .setTitle(`${message.guild.name} 서버의 역할(${message.guild.roles.cache.size - 1}개)`)
            .setColor(0x00ffff)
            .setTimestamp()
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
        var x = new Array();
        message.guild.roles.cache.forEach(function (i) {
            if (i.id != message.guild.roles.everyone.id) {
                x.push(`${i}`);
            }
        });
        x = x.join(', ');
        if (x.length > 1900) {
            x = `${x.substr(0, 1900)}...`
        }
        ymbed.setDescription(x);
        message.channel.send(ymbed);
        const emved = new Discord.MessageEmbed()
            .setTitle(`${message.guild.name} 서버의 이모지(${message.guild.emojis.cache.size}개)`)
            .setColor(0x00ffff)
            .setTimestamp()
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
        emved.setDescription(message.guild.emojis.cache.map(x => x.toString()).join(' '));
        message.channel.send(emved);
    }
}