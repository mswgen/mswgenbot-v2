const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'reload',
    alises: ['reload', '리로드', 'ㄱ디ㅐㅁㅇ', 'ㄹㄹㄷ', 'ffe', 'flfhem'],
    description: '봇의 모든 커멘드 파일을 리로드합니다.(봇 제작자만 가능)',
    run: async function (client, message, args, option) {
        if (message.author.id != option.ownerId) return;
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 리로드 중`)
            .setColor(0xffff00)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .addField('진행 상황', '리로드할 파일을 읽는 중')
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        let m = await message.channel.send(embed);
        fs.readdir('./cmd/', function (err, list) {
            var i = 0;
            for (let x of list) {
                i++;
                delete require.cache[require.resolve(`${__dirname}/${x}`)];
                let pull = require(`./${x}`);
                const imbed = new Discord.MessageEmbed()
                    .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 리로드 중`)
                    .setColor(0xffff00)
                    .setThumbnail(client.user.displayAvatarURL({
                        dynamic: true
                    }))
                    .addField('진행 상황', '리로드 중')
                    .addField('진행도', `${i}/${list.length}개 파일 리로드 중`)
                    .addField('현재 파일', x)
                    .setFooter(message.author.tag, message.author.avatarURL({
                        dynamic: true
                    }))
                    .setTimestamp()
                m.edit(imbed);
            }
            const ymbed = new Discord.MessageEmbed()
                .setTitle(`리로드 완료`)
                .setColor(0x00ffff)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .addField('리로드한 파일 개수', list.length)
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            m.edit(ymbed);
        });
    }
}