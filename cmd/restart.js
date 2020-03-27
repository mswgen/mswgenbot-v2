const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'restart',
    alises: ['재시작', 'restart', 'ㅈㅅㅈ', 'ㄱㄷㄴㅅㅁㄳ', 'wotlwkr'],
    description: '봇을 재시작합니다.(샤딩 없이 디버깅 중일 경우 종료됨, 봇 제작자만 가능)',
    run: async function (client, message, args, option) {
        if (message.author.id != option.ownerId) return;
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 재시작 중`)
            .setColor(0xffff00)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .addField('진행 상황', '환경 확인 중')
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        let m = await message.channel.send(embed);
        if (process.platform == 'linux' || client.shard) {
            const imbed = new Discord.MessageEmbed()
                .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 재시작 중`)
                .setColor(0xffff00)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .addField('진행 상황', '재시작 파일 수정 중')
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            m.edit(imbed);
            const restart = require('../assets/restart.json');
            restart.bool = true;
            restart.channel = message.channel.id;
            fs.writeFile('./assets/restart.json', JSON.stringify(restart), function (err) {
                if (err) console.log(err);
                const ymbed = new Discord.MessageEmbed()
                    .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 재시작 중`)
                    .setColor(0xffff00)
                    .setThumbnail(client.user.displayAvatarURL({
                        dynamic: true
                    }))
                    .addField('진행 상황', '재시작 중')
                    .setFooter(message.author.tag, message.author.avatarURL({
                        dynamic: true
                    }))
                    .setTimestamp()
                m.edit(ymbed).then(function () {
                    process.exit();
                });
            });
        } else {
            const imbed = new Discord.MessageEmbed()
                .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 종료 중`)
                .setColor(0xffff00)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .addField('진행 상황', '종료 중')
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            m.edit(imbed);
            const ymbed = new Discord.MessageEmbed()
                .setTitle('종료됨')
                .setColor(0x00ffff)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .setFooter(client.user.tag, client.user.displayAvatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            m.edit(ymbed).then(function () {
                console.clear().then(function () {
                    process.exit();
                });
            });
        }
    }
}