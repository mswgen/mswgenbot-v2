const Discord = require('discord.js');
module.exports = {
    name: 'username',
    alises: ['이름변경', '닉네임변경', 'username', 'nickname', 'ㅕㄴㄷ구믇', 'ㅜㅑ차ㅜ믇', '닉네임', 'slrspdla', 'dlfmaqusrud', 'slrspdlaqusrud'],
    description: '봇의 닉네임을 변경합니다.(봇 제작자만 가능)',
    run: async function (client, message, args, option) {
        if (!option.ownerId.includes(message.author.id)) return;
        var arg = args.slice(1).join(' ');
        var olderName = client.user.username;
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 닉네임 변경 중`)
            .setColor(0xffff00)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .addField('기존 닉네임', olderName)
            .addField('새 닉네임', arg)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        let m = await message.channel.send(embed);
        client.user.setUsername(arg).then(function () {
            const imbed = new Discord.MessageEmbed()
                .setTitle(`닉네임 변경됨`)
                .setColor(0x00ffff)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .addField('기존 닉네임', olderName)
                .addField('새 닉네임', client.user.username)
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            m.edit(imbed);
        });
    }
}