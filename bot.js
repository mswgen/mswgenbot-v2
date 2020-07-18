'use strict';
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const restart = require('./assets/restart.json');
const fn = require('./functions.js');
const ascii = require('ascii-table');
const axios = require('axios').default;
const dotenv = require('dotenv');
const web = require('./web.js');
const { VultrexDB } = require('vultrex.db');
const option = require('./assets/config.json');
const logConfig = require('./assets/log.json');
client.commands = new Discord.Collection();
client.categories = new Discord.Collection();
client.queue = new Discord.Collection();
client.alises = new Discord.Collection();
client.dbs = {
    diag: new VultrexDB({
        provider: 'sqlite',
        table: 'diag',
        fileName: './assets/index.db'
    })
};
for (let x in client.dbs) {
    client.dbs[x].connect().then(() => {
        console.log(`${x} db connected`);
    });
}
dotenv.config({
    path: __dirname + '/assets/.env'
});
fs.readdir('./cmd/', function (_err, list) {
    var table = new ascii();
    table.setHeading('Command', 'Load status');
    for (let file of list) {
        try {
            let pull = require(`./cmd/${file}`);
            if (pull.name && pull.alises && pull.category) {
                for (let alises of pull.alises) {
                    client.alises.set(alises, pull.name);
                }
                client.commands.set(pull.name, pull);
                client.categories.set(pull.category, pull.category);
                table.addRow(file, '✅');
            } else {
                table.addRow(file, `❌ -> Error`);
            continue;
            }
        } catch (e) {
            table.addRow(file, `❌ -> ${e}`);
            continue;
        }
    }
    console.log(table.toString());
});
client.on('ready', async function () {
    console.log(`Login ${client.user.username}
-------------------------------`);
    setInterval(function () {
        var r = Math.floor(Math.random() * 5);
        if (r == 0) {
            client.user.setPresence({
                activity: {
                    name: client.user.username,
                    type: 'STREAMING',
                    url: `https://twitch.tv/${client.user.username}`
                }
            });
        } else if (r == 1) {
            client.user.setPresence({
                activity: {
                    name: '/도움 명령어 입력',
                    type: 'PLAYING'
                }
            });
        } else if (r == 2) {
            client.user.setPresence({
                activity: {
                    name: `${client.users.cache.filter(x => !x.bot).size}명의 유저`,
                    type: 'PLAYING'
                }
            });
        } else if (r == 3) {
            client.user.setPresence({
                activity: {
                    name: `${client.guilds.cache.size}개의 서버`,
                    type: 'PLAYING'
                }
            });
        }
    }, 10000);
    if (restart.bool == true) {
        const embed = new Discord.MessageEmbed()
            .setTitle('재시작이 완료되었어요.')
            .setColor(0x00ffff)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .setFooter(client.user.tag, client.user.displayAvatarURL({
                dynamic: true
            }))
            .setTimestamp()
        client.channels.cache.get(restart.channel).bulkDelete(1);
        client.channels.cache.get(restart.channel).send(embed);
        restart.bool = false;
        restart.channel = '0';
        restart.message = '0';
        fs.writeFile('./assets/restart.json', JSON.stringify(restart), function (err) {
            if (err) console.log(err);
        });
        client.channels.cache.get(logConfig.ready).send(new Discord.MessageEmbed()
            .setTitle(`${client.user.username} 재시작됨`)
            .setColor('RANDOM')
            .setTimestamp()
        );
    } else {
        client.channels.cache.get(logConfig.ready).send(new Discord.MessageEmbed()
            .setTitle(`${client.user.username} 로그인됨`)
            .setColor('RANDOM')
            .setTimestamp()
        );
    }
    setInterval(() => {
        axios.post('https://api.koreanbots.dev/bots/servers', {
            servers: client.guilds.cache.size
        }, {
            headers: {
                'Content-Type': 'application/json',
                token: process.env.KOREANBOTS
            }
        });
    }, 120000);
    client.musicManager = new(require("./structures/MusicManager"))(client);
})
    .on('message', async function (message) {
    if (message.channel.type != 'text') return;
    if (message.author.bot) return;
    try {
        message.serverQueue = client.queue.get(message.guild.id);
        if (!message.author.bot) console.log(`${message.author.username}: ${message.content} | ${message.guild.name} (ID: ${message.guild.id}) (CHANNEL: ${message.channel.name}, ID: ${message.channel.id}) | ${message.author.id}`)
        if (message.mentions.users.some(x => x.id == client.user.id) || message.mentions.everyone) {
            var random = Math.floor(Math.random() * 3);
            if (random == 0) {
                let m = await message.channel.send('엌 멘션...');
                setTimeout(async () => {
                    await m.delete();
                }, 5000);
            } else if (random == 1) {
                await message.react('😡');
                await message.react('🤬');
                await message.react('🇲');
                await message.react('🇪');
                await message.react('🇳');
                await message.react('🇹');
                await message.react('🇮');
                await message.react('🇴');
                await message.react('🇳');
            } else {
                await message.react('🇼');
                await message.react('🇭');
                await message.react('🇾');
            }
        }
        if (!message.content.startsWith(option.prefix[message.guild.id] || '/')) return;
        var args = '';
        if (option.prefix[message.guild.id]) {
          args = message.content.substr(option.prefix[message.guild.id].length).trim().split(' ');
        } else {
          args = message.content.substr(1).trim().split(' ');
        }
        message.channel.startTyping(1);
        if (client.alises.get(args[0].toLowerCase())) {
            if (client.commands.get(client.alises.get(args[0].toLowerCase())).noRun) return;
            client.channels.cache.get(logConfig.chat).send(new Discord.MessageEmbed()
                .setTitle(`${client.user.username} 채팅`)
                .setColor('RANDOM')
                .setTimestamp()
                .addField('내용', message.content)
                .addField('작성자', `${message.author.tag}(${message.author.id})`)
                .addField('채널', `${message.channel.name}(${message.channel.id})`)
                .addField('서버', `${message.guild.name}(${message.guild.id})`)
            );
            await client.commands.get(client.alises.get(args[0].toLowerCase())).run(client, message, args, option);
        }
    } catch (err) {
        const embed = new Discord.MessageEmbed()
            .setTitle('❌에러...')
            .setColor(0xff0000)
            .addField('에러 내용', err)
            .addField('에러 발생 메세지 내용', message.content)
            .addField('에러 발생 메세지 작성자', `${message.author.tag}(${message.author.id})`)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        message.channel.send(embed);
        embed.addField('에러 발생 채널', `${message.channel.name}(${message.channel.id})`);
        embed.addField('에러 발생 서버', `${message.guild.name}(${message.guild.id})`);
        client.users.cache.get('647736678815105037').send(embed);
        client.channels.cache.get(logConfig.error).send(new Discord.MessageEmbed()
            .setTitle(`${client.user.username} 에러`)
            .setColor('RANDOM')
            .setTimestamp()
            .addField('내용', message.content)
            .addField('작성자', `${message.author.tag}(${message.author.id})`)
            .addField('채널', `${message.channel.name}(${message.channel.id})`)
            .addField('서버', `${message.guild.name}(${message.guild.id})`)
            .addField('에러 내용', fn.codeBlock(err, 'js'))
        );
    }
    message.channel.stopTyping(true);
})
    .on('guildMemberAdd', async function (member) {
        if (member.guild.channels.cache.some(x => (x.name.includes('인사') || x.name.includes('입장') || x.name.includes('퇴장')) && (!x.topic || !x.topic.includes('nogreeting')))) {
            await member.guild.channels.cache.find(x => x.name.includes('인사') || x.name.includes('입장') || x.name.includes('퇴장')).send(new Discord.MessageEmbed()
                .setTitle('멤버 입장')
                .setColor(0x00ffff)
                .setDescription(`${member.user}님이 ${member.guild.name}에 오셨어요.`)
                .setThumbnail(member.user.displayAvatarURL({
                    dynamic: true,
                    type: 'jpg',
                    size: 2048
                }))
                .setFooter(member.user.tag, member.user.displayAvatarURL({
                    dynamic: true,
                    type: 'jpg',
                    size: 2048
                }))
                .setTimestamp()
        );
    }
    if (member.guild.channels.cache.some(x => x.name == `${member.guild.name}의 유저 수` && x.type == 'category')) {
        member.guild.channels.cache.filter(x => x.type == 'voice' && x.parent.name == `${member.guild.name}의 유저 수`).forEach(async function (ch) {
            if (ch.name.startsWith('모든 유저 수: ')) {
                ch.setName(`모든 유저 수: ${member.guild.memberCount}`);
            } else if (ch.name.startsWith('유저 수: ')) {
                ch.setName(`유저 수: ${member.guild.members.cache.filter(x => !x.user.bot).size}`);
            } else if (ch.name.startsWith('봇 수: ')) {
                ch.setName(`봇 수: ${member.guild.members.cache.filter(x => x.user.bot).size}`);
            }
        })
    }
})
    .on('guildMemberRemove', async function (member) {
        if (member.guild.channels.cache.some(x => (x.name.includes('인사') || x.name.includes('입장') || x.name.includes('퇴장')) && (!x.topic || !x.topic.includes('nogreeting')))) {
            await member.guild.channels.cache.find(x => x.name.includes('인사') || x.name.includes('입장') || x.name.includes('퇴장')).send(new Discord.MessageEmbed()
                .setTitle('멤버 퇴장')
                .setColor(0xffff00)
                .setDescription(`${member.user.tag}님이 ${member.guild.name}에서 나갔어요.`)
                .setThumbnail(member.user.displayAvatarURL({
                    dynamic: true,
                    type: 'jpg',
                    size: 2048
                }))
                .setFooter(member.user.tag, member.user.displayAvatarURL({
                    dynamic: true,
                    type: 'jpg',
                    size: 2048
                }))
                .setTimestamp()
        );
    }
        if (member.guild.channels.cache.some(x => x.type == 'category' && x.name == `${member.guild.name}의 유저 수`)) {
            member.guild.channels.cache.filter(x => x.type == 'voice' && x.parent.name == `${member.guild.name}의 유저 수`).forEach(async function (ch) {
                if (ch.name.startsWith('모든 유저 수: ')) {
                    ch.setName(`모든 유저 수: ${member.guild.memberCount}`);
                } else if (ch.name.startsWith('유저 수: ')) {
                    ch.setName(`유저 수: ${member.guild.members.cache.filter(x => !x.user.bot).size}`);
                } else if (ch.name.startsWith('봇 수: ')) {
                    ch.setName(`봇 수: ${member.guild.members.cache.filter(x => x.user.bot).size}`);
                }
            });
        }
    })
    .on('error', async function (err) {
        await client.users.cache.get('647736678815105037').send(new Discord.MessageEmbed()
            .setTitle('에러...')
            .setColor(0xff0000)
            .addField('에러 원문', err)
            .setTimestamp()
        );
    })
    .on('guildCreate', guild => {
        option.prefix[guild.id] = '/';
        fs.writeFile('./assets/config.json', JSON.stringify(option), () => {});
        guild.owner.send(`${guild.name}에 ${client.user.username}을/를 초대해 주셔서 감사해요! 이 서버의 현재 프리픽스는 \`/\`에요. \`/접두사\`를 이용해 서버의 접두사를 바꿀 수 있어요.`);
        client.channels.cache.get(logConfig.guildAdd).send(new Discord.MessageEmbed()
            .setTitle(`${client.user.username} 서버 추가됨`)
            .setColor('RANDOM')
            .setTimestamp()
            .addField('서버', `${guild.name}(${guild.id})`)
            .addField('서버 주인', `${guild.owner.user.tag}(${guild.owner.user.id})`)
        );
    })
    .on('guildDelete', guild => {
        delete option.prefix[guild.id];
        fs.writeFile('./assets/config.json', JSON.stringify(option), () => {});
        client.channels.cache.get(logConfig.guildDelete).send(new Discord.MessageEmbed()
            .setTitle(`${client.user.username} 서버 삭제됨`)
            .setColor('RANDOM')
            .setTimestamp()
            .addField('서버', `${guild.name}(${guild.id})`)
            .addField('서버 주인', `${guild.owner.user.tag}(${guild.owner.user.id})`)
        );
    });
web.create(client, option);
client.login(process.env.TOKEN);