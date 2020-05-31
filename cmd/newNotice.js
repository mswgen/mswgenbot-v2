const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'noticechannel',
    alises: ['공지설정', '공지채널설정', 'noticechannel', '공지채널'],
    description: "멘션한 채널을 봇의 공지 채널로 설정해요.(서버 관리 권한 필요)",
    category: 'admin',
    usage: '/공지설정 <채널 멘션 또는 공지채널을 없앨 때는 비워 두기>',
    run: async function (client, message, args, option) {
        if (!message.member.hasPermission('MANAGE_GUILD') && !option.ownerId.includes(message.author.id)) return message.channel.send('서버 관리 권한이 필요해요.');
        var ch;
        if (message.mentions.channels.first()) {
            ch = message.mentions.channels.first();
        } else {
            ch = null;
        }
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 공지채널 등록 중`)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .setColor(0xffff00)
            .addField('공지 채널 이름', ch.name || '없음', true)
            .addField('공지 채널이 속한 서버 이름', message.guild.name, true)
            .addField('진행 상황', '공지 파일을 가져오는 중', true)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        let m = await message.channel.send(embed);
        const notice = require('../assets/notice.json');
        if (!notice.channels[message.guild.id]) {
            notice.channels[message.guild.id] = '0';
        }
        const imbed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 공지채널 등록 중`)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .setColor(0xffff00)
            .addField('공지 채널 이름', ch.name || '없음', true)
            .addField('공지 채널이 속한 서버 이름', message.guild.name, true)
            .addField('진행 상황', '공지 파일을 수정하는 중', true)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        m.edit(imbed);
        if (ch) {
            notice.channels[message.guild.id] = ch.id;
        } else {
            delete notice.channels[message.guild.id]
        }
        fs.writeFile('./assets/notice.json', JSON.stringify(notice), function (err) {
            if (err) console.log(err);
            const ymbed = new Discord.MessageEmbed()
                .setTitle(`공지채널을 등록했어요.`)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .setColor(0x00ffff)
                .addField('공지 채널 이름', ch.name || '없음', true)
                .addField('공지 채널이 속한 서버 이름', message.guild.name, true)
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            m.edit(ymbed);
        });
    }
}