const Discord = require('discord.js');
const mail = require('nodemailer');
const fn = require('../functions.js');
module.exports = {
    name: 'mail',
    alises: ['메일', '이메일', 'email'],
    description: `봇 계정으로 이메일을 전송해요.
메세지 형식: 
/메일 <받는 사람 이메일> <제목>$<내용>`,
    run: async function (client, message, args, option) {
        let transporter = mail.createTransport({
            service: 'gmail',
            auth: {
                user: `${process.env.MAIL_ID}@gmail.com`,
                pass: process.env.MAIL_PASS
            }
        });
        var splitedBy$ = args.slice(2).join(' ').split('$');
        if (!splitedBy$[0]) return await message.channel.send('제목을 써 주세요!');
        if (!splitedBy$[1]) return await message.channel.send('내용을 써 주세요!');
        splitedBy$[1] = `${splitedBy$[1]}
____________________________________________________________________

이 메일은 디스코드 유저 ${message.author.tag} 님의 요청에 의해
디스코드 봇 ${client.user.tag} 이/가 보낸 이메일이에요. 
잘못 보내진 메일인 경우 메일 발신자에게 DM을 보내주세요.
`;
        var content = {
            from: `${process.env.MAIL_ID}@gmail.com`,
            to: args[1],
            subject: splitedBy$[0],
            text: splitedBy$[1]
        }
        const embed = new Discord.MessageEmbed({
            title: '이메일을 전송할까요?',
            color: 0xffff00,
            fields: [
                {
                    name: '받는 사람',
                    value: args[1],
                    inline: true
                },
                {
                    name: '제목',
                    value: `\`${splitedBy$[0]}\``,
                    inline: true
                },
                {
                    name: '내용',
                    value: fn.codeBlock(fn.checkLength(splitedBy$[1]), '')
                }
            ],
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL({
                    dynamic: true,
                    size: 2048,
                    format: 'jpg'
                })
            },
            timestamp: new Date()
        });
        message.channel.send(embed).then(async function (m) {
            await m.react('✅');
            await m.react('❌');
            const filter = function (r, u) {
                return (r.emoji.name == '✅' || r.emoji.name == '❌') && u.id == message.author.id && !u.bot;
            }
            const collector = await m.createReactionCollector(filter, {
                time: 30000,
                max: 1
            });
            await collector.on('end', async function (c) {
                if (c.first().emoji.name == '✅') {
                    embed.setTitle(`${client.emojis.cache.find(function (x) {
                        return x.name == 'loadingCirclebar';
                    })} 이메일 전송 중`);
                    await m.edit(embed);
                    transporter.sendMail(content, async function (err) {
                        if (err) {
                            embed.setColor(0xff0000)
                                .setTitle('이메일을 전송하는 동안 에러가 발생했어요.')
                                .addField('에러 내용', fn.codeBlock(fn.checkLength(err), ''));
                            await m.edit(embed);
                        } else {
                            embed.setColor(0x00ffff)
                                .setTitle('이메일을 전송했어요!');
                            await m.edit(embed);
                        }
                    });
                } else {
                    await m.reactions.removeAll();
                    embed.setTitle('이메일 전송 취소됨');
                    await m.edit(embed);
                }
            });
        });
    }
}