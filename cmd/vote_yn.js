const Discord = require('discord.js');
module.exports = {
    name: 'vote_yesAndNo',
    alises: ['찬반투표'],
    description: '찬반 비밀투표를 시작해요. (마지막에 `%%<투표 시간을 초 단위로 입력>`을 넣으면 뒤에 입력한 시간(초) 후에 투표가 종료돼요)',
    category: 'other',
    usage: '/찬반투표 <주제>%%[투표 시간(초 단위)]',
    run: async function (client, message, args, option) {
        if (!args[1]) return message.channel.send('투표 내용을 써 주세요.');
        var pros = new Discord.Collection();
        var cons = new Discord.Collection();
        const embed = new Discord.MessageEmbed();
        embed.setTitle(args.slice(1).join(' ').split('%%')[0]);
            embed.setColor(0x00ffff)
            .setDescription(`현재 투표 현황: 찬성 0표, 반대 0표`)
            .setFooter(`${message.author.tag}님의 투표`, message.author.avatarURL({
                dynamic: true,
                size: 2048,
                format: 'jpg'
            }))
            .setTimestamp();
        var _time = 0;
        if (!isNaN(parseInt(args.join(' ').split('%%')[args.join(' ').split('%%').length - 1]))) {
            _time = parseInt(args.join(' ').split('%%')[args.join(' ').split('%%').length - 1]);
        } else {
            _time = 0;
        }
        if (_time != 0) {
            embed.setDescription(`투표 시간:${_time}초(투표 시작 시간 기준)`);
        }
        message.channel.send(embed).then(async function (m) {
            await m.react('👍');
            await m.react('👎');
            await m.react('❌');
            const collector = m.createReactionCollector(function (reaction, user) {
                return !user.bot && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎' || reaction.emoji.name == '❌');
            }, {
                    time: _time * 1000
            });
            collector.on('collect', async function (r, u) {
                await r.users.remove(client.users.cache.get(u.id));
                if (pros.get(u.id)) {
                    pros.delete(u.id);
                } else if (cons.get(u.id)) {
                    cons.delete(u.id);
                }
                if (r.emoji.name == '👍') {
                    pros.set(u.id, 'pros');
                } else if (r.emoji.name == '👎') {
                    cons.set(u.id, 'cons');
                }
                await embed.setDescription(`현재 투표 현황: 찬성 ${pros.size}표, 반대 ${cons.size}표`);
                await m.edit(embed);
            });
            collector.on('end', async function (collected) {
                await m.reactions.removeAll();
                const imbed = new Discord.MessageEmbed()
                    .setTitle(`투표 ${embed.title}이/가 종료되었어요`)
                    .setColor(0x00ffff)
                    .addField('투표 메세지 url', m.url, true);
                imbed.setFooter(`${message.author.tag}`, message.author.avatarURL({
                    dynamic: true,
                    size: 2048,
                    format: 'jpg'
                }))
                    .setTimestamp();
                if (pros.size > cons.size) {
                    imbed.addField('투표 결과', `찬성(찬성 ${pros.size}표, 반대 ${cons.size}표)`);
                } else if (pros.size < cons.size) {
                    imbed.addField('투표 결과', `반대(찬성 ${pros.size}표, 반대 ${cons.size}표)`);
                } else {
                    imbed.addField('투표 결과', `동점(각각 ${pros.size || cons.size}표)`);
                }
                await message.author.send(imbed);
                await embed.setTitle(`${embed.title}(종료됨)`);
                await m.edit(embed);
            });
        });
    }
}