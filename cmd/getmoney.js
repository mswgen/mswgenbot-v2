const Discord = require('discord.js');
const fs = require('fs');
const time = new Discord.Collection();
module.exports = {
    name: 'getmoney',
    alises: ['돈받기', 'getmoney', 'get-money', '돈내놔'],
    description: '돈을 받아요.',
    category: 'play',
    usage: '/돈받기',
    run: async function (client, message, args, option) {
        if (!time.get(message.author.id)) {
            time.set(message.author.id, 0);
        }
        const money = (await client.dbs.money.getAll()).slice();
        if (!money.find(x => x.key == message.author.id)) {
            money.push({key: message.author.id, value: 0})
        }
        if (time.get(message.author.id) != 0) return message.channel.send(`${time.get(message.author.id)}초 뒤에 시도해 주세요`);
        var add = Math.floor(Math.random() * 1000) + 1;
        if (money.find(x => x.key == message.author.id)) {
            await client.dbs.money.delete(message.author.id);
        }
        client.dbs.money.set(message.author.id, parseInt((money.find(x => x.key == message.author.id).value) || 0) + add).then(async () => {
            const embed = new Discord.MessageEmbed()
                .setTitle('돈을 받았어요!')
                .addField('받은 돈', `${add}원`, true)
                .addField('현재 돈', `${await client.dbs.money.get(message.author.id)}원`, true)
                .setColor(0x00ffff)
                .setThumbnail(message.author.avatarURL({
                    dynamic: true
                }))
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            message.channel.send(embed);
            time.set(message.author.id, 600);
        });
        setInterval(function () {
            time.forEach(function (x) {
                time.set(time.findKey(a => a == x), x - 1);
            });
        }, 1000);
    }
}