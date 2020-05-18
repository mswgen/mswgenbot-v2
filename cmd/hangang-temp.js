const Discord = require('discord.js');
const axios = require('axios');
module.exports = {
    name: 'hangang_temp',
    alises: ['한강', '한강온도', '한강수온', 'hangang', 'hangang-temperture', 'hangang-temp'],
    description: '한강의 수온을 보여줘요.',
    run: async function (client, message, args, option) {
        axios.post('http://hangang.dkserver.wo.tc/').then(function (x) {
            message.channel.send(
                new Discord.MessageEmbed()
                    .setTitle('한강 수온')
                    .setDescription((parseInt(x.data.temp) + "℃"))
                    .setColor(0x00ffff)
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL({
                        dynamic: true
                    }))
            );
        });
    }
}