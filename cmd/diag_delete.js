const Discord = require('discord.js');
module.exports = {
    name: 'diag_delete',
    alises: ['자가진단삭제'],
    description: '자가진단 정보를 삭제해요.',
    category: 'crawling',
    usage: '/diag_delete',
    run: async (client, message, args, ops) => {
        if (!(await client.dbs.diag.get(message.author.id))) return message.channel.send('자가진단 정보가 등록되어있지 않아요.');
        const embed = new Discord.MessageEmbed()
            .setTitle('삭제 확인')
            .setDescription('자가진단 정보를 지울까요?')
            .setColor('RANDOM')
            .setTimestamp()
            .setFooter(message.author.tag, message.author.avatarURL())
        let m = await message.channel.send(embed);
        await m.react('✅');
        await m.react('❌');
        const filter = (reaction, user) => (reaction.emoji.name == '✅' || reaction.emoji.name == '❌') && user.id == message.author.id;
        const collector = m.createReactionCollector(filter, {
            max: 1,
            time: 30000
        });
        collector.on('end', async collected => {
            if (collected.first().emoji.name == '✅') {
                embed.setTitle('자가진단 정보를 삭제했어요.')
                .setDescription('')
                .setColor("RANDOM")
                .setTimestamp()
                await m.edit(embed);
                await client.dbs.diag.delete(message.author.id);
            } else {
                embed.setTitle('자가진단 정보 삭제가 취소되었어요.')
                .setDescription('')
                .setColor("RANDOM")
                .setTimestamp()
                await m.edit(embed);
            }
        });
    }
}