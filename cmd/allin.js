const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'allin',
    alises: ['올인', 'allin', 'all-in'],
    description: '가지고 있는 돈을 모두 배팅합니다.',
    run: async function (client, message, args, option) {
        const money = require('../assets/money.json');
        if (!money[message.author.id] || money[message.author.id] == 0) {
            message.channel.send('현재 돈이 없습니다. 먼저 돈을 받아주세요.')
            return;
        }
        const filter = (reaction, user) => (reaction.emoji.name == '✅' || reaction.emoji.name == '❌') && user.id == message.author.id;
        let prompt = await message.channel.send(new Discord.MessageEmbed()
            .setTitle('올인 확인')
            .setThumbnail(message.author.avatarURL({
                dynamic: true
            }))
            .addField('성공 확률', '50%')
            .addField('성공 시 받는 돈의 배수', '2배')
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
                await setTimeout(function () {
                    ing.delete();
                    if (random == 0) {
                        money[message.author.id] *= 2;
                        fs.writeFile('../assets.money.json', JSON.stringify(money), function (err) {
                            const embed = new Discord.MessageEmbed()
                                .setTitle('올인 성공!')
                                .setColor(0x00ffff)
                                .setThumbnail(message.author.avatarURL({
                                    dynamic: true
                                }))
                                .addField('현재 가진 돈', `${money[message.author.id]}원`)
                                .setFooter(message.author.tag, message.author.avatarURL({
                                    dynamic: true
                                }))
                                .setTimestamp()
                            prompt.edit(embed);
                        });
                    } else {
                        money[message.author.id] = 0;
                        fs.writeFile('../assets.money.json', JSON.stringify(money), function (err) {
                            const embed = new Discord.MessageEmbed()
                                .setTitle('올인 실패...')
                                .setColor(0xff0000)
                                .setThumbnail(message.author.avatarURL({
                                    dynamic: true
                                }))
                                .addField('현재 가진 돈', `${money[message.author.id]}원`)
                                .setFooter(message.author.tag, message.author.avatarURL({
                                    dynamic: true
                                }))
                                .setTimestamp()
                            prompt.edit(embed);
                        });
                    }
                }, 5000)
            } else {
                prompt.edit(new Discord.MessageEmbed()
                    .setTitle('올인 포기')
                    .addField('가진 돈', money[message.author.id])
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