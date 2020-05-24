const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'prefix',
    alises: ['접두사', '프리픽스', 'prefix'],
    description: '서버의 접두사를 바꿔요. (서버 관리 권한 필요)',
    run: async function (client, message, args, option) {
        if (!message.member.hasPermission('MANAGE_GUILD')) return await message.channel.send('서버 관리 권한이 필요해요.');
        option.prefix[message.guild.id] = args[1];
        fs.writeFile('./assets/config.json', JSON.stringify(option), async () => {
            const embed = new Discord.MessageEmbed()
                .setTitle('서버의 접두사를 변경했어요')
                .setColor(0x00ffff)
                .setDescription(`이제 이 서버의 접두사는 \`${option.prefix[message.guild.id]}\`에요!`)
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true,
                    format: 'jpg',
                    size: 2048
                }))
                .setTimestamp()
                .setThumbnail(message.guild.iconURL({
                    dynamic: true,
                    format: 'jpg',
                    size: 2048
                }));
            await message.channel.send(embed);
        });
    }
}