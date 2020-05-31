const Discord = require('discord.js');
const axios = require('axios');
const fn = require('../functions.js');
module.exports = {
    name: 'repo',
    alises: ['레포', 'repo', 'repository', '레포지토리'],
    description: '깃허브 레포지토리의 정보를 불러와요.',
    category: 'crawling',
    usage: '/레포 <레포지토리 이름>',
    run: async function (client, message, args, option) {
        args = args.slice(1).join('/').split('/');
        if (!args[0]) return message.channel.send('정보를 가져올 레포지토리 주인의 닉네임을 입력해주세요.');
        if (!args.slice(1).join('/')) return message.channel.send('정보를 가져올 레포지토리 이름을 입력해주세요.');
        let m = await message.channel.send(new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 깃허브 레포지토리 ${args[0]}/${args.slice(1).join('/')} 검색 중`)
            .setColor(0xffff00)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true,
                size: 2048,
                format: 'jpg'
            }))
            .setTimestamp()
        );
        axios.get(`https://api.github.com/repos/${args[0]}/${args.slice(1).join('/')}`, {
            validateStatus: () => true
        }).then(async function (response) {
            if (response.status != 200) {
                m.edit(new Discord.MessageEmbed()
                    .setTitle('레포지토리 검색 실패...')
                    .setColor(0xff0000)
                    .setDescription(`${args[0]}/${args.slice(1).join('/')}의 정보를 찾을 수 없어요.`)
                    .setFooter(message.author.tag, message.author.avatarURL({
                        dynamic: true,
                        size: 2048,
                        format: 'jpg'
                    }))
                    .setTimestamp()
                );
            } else {
                var data = response.data;
                const embed = new Discord.MessageEmbed()
                .setTitle('레포지토리 검색 결과')
                .setColor(0x000000)
                .setThumbnail(data.owner.avatar_url)
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true,
                    size: 2048,
                    format: 'jpg'
                }))
                .setTimestamp()
                .addField('레포지토리 이름', data.name, true)
                .addField('레포지토리 id', data.id, true)
                .addField('레포지토리 주인', `[${data.owner.login}(${data.owner.id})](${data.owner.html_url})`, true)
                .addField('레포지토리 설명', data.description || '없음')
                .addField('레포지토리 생성일', fn.parseDate(new Date(data.created_at.replace(/Z/gi, '+09:00'))), true)
                .addField('주요 언어', data.language || '없음', true)
                .addField('Star 수', `${data.stargazers_count}명`, true)
                .addField('Watch 수', `${data.subscribers_count}명`, true)
                .addField('Fork 수', `${data.forks}번`, true);
                if (data.license) {
                    embed.addField('라이센스', data.license.name, true);
                } else {
                    embed.addField('라이센스', '없음', true);
                }
                embed.addField('클론 URL', data.clone_url, true);
                embed.setAuthor(data.full_name, 'https://cdn.discordapp.com/emojis/690156550056181788.png?v=1', data.html_url);
                await m.edit(embed);
            }
        });
    }
}