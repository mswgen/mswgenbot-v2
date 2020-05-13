const Discord = require('discord.js');
module.exports = {
    name: 'destroyServer',
    alises: ['폭파', '서버폭파', 'destroy', 'serverdestroy', 'explode'],
    description: '서버를 폭파시킵니다<ㅍㅍㅍㅍㅍㅍ(당연히 서버 관리자만 가능)',
    run: async function (client, message, args, option) {
        if (!message.member.hasPermission('MANAGE_GUILD')) return await message.channel.send('서버 관리자만 서버를 폭파시킬 수 있어요!');
        const embed = new Discord.MessageEmbed()
        .setTitle('서버를 정말 폭파시킬까요?')
        .setDescription('한번 폭파시키면 복구할 수 없습니다. 신중히 결정해주세요.')
        .setColor(0xffff00)
        .setThumbnail(message.guild.iconURL({
            dynamic: true,
            format: 'jpg',
            size: 2048
        }))
        .setFooter(message.author.tag, message.author.avatarURL({
            dynamic: true,
            format: 'jpg',
            size: 2048
        }))
        .setTimestamp()
        await message.channel.send(embed).then(async function (m) {
            await m.react('✅');
            await m.react('❌');
            const filter = function (r, u) {
                return (r.emoji.name == '✅' || r.emoji.name == '❌') && u.id == message.author.id;
            }
            const collector = await m.createReactionCollector(filter, {
                time: 15000,
                max: 1
            });
            collector.on('end', async function (collected) {
                m.reactions.removeAll();
                if (!collected.first() || collected.first().emoji.name == '❌') {
                    await embed.setColor(0x00ffff)
                    .setTitle('서버 폭파 취소됨');
                    await m.edit(embed);
                    return;
                }
                await embed.setColor(0xff0000)
                .setTitle('서버 폭파 중')
                .setDescription('진행 상황: 모든 채널 삭제 중');
                await m.edit(embed);
                m.guild.channels.cache.filter(x => x.id != m.channel.id).forEach(async function (ch) {
                    await ch.delete();
                });
                await embed.setColor(0xff0000)
                .setTitle('서버 폭파 중')
                .setDescription('진행 상황: 모든 역할 삭제 중');
                await m.edit(embed);
                m.guild.roles.cache.forEach(async function (r) {
                    await r.delete();
                });
                await embed.setColor(0xff0000)
                .setTitle('서버 폭파 중')
                .setDescription('진행 상황: 서버 이름 변경 중');
                await m.edit(embed);
                await m.guild.setName('폭파된 서버');
                await embed.setColor(0xff0000)
                .setTitle('서버 폭파 중')
                .setDescription('진행 상황: 서버 아이콘 삭제 중');
                await m.edit(embed);
                await m.guild.setIcon(null);
                await embed.setColor(0xff0000)
                .setTitle('서버 폭파 중')
                .setDescription('진행 상황: 모든 이모지 삭제 중');
                await m.edit(embed);
                m.guild.emojis.cache.forEach(async function (e) {
                    await e.delete();
                })
                await embed.setColor(0xff0000)
                .setTitle('서버 폭파 중')
                .setDescription('진행 상황: 모든 멤버 차단 중');
                await m.edit(embed);
                m.guild.members.cache.filter(x => x.user.id != message.author.id).forEach(async function (member) {
                    await member.ban();
                });
                await embed.setColor(0xff0000)
                        .setTitle('서버 폭파 완료!')
                        .setDescription('진행 상황: 모든 웹훗 삭제 중');
                        await m.edit(embed);
                    });
            });
        });
    }
}