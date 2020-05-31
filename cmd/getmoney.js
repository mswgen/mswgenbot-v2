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
        const money = require('../assets/money.json');
        if (!money[message.author.id]) {
            money[message.author.id] = 0;
        }
        if (time.get(message.author.id) != 0) return message.channel.send(`${time.get(message.author.id)}초 뒤에 시도해 주세요`);
        var add = Math.floor(Math.random() * 1000) + 1;
        money[message.author.id] += add;
        fs.writeFile('../assets/money.json', JSON.stringify(money), function (err) {
            const embed = new Discord.MessageEmbed()
                .setTitle('돈을 받았어요!')
                .addField('받은 돈', `${add}원`, true)
                .addField('현재 돈', `${money[message.author.id]}원`, true)
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