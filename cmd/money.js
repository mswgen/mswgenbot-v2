const Discord = require('discord.js');
module.exports = {
    name: 'mymoney',
    alises: ['돈', 'money'],
    description: '현재 갖고 있는 돈을 보여줘요.',
    category: 'play',
    usage: '/돈',
    run: async function (client, message, args, option) {
        const money = require('../assets/money.json');
        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.author.username}님의 돈`)
            .setColor(0x00ffff)
            .addField('소유 중인 돈', `${money[message.author.id] || 0}원`, true)
            .setThumbnail(message.author.avatarURL({
                dynamic: true
            }))
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        message.channel.send(embed);
    }
}