const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'allin',
    alises: ['올인', 'allin', 'all-in'],
    description: '가지고 있는 돈을 모두 배팅해요.',
    category: 'play',
    usage: '/올인',
    run: async function (client, message, args, option) {
        if (!(await client.dbs.money.get(message.author.id)) || (parseInt(await client.dbs.money.get(message.author.id))) == 0) {
            message.channel.send('현재 돈이 없어요. 먼저 돈을 받아주세요.')
            return;
        }
        const filter = (reaction, user) => (reaction.emoji.name == '✅' || reaction.emoji.name == '❌') && user.id == message.author.id;
        let prompt = await message.channel.send(new Discord.MessageEmbed()
            .setTitle('올인할까요?')
            .setThumbnail(message.author.avatarURL({
                dynamic: true
            }))
            .addField('성공 확률', '50%', true)
            .addField('성공 시 받는 돈의 배수', '2배', true)
            .setColor(0xffff00)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        );
        await prompt.react('✅');
        await prompt.react('❌');
        const collector = await prompt.createReactionCollector(filter, {
            time: 10000,
            max: 1
        });
        collector.on('end', async function (collected) {
            if (collected && collected.first().emoji.name == '✅') {
                var random = Math.floor(Math.random() * 2);
                var ing = await message.channel.send('올인 중...');
                setTimeout(async function () {
                    ing.delete();
                    const money = (await client.dbs.money.getAll()).slice();
                    if (random == 0) {
                        await client.dbs.money.delete(message.guild.id);
                        client.dbs.money.set(message.author.id, parseInt(money.find(x => x.key == message.author.id).value) * 2).then(async () => {
                            const embed = new Discord.MessageEmbed()
                                .setTitle('올인에 성공했어요!')
                                .setColor(0x00ffff)
                                .setThumbnail(message.author.avatarURL({
                                    dynamic: true
                                }))
                                .addField('현재 가진 돈', `${await client.dbs.money.get(message.author.id)}원`, true)
                                .setFooter(message.author.tag, message.author.avatarURL({
                                    dynamic: true
                                }))
                                .setTimestamp();
                            prompt.edit(embed);
                        });
                    }
                    else {
                        await client.dbs.money.delete(message.guild.id);
                        client.dbs.money.set(message.author.id, 0).then(async () => {
                            const embed = new Discord.MessageEmbed()
                                .setTitle('올인에 실패했어요...')
                                .setColor(0xff0000)
                                .setThumbnail(message.author.avatarURL({
                                    dynamic: true
                                }))
                                .addField('현재 가진 돈', `0원`, true)
                                .setFooter(message.author.tag, message.author.avatarURL({
                                    dynamic: true
                                }))
                                .setTimestamp();
                            prompt.edit(embed);
                        });
                    }
                }, 5000)
            } else {
                prompt.edit(new Discord.MessageEmbed()
                    .setTitle('올인을 포기했어요')
                    .addField('가진 돈', `${await client.dbs.money.get(message.author.id)}원`, true)
                    .setColor(0xffff00)
                    .setThumbnail(message.author.avatarURL({
                        dynamic: true
                    }))
                    .setFooter(message.author.tag, message.author.avatarURL({
                        dynamic: true
                    }))
                    .setTimestamp()
                )
            }
        });
        prompt.reactions.removeAll();
    }
}