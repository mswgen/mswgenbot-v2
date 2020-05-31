const Discord = require('discord.js');
const noInv = require('../assets/noInvite.json');
async function invite (client, guild) {
    var str = '';
    if (noInv.guilds[guild.id]) return str;
    if (guild.channels.cache.some(x => x.permissionsFor(client.user).has('CREATE_INSTANT_INVITE') && x.type == 'text' )) {
        await guild.channels.cache.filter(x => x.permissionsFor(client.user).has('CREATE_INSTANT_INVITE') && x.type == 'text').first().createInvite({
            maxAge: 0,
            maxUses: 0
        }).then(x => {
            str = ` | [들어가기](${x.url})`;
        });
    }
    return str;
}
module.exports = {
    name: 'servers',
    alises: ['서버현황', 'servers', '서버목록'],
    description: '이 봇이 속해 있는 모든 서버 목록을 출력해요.',
    category: 'info',
    usage: '/서버목록',
    run: async function (client, message, args, option) {
        let m = await message.channel.send(new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 서버 목록을 불러오는 중`)
            .setColor(0xffff00)
            .setTimestamp()
        );
        var _a = '';
        var __i = 1;
        for (var x of client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).array().slice(0, 5)) {
            var inv = await invite(client, x);
            _a += `${__i} | ${x.name}(ID: ${x.id}) | \`${x.memberCount}\`명 | 서버 주인: \`${x.owner.user.tag}\`${inv}
            `;
            __i++;
        }
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.user.username}(이)가 있는 서버 현황(총 ${client.guilds.cache.size}개)`)
            .setColor(0x00ffff)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .setDescription(_a)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        m.edit(embed).then(async function () {
            const filter = function (reaction, user) {
                return (reaction.emoji.name == '◀' || reaction.emoji.name == '▶') && user.id == message.author.id;
            }
            await m.react('◀');
            await m.react('▶');
            const collector = await m.createReactionCollector(filter, {
                time: 20000
            });
            var _i = 0;
            collector.on('collect', async function (c) {
                await c.users.remove(client.users.cache.get(message.author.id))
                if (c.emoji.name == '▶') {
                    _i += 5;
                } else {
                    _i -= 5;
                }
                if (_i < 0) {
                    _i += 5;
                    return;
                }
                if (_i >= client.guilds.cache.array().length) {
                    _i -= 5;
                    return;
                }
                await collector.resetTimer({
                    time: 20000
                });
                var a = '';
                var i = _i + 1;
                await m.edit(new Discord.MessageEmbed()
                    .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 서버 목록을 불러오는 중(시간이 몇십초 정도 걸려요)`)
                    .setColor(0xffff00)
                    .setTimestamp()
                );
                for (var x of client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).array().slice(_i, _i + 5)) {
                    var inv = await invite(client, x);
                    a += `${i} | ${x.name} (ID: ${x.id}) | \`${x.memberCount}\`명 | 서버 주인: \`${x.owner.user.tag}\`${inv}
                    `;
                    i++;
                }
                await embed.setDescription(a);
                await m.edit(embed);
            }).on('end', async function () {
                await m.reactions.removeAll();
            });
        });
    }
}