const Discord = require('discord.js');
module.exports = {
    name: 'vote',
    alises: ['투표', 'vote', 'poll'],
    description: '비밀투표를 시작합니다.(항목은 10개까지 추가 가능, 투표명과 첫번째 항목, 각 항목은 $로 구분, 마지막에 `%%<투표 시간을 초 단위로 입력>`을 넣으면 뒤에 입력한 시간(초) 후에 투표가 종료됨)',
    run: async function (client, message, args, option) {
        if (!args[1]) return message.channel.send('투표 내용을 써 주세요.');
        var items = args.slice(1).join(' ').split('%%')[0].split('$');
        if (!items[1] || items.length > 10) return message.channel.send('투표 항목을 10개 이하로 써 주세요.');
        var polls = {};
        var reactions = {
            1: '1️⃣',
            2: '2️⃣',
            3: '3️⃣',
            4: '4️⃣',
            5: '5️⃣',
            6: '6️⃣',
            7: '7️⃣',
            8: '8️⃣',
            9: '9️⃣',
            10: '🔟'
        };
        const embed = new Discord.MessageEmbed()
            .setTitle(items[0])
            .setColor(0x00ffff)
            .setFooter(`${message.author.tag}님의 투표`, message.author.avatarURL({
                dynamic: true,
                size: 2048,
                format: 'jpg'
            }))
            .setTimestamp();
        var i = 0;
        for (var x of items.slice(1)) {
            i++;
            polls[i] = new Discord.Collection();
            embed.addField(`${i}번째 선택지`, `내용: **${x}**
현재 투표 수: 0표
`);
        }
        var _time = 0;
        if (!isNaN(parseInt(args.join(' ').split('%%')[args.join(' ').split('%%').length - 1]))) {
            _time = parseInt(args.join(' ').split('%%')[args.join(' ').split('%%').length - 1]);
        } else {
            _time = 0;
        }
        if (_time != 0) {
            embed.setDescription(`투표 시간:${_time}초(투표 시작 시간 기준)`);
        }
        await message.channel.send(embed).then(async function (m) {
            var vaild = new Array();
            vaild.push('❌');
            for (var x = 1; x < i + 1; x++) {
                await m.react(reactions[x]);
                await vaild.push(reactions[x]);
            }
            await m.react('❌');
            const collector = m.createReactionCollector(async function (r, u) {
                return !u.bot && vaild.includes(r.emoji.name);
            }, {
                    time: _time * 1000
            });
            collector.on('collect', async function (react, user) {
                if (user.bot) return;
                await react.users.remove(client.users.cache.get(user.id));
                for (var x in polls) {
                    if (x == vaild.indexOf(react.emoji.name) && !polls[x].get(user.id)) {
                        await polls[x].set(user.id, true);
                    } else {
                        await polls[x].delete(user.id)
                    }
                }
                await embed.spliceFields(0, embed.fields.length);
                i = 0;
                for (var x of items.slice(1)) {
                    i++;
                    await embed.addField(`${i}번째 선택지`, `내용: **${x}**
현재 투표 수: ${polls[i].size}표
`);    
                }
                await m.edit(embed);
            });
            collector.on('end', async function (collected) {
                await m.reactions.removeAll();
                const imbed = new Discord.MessageEmbed()
                    .setTitle(`투표 ${embed.title} 종료됨`)
                    .setColor(0x00ffff)
                    .addField('투표 메세지 url', m.url);
                imbed.setFooter(`${message.author.tag}`, message.author.avatarURL({
                    dynamic: true,
                    size: 2048,
                    format: 'jpg'
                }))
                    .setTimestamp();
                var toSort = polls;
                for (var x in toSort) {
                    toSort[x] = toSort[x].size;
                }
                var sorted = new Array();
                for (var x in toSort) {
                    sorted.push({
                        number: parseInt(toSort[x]),
                        content: items.slice(1)[x - 1]
                        });
                }
                sorted.sort(function (a, b) {
                    return b.number - a.number;
                });
                imbed.addField('투표 결과(동점이 있을 경우 부정확할 수 있습니다.)', `${sorted[0].content}(${sorted[0].number}표)`);
                await message.author.send(imbed);
                embed.setTitle(`${embed.title}(종료됨)`);
                await m.edit(embed);
            });
        });
    }
}