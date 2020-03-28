const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'getmoney',
    alises: ['돈받기', 'getmoney', 'get-money', '돈내놔'],
    description: '돈을 받습니다.',
    run: async function (client, message, args, option) {
        const money = require('../assets/money.json');
        if (!money[message.author.id]) {
            money[message.author.id] = 0;
        }
        var add = Math.floor(Math.random() * 1000) + 1;
        money[message.author.id] += add;
        fs.writeFile('../assets/money.json', JSON.stringify(money), function (err) {
            const embed = new Discord.MessageEmbed()
                .setTitle('돈 받기 완료!')
                .addField('받은 돈', `${add}원`)
                .addField('현재 돈', `${money[message.author.id]}원`)
                .setColor(0x00ffff)
                .setThumbnail(message.author.avatarURL({
                    dynamic: true
                }))
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            message.channel.send(embed);
        });
    }
}