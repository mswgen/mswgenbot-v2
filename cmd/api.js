const Discord = require('discord.js');
const axios = require('axios');
module.exports = {
    name: 'api',
    alises: ['api', '메ㅑ'],
    description: '봇의 api를 불러와 보여줘요.',
    category: 'crawling',
    usage: '/api',
    run: async function (client, message, args, option) {
        let m = await message.channel.send(new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} ${client.user.username} API 로딩 중`)
            .setColor(0xffff00)
            .setTimestamp()
        );
            axios.post('https://bot.mswgen.ga/api/info').then(async function (res) {
                if (res.status == 200) {
                    console.log(res.data.toString());
                    await m.edit(new Discord.MessageEmbed()
                        .setTitle(`${client.user.username} API`)
                        .setColor(0x00ffff)
                        .setThumbnail(client.user.displayAvatarURL({
                            dynamic: true,
                            size: 2048,
                            format: 'jpg'
                        }))
                        .setFooter(message.author.tag, message.author.avatarURL({
                            dynamic: true,
                            size: 2048,
                            format: 'jpg'
                        }))
                        .setTimestamp()
                        .setDescription(`\`\`\`js
{
    ping: ${res.data.ping},
    displayAvatarURL: '${res.data.displayAvatarURL}',
    uptime: ${res.data.uptime},
    user: {
        id: '${res.data.user.id}',
        bot: ${res.data.user.bot},
        discriminator: '${res.data.user.discriminator}',
        avatar: '${res.data.user.avatar}',
        lastMessageChannelID: '${res.data.user.lastMessageChannelID}',
        verified: ${res.data.user.verified},
        mfaEnabled: ${res.data.user.mfaEnabled},
        createdTimestamp: ${res.data.user.createdTimestamp},
        defaultAvatarURL: '${res.data.user.defaultAvatarURL}',
        tag: '${res.data.user.tag}',
        avatarURL: '${res.data.user.avatarURL}',
        displayAvatarURL: '${res.data.user.displayAvatarURL}'
    }
}
\`\`\``)
                    );
                } else {
                    await m.delete().then(function () {
                        message.channel.send('api 정보를 받아오는 동안 에러가 발생하였어요.')
                    });
                }
            });
    }
}
