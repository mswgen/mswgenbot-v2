const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'help',
    alises: ['도움', '도움말', 'help'],
    description: '봇의 도움말을 보여줍니다.',
    run: async function (client, message, args, option) {
        let m = await message.channel.send(new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 도움말 전송 중...`)
            .setColor(0xffff00)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .setTimestamp()
            .addField('현재 진행률', `전송 준비 중`)
        );
        m.edit(new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 도움말 전송 중...`)
            .setColor(0xffff00)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .setTimestamp()
            .addField('현재 진행률', `전송할 파일을 읽는 중`)
        );
        var list = fs.readdirSync('./cmd/');
        for (var i = 0; i < list.length; i++) {
            const cmd = require(`./${list[i]}`);
            const toSend = new Discord.MessageEmbed()
                .setTitle(`${cmd.name}`)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .addField('커멘드 실행 메세지 리스트', `/${cmd.alises.join('\n/')}`)
                .addField('커멘드 설명', cmd.description)
                .setColor(0x00ffff)
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            message.author.send(toSend);
            m.edit(new Discord.MessageEmbed()
                .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 도움말 전송 중...`)
                .setDescription('봇의 모든 명령어 리스트를 DM으로 보내는 중입니다.\n이 작업은 시간이 오래 걸립니다. 전송 완료 메세지가 뜰 때까지 기다려주세요.')
                .setColor(0xffff00)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .setTimestamp()
                .addField('현재 진행률', `${i + 1}/${list.length}개 전송 중`)
                .addField('현재 전송 중인 도움말', `${cmd.name} 전송 중`)
                .addField('전송 대상 유저', `${message.author}`)
            );
        }
        m.edit(new Discord.MessageEmbed()
            .setTitle('도움말 전송 완료!')
            .setColor(0x00ffff)
            .setDescription('개인 메세지(DM)을 확인해주세요.')
            .addField('전송 대상', `${message.author}`)
            .addField('전송 완료된 도움말 개수', `${list.length}개`)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        );
    }
}