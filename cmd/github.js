const Discord = require('discord.js');
const axios = require('axios');
const fn = require('../functions.js');
module.exports = {
    name: 'github',
    alises: ['깃허브', 'github'],
    description: '깃허브 유저의 정보를 불러와요.',
    run: async function (client, message, args, option) {
        var toGet = args.slice(1).join(' ');
        if (!toGet) return message.channel.send('정보를 가져올 유저의 닉네임을 입력해주세요.');
        let m = await message.channel.send(new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 깃허브 유저 ${toGet} 검색 중`)
            .setColor(0xffff00)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true,
                size: 2048,
                format: 'jpg'
            }))
            .setTimestamp()
        )
        axios.get(`https://api.github.com/users/${toGet}`).then(function (response) {
            if (response.status != 200) {
                m.edit(new Discord.MessageEmbed()
                    .setTitle('유저 검색 실패...')
                    .setColor(0xff0000)
                    .setDescription(`${toGet}의 정보를 찾을 수 없어요.`)
                    .setThumbnail('https://cdn.discordapp.com/emojis/690156550056181788.png?v=1')
                    .setFooter(message.author.tag, message.author.avatarURL({
                        dynamic: true,
                        size: 2048,
                        format: 'jpg'
                    }))
                    .setTimestamp()
                );
            } else {
                var data = response.data;
                m.edit(new Discord.MessageEmbed()
                    .setTitle('유저 검색 결과')
                    .setColor(0xffff00)
                    .setThumbnail(data.avatar_url)
                    .setFooter(message.author.tag, message.author.avatarURL({
                        dynamic: true,
                        size: 2048,
                        format: 'jpg'
                    }))
                    .setTimestamp()
                    .addField('닉네임', data.login, true)
                    .addField('유저 id', data.id, true)
                    .addField('계정 생성일', fn.parseDate(new Date(data.created_at.replace(/Z/gi, '+09:00'))), true)
                    .addField('유저 페이지 URL', data.html_url, true)
                    .addField('상태 메제지(bio)', data.bio || '없음', true)
                    .addField('유저 위치', data.location || '없음', true)
                    .addField('공개 레포지토리 수', `${data.public_repos}개`, true)
                    .addField('팔로워 수', `${data.followers}명`, true)
                    .addField('팔로우 중', `${data.following}명`, true)
                    .setAuthor(data.login, data.avatar_url, data.html_url)
                    .setFooter(message.author.tag, message.author.avatarURL({
                        dynamic: true,
                        size: 2048,
                        format: 'jpg'
                    }))
                    .setTimestamp()
                );
            }
        });
    }
}