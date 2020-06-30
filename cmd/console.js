const Discord = require('discord.js');
const child = require('child_process');
const fn = require('../functions.js');
module.exports = {
    name: 'console',
    alises: ['console', 'eval_console', '콘솔', '채ㅜ내ㅣㄷ_ㄷㅍ미', '채ㅜ내ㅣㄷ', 'cmd', '층'],
    description: '콘솔에서 명령어를 실행해요. (봇 제작자만 가능)',
    category: 'owner',
    usage: '/console <실행할 코드>',
    run: async function (client, message, args, option) {
        if (!option.ownerId.includes(message.author.id)) return;
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(function (x) {
                return x.name == 'loadingCirclebar';
            })} Evaling in console`)
            .setColor(0xffff00)
            .addField('Input', fn.codeBlock(args.slice(1).join(' '), 'bash'))
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true,
                size: 2048,
                format: 'jpg'
            }))
            .setTimestamp()
        await message.channel.send(embed).then(async function (m) {
            message.author.send('-------------------------------콘솔 실행 로그 시작--------------------------------------');
            const exec = child.exec(args.slice(1).join(' '), {}, function (err, stdout, stderr) {
                if (err) {
                    embed.setColor(0xff0000)
                        .addField('Error', fn.codeBlock(err, 'bash'))
                        .setTitle('Eval error... (In console)');
                    m.edit(embed);
                } else {
                    embed.setTitle('Eval result (In console)')
                    embed.setColor(0x00ffff)
                    if (stdout) {
                        embed.addField('Output (stdout)', fn.codeBlock(fn.checkLength(stdout), 'bash'))
                        embed.addField('Type (stdout)', fn.codeBlock(fn.checkLength(typeof stdout), 'bash'))
                    }
                    if (stderr) {
                        embed.addField('Output (stderr)', fn.codeBlock(fn.checkLength(stderr), 'bash'))
                        embed.addField('Type (stderr)', fn.codeBlock(fn.checkLength(typeof stderr), 'bash'))
                    }
                    m.edit(embed);
                }
                message.author.send('-------------------------------콘솔 실행 로그 끝--------------------------------------');
            });
            exec.stdout.on('data', function (data) {
                message.author.send(`stdout: ${data}`, {
                    code: 'bash',
                    split: true
                });
            });
            exec.stderr.on('data', function (data) {
                message.author.send(`stderr: ${data}`, {
                    code: 'bash',
                    split: true
                });
            });
        });
    }
}