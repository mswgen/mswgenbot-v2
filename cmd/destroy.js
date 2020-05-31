const Discord = require('discord.js');
module.exports = {
    name: 'destroyServer',
    alises: ['폭파', '서버폭파', 'destroy', 'serverdestroy', 'explode'],
    description: '서버를 폭파시켜요<ㅍㅍㅍㅍㅍㅍ(당연히 서버 관리자만 가능)',
    category: 'admin',
    usage: '/폭파',
    run: async function (client, message, args, option) {
        if (!message.member.hasPermission('MANAGE_GUILD')) return await message.channel.send('서버 관리자만 서버를 폭파시킬 수 있어요!');
        const embed = new Discord.MessageEmbed()
        .setTitle('정말 서버를 폭파할까요?')
        .addField('복구 여부', '불가능')
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
                    .setTitle('서버 폭파가 취소되었어요');
                    await m.edit(embed);
                    return;
                }
                await embed.setColor(0xff0000)
                .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 서버 폭파 중`)
                .addField('모든 채널 삭제', `${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 진행 중`, true);
                await m.edit(embed);
                m.guild.channels.cache.filter(x => x.id != m.channel.id).forEach(async function (ch) {
                    await ch.delete();
                });
                await embed.spliceFields(embed.fields.length - 1, 1)
                .addField('모든 채널 삭제', `${client.emojis.cache.find(x => x.name == 'botLab_done')} 완료`, true)
                .addField('모든 역할 삭제', `${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 진행 중`, true)
                await m.edit(embed);
                m.guild.roles.cache.forEach(async function (r) {
                    await r.delete();
                });
                await embed.spliceFields(embed.fields.length - 1, 1)
                .addField('모든 역할 삭제', `${client.emojis.cache.find(x => x.name == 'botLab_done')} 완료`, true)
                .addField('서버 이름 변경', `${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 진행 중`, true)
                await m.edit(embed);
                await m.guild.setName('폭파된 서버');
                await embed.spliceFields(embed.fields.length - 1, 1)
                .addField('서버 이름 변경', `${client.emojis.cache.find(x => x.name == 'botLab_done')} 완료`, true)
                .addField('서버 아이콘 삭제', `${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 진행 중`, true)
                await m.edit(embed);
                await m.guild.setIcon(null);
                await embed.spliceFields(embed.fields.length - 1, 1)
                .addField('서버 아이콘 삭제', `${client.emojis.cache.find(x => x.name == 'botLab_done')} 완료`, true)
                .addField('모든 이모지 삭제', `${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 진행 중`, true)
                await m.edit(embed);
                m.guild.emojis.cache.forEach(async function (e) {
                    await e.delete();
                })
                await embed.spliceFields(embed.fields.length - 1, 1)
                .addField('모든 이모지 삭제', `${client.emojis.cache.find(x => x.name == 'botLab_done')} 완료`, true)
                .addField('모든 멤버 차단', `${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 진행 중`, true)
                await m.edit(embed);
                m.guild.members.cache.filter(x => x.user.id != message.author.id && x.bannable).forEach(async function (member) {
                    await member.ban();
                });
                await embed.spliceFields(embed.fields.length - 1, 1)
                .addField('모든 멤버 차단', `${client.emojis.cache.find(x => x.name == 'botLab_done')} 완료`, true)
                .addField('모든 웹훅 삭제', `${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 진행 중`, true)
                await m.edit(embed);
                message.guild.fetchWebhooks().then(async function (h) {
                    await h.forEach(async function (hook) {
                        await hook.delete();
                    });
                    await embed.setTitle(`${client.wmojis.cache.find(X => x.name == 'botLab_done')} 서버 폭파 완료`)
                    spliceFields(embed.fields.length - 1, 1)
                    .addField('모든 웹훅 삭제', `${client.emojis.cache.find(x => x.name == 'botLab_done')} 완료`, true)
                    await m.edit(embed);
                });
            });
        });
    }
}