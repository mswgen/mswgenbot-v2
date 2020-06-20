const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'help',
    alises: ['도움', '도움말', 'help'],
    description: '봇의 도움말을 보여줘요.',
    category: 'other',
    run: async function (client, message, args, option) {
        if (args[1]) {
            var cmd = client.commands.get(args[1]);
            if (!cmd) return message.channel.send(`해당 명령어가 없어요. \n\`${option.prefix[message.guild.id]}도움\` 명령어로 모든 명령어 목록을 볼 수 있어요.`)
            const embed = new Discord.MessageEmbed()
                .setTitle(cmd.name)
                .setColor(0x00ffff)
                .addField('Aliases', cmd.alises.map(x => `\`${x}\``).join(', '))
                .addField('Description', cmd.description)
                .addField('Category', cmd.category)
                .addField('Usage', cmd.usage.replace(/\//gi, option.prefix[message.guild.id]))
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true,
                    format: 'jpg',
                    size: 2048
                }))
                .setTimestamp()
                .setFooter(`Usage에서 <> 부분은 필수, [] 부분은 선택이에요 | ${message.author.tag}`, message.author.avatarURL({
                    dynamic: true,
                    format: 'jpg',
                    size: 2048
                }))
            message.channel.send(embed);
        } else {
            const embed = new Discord.MessageEmbed()
                .setTitle(`${client.user.username} 도움말`)
                .setColor(0x00ffff)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true,
                    format: 'jpg',
                    size: 2048
                }))
                .setTimestamp()
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true,
                    format: 'jpg',
                    size: 2048
                }))
                .setDescription(`더 다양한 정보는 \`${option.prefix[message.guild.id]}도움 <커멘드 이름>\`을 입력해보세요!`)
            for (var x of client.categories.array()) {
                embed.addField(x, client.commands.filter(a => a.category == x).map(a => `\`${a.name}\``).join(', '));
            }
            message.channel.send(embed);
            const embed2 =  new Discord.MessageEmbed()
                .setColor('DARK_VIVID_PINK')
                .setDescription('[하트 누르기](https://koreanbots.dev/bots/688672545184022579)')
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true,
                    format: 'jpg',
                    size: 2048
                }))
                .setTimestamp();
            axios.get(`https://api.koreanbots.dev/bots/voted/${message.author.id}`, {
                headers: {
                    token: process.env.KOREANBOTS
                }
            }).then(res => {
                if (res.data.voted == true) {
                    embed2.setTitle('❤를 눌러주셔서 감사합니다!');
                } else {
                    embed2.setTitle('koreanbots에서 ❤를 눌러주세요!');
                }
                message.channel.send(embed2);
            });
        }
    }
}