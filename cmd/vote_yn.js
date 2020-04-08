const Discord = require('discord.js');
module.exports = {
    name: 'vote_yesAndNo',
    alises: ['찬반투표'],
    description: '찬반 비밀투표를 시작합니다.',
    run: async function (client, message, args, option) {
        if (!args[1]) return message.channel.send('투표 내용을 써 주세요.');
        var pros = new Discord.Collection();
        var cons = new Discord.Collection();
        const embed = new Discord.MessageEmbed()
            .setTitle(args.slice(1).join(' '))
            .setColor(0x00ffff)
            .setDescription(`현재 투표 현황: 찬성 0표, 반대 0표`)
            .setFooter(`${message.author.tag}님의 투표`, message.author.avatarURL({
                dynamic: true,
                size: 2048,
                format: 'jpg'
            }))
            .setTimestamp();
        message.channel.send(embed).then(async function (m) {
            await m.react('👍');
            await m.react('👎');
            await m.react('❌');
            const collector = m.createReactionCollector(function (reaction, user) {
                return !user.bot && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎' || reaction.emoji.name == '❌');
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
        });
    }
}