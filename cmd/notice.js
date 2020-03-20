const Discord = require('discord.js');
module.exports = {
    name: 'notice',
    alises: ['공지', 'notice', 'ㅜㅐ샻ㄷ'],
    description: '공지 채널로 등록된 모든 채널에 공지를 보냅니다.(봇 제작자만 가능)',
    run: async function (client, message, args, option) {
        var toSend = args.slice(1).join(' ');
        if (message.author.id != option.ownerId) return;
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 공지 전송 중`)
            .setColor(0xffff00)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .addField('전송할 내용', toSend)
            .addField('진행 중인 작업', '공지 채널을 불러오는 중')
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        let m = await message.channel.send(embed);
        const notice = require('../assets/notice.json');
        var i = 0;
        var a = 0;
        for (var x in notice.channels) {
            a++;
        }
        for (var x in notice.channels) {
            client.channels.cache.get(notice.channels[x]).send(new Discord.MessageEmbed()
                .setTitle(`${client.user.username} 공지`)
                .setColor(0x00ffff)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .setDescription(toSend)
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            );
            i++;
            const imbed = new Discord.MessageEmbed()
                .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 공지 전송 중`)
                .setColor(0xffff00)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .addField('전송할 내용', toSend)
                .addField('진행 중인 작업', `전송 중`)
                .addField('현재 진행도', `${i}/${a}개 채널 전송 완료`)
                .addField('현재 전송 중인 채널', `${client.channels.cache.get(notice.channels[x]).name}(${client.channels.cache.get(notice.channels[x]).id})`)
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            m.edit(imbed);
            const ymbed = new Discord.MessageEmbed()
                .setTitle(`공지 전송 완료`)
                .setColor(0x00ffff)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .addField('전송한 내용', toSend)
                .addField('전송한 채널 수', `${i}개`)
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            m.edit(ymbed);
        }
    }
}