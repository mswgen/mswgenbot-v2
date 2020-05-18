const Discord = require('discord.js');
module.exports = {
    name: 'firework',
    alises: ['전체전송', 'firework', '파이어워크', '불꽃놀이', '략ㄷ재가'],
    description: '명령어를 입력한 서버의 모든 채널에 입력한 메세지를 전송해요.(봇 제작자만 가능, firework가 보내지지 않도록 하려면 채널 주제에 "nofirework" 를 포함해주세요.)',
    run: async function (client, message, args, option) {
        if (!option.ownerId.includes(message.author.id)) return;
        var toSend = args.slice(1).join(' ').toString();
        message.guild.channels.cache.filter(function (x) {
            return x.type == 'text' && x.topic.includes('nofirework');
        }).forEach(function (x) {
            x.send(toSend);
        });
    }
}