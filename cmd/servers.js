const Discord = require('discord.js');
module.exports = {
    name: 'servers',
    alises: ['서버현황', 'servers'],
    description: '이 봇이 속해 있는 모든 서버 목록을 출력합니다.',
    run: async function (client, message, args, option) {
        let m = await message.channel.send(new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 서버 목록을 불러오는 중`)
            .setColor(0xffff00)
            .setTimestamp()
        );
        var a = '';
        var i = 1;
        client.guilds.cache.forEach(function (x) {
            a += `${i} | ${x.name}(${x.id}) | \`${x.owner.user.tag}\`
            `;
            i++;
        });
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.user.username} 서버 현황(${client.guilds.cache.size}개)`)
            .setColor(0x00ffff)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .setDescription(a)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        m.edit(embed);
    }
}