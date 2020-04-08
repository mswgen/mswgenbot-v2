const Discord = require('discord.js');
module.exports = {
    name: 'vote',
    alises: ['투표', 'vote', 'poll'],
    description: '비밀투표를 시작합니다.(항목을 10개까지 추가 가능, 투표명과 첫번째 항목, 각 항목은 $로 구분)',
    run: async function (client, message, args, option) {
        if (!args[1]) return message.channel.send('투표 내용을 써 주세요.');
        var items = args.slice(1).join(' ').split('$');
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
        });
    }
}