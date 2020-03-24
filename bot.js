var Discord = require('discord.js');
var client = new Discord.Client();
var fs = require('fs');
var restart = require('./assets/restart.json');
var http = require('http');
var ascii = require('ascii-table');
var url = require('url');
var dotenv = require('dotenv');
const request = require('request');
const fetch = require('node-fetch');
var web = require('./web.js');
var option = require('./assets/config.json');
client.commands = new Discord.Collection();
client.alises = new Discord.Collection();
dotenv.config({
    path: __dirname + '/assets/.env'
});
fs.readdir('./cmd/', function (err, list) {
    var table = new ascii();
    table.setHeading('Command', 'Load status');
    for (let file of list) {
        try {
            let pull = require(`./cmd/${file}`);
            if (pull.name) {
                for (let alises of pull.alises) {
                    client.alises.set(alises, pull.name);
                }
                client.commands.set(pull.name, pull);
                table.addRow(file, '✅');
            } else {
                table.addRow(file, `❌ -> Error`);
            continue;
            }
        } catch (err) {
            table.addRow(file, `❌ -> Error`);
            continue;
        }
    }
    console.log(table.toString());
});
client.on('ready', function () {
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
                    name: '테스트 중...',
                    type: 'PLAYING'
                }
            });
        } else if (r == 2) {
            client.user.setPresence({
                activity: {
                    name: '/도움 명령어 입력',
                    type: 'PLAYING'
                }
            });
        } else if (r == 3) {
            client.user.setPresence({
                activity: {
                    name: `${client.users.cache.filter(x => !x.bot).size}명의 유저`,
                    type: 'WATCHING'
                }
            });
        } else if (r == 4) {
            client.user.setPresence({
                activity: {
                    name: `${client.guilds.cache.size}개의 서버`,
                    type: 'WATCHING'
                }
            });
        }
    }, 10000);
    if (restart.bool == true) {
        const embed = new Discord.MessageEmbed()
            .setTitle('재시작 완료')
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
    }
});
client.on('message', function (message) {
    try {
        if(!message.author.bot) console.log(`${message.author.username}: ${message.content} | ${message.guild.name} (ID: ${message.guild.id}) (CHANNEL: ${message.channel.name}, ID: ${message.channel.id}) | ${message.author.id}`)
        if (!message.content.startsWith('/')) return;
        var args = message.content.substr(1).split(' ');
        if (client.alises.get(args[0].toLowerCase())) {
            client.commands.get(client.alises.get(args[0].toLowerCase())).run(client, message, args, option);
        } else if (args[0] == '핑퐁' || args[0] == 'pingpong') {
            /*
            const headers = {
                Authorization: process.env.PINGPONG_AUTH,
                "Content-Type": "application/json"
            };
            const dataString = {
                request: {
                    query: args.slice(1).join(' ')
                }
            };
            const options = {
                url:
                    `https://builder.pingpong.us/api/builder/${process.env.PINGPONG_URL}/integration/v0.2/custom/${message.author.id}`,
                method: "POST",
                headers: headers,
                body: JSON.stringify(dataString)
            };
            request(options, function (error, response, body) {
                var res = JSON.parse(body, null, 1).response.replies;
                if (!error && response.statusCode == 200) {
                    if (res[0].toString().startsWith('아무말에도 곧잘 대답하는 이 봇은')) {
                        res = res.slice(1);
                    }
                    message.channel.send(res[0].text);
                    if (!res[1]) return;
                    let msg2 = res[1];
                    if (msg2) {
                        message.channel.send(msg2.text);
                    }
                    let img = res[1].image;
                    if (img) {
                        message.channel.send(img.url);
                    }
                    if (!res[2]) return;
                    let img2 = res[2].image;
                    if (img2) {
                        message.channel.send(img2.url);
                    }
                }
            });
            */
            const body = {
                request: {
                    query: args.slice(1).join(' ')
                }
            };
            fetch(`https://builder.pingpong.us/api/builder/${process.env.PINGPONG_URL}/integration/v0.2/custom/${message.author.id}`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    Authorization: process.env.PINGPONG_AUTH,
                    "Content-Type": "application/json"

                },
            }).then(function (response) {
                response.json().then(function (response) {
                    var res = response.response.replies;
                    console.log(res);
                    if (res[0].toString().startsWith('아무말에도 곧잘 대답하는 이 봇은')) {
                        res = res.slice(1);
                    }
                    message.channel.send(res[0].text);
                    if (!res[1]) return;
                    let msg2 = res[1];
                    if (msg2) {
                        message.channel.send(msg2.text);
                    }
                    let img = res[1].image;
                    if (img) {
                        message.channel.send(img.url);
                    }
                    if (!res[2]) return;
                    let img2 = res[2].image;
                    if (img2) {
                        message.channel.send(img2.url);
                    }
                });
            });
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
    }
});
web.create(client, option);
client.login(process.env.TOKEN);

/*
 
 */