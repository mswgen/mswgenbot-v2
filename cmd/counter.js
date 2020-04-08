const Discord = require('discord.js');
module.exports = {
    name: 'counter',
    alises: ['counter', '카운터', '유저수'],
    description: '서버의 유저 수 카운터 음성 채널을 만듭니다. (서버 관리 권한 필요)',
    run: async function (client, message, args, option) {
        if (!message.member.hasPermission('MANAGE_GUILD') && !option.ownerId.includes(message.author.id)) return message.channel.send('서버 관리 권한이 필요합니다.');
        let m = await message.channel.send(new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} ${message.guild.name}의 유저 수 카운터 생성 중`)
            .setColor(0xffff00)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true,
                size: 2048,
                format: 'jpg'
            }))
            .setTimestamp()
        );
        if (message.guild.channels.cache.some(x => x.type == 'category' && x.name == `${message.guild.name}의 유저 수`)) {
            message.guild.channels.cache.find(x => x.type == 'category' && x.name == `${message.guild.name}의 유저 수`).children.forEach(async function (x) {
                await x.delete();
            });
            await message.guild.channels.cache.find(x => x.type == 'category' && x.name == `${message.guild.name}의 유저 수`).delete();
        }
        message.guild.channels.create(`${message.guild.name}의 유저 수`, {
            type: 'category'
        }).then(async function (ch) {
            await ch.setPosition(0);
            await message.guild.channels.create(`모든 유저 수: ${message.guild.memberCount}`, {
                type: 'voice',
                parent: ch
            });
            await message.guild.channels.create(`유저 수: ${message.guild.members.cache.filter(x => !x.user.bot).size}`, {
                type: 'voice',
                parent: ch
            });
            await message.guild.channels.create(`봇 수: ${message.guild.members.cache.filter(x => x.user.bot).size}`, {
                type: 'voice',
                parent: ch
            });
        }).then(async function () {
            await m.edit(new Discord.MessageEmbed()
                .setTitle(`${message.guild.name}의 유저 수 카운터 생성 완료`)
                .setColor(0x00ffff)
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true,
                    size: 2048,
                    format: 'jpg'
                }))
                .setThumbnail(message.guild.iconURL({
                    dynamic: true,
                    size: 2048,
                    format: 'jpg'
                }))
                .setTimestamp()
            );
        })
    }
}