var Discord = require('discord.js');
var client = new Discord.Client();
var fs = require('fs');
var restart = require('./assets/restart.json');
var ascii = require('ascii-table');
var dotenv = require('dotenv');
const pingpong = require('./cmd/pingpong.js')
var web = require('./web.js');
var option = require('./assets/config.json');
client.commands = new Discord.Collection();
client.queue = new Discord.Collection();
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
            table.addRow(file, `❌ -> ${err}`);
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
                    name: '테스트',
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
                    name: `${client.users.cache.filter(x => !x.bot).size} users`,
                    type: 'WATCHING'
                }
            });
        } else if (r == 4) {
            client.user.setPresence({
                activity: {
                    name: `${client.guilds.cache.size} servers`,
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
    if (message.channel.type != 'text') return;
    try {
        message.serverQueue = client.queue.get(message.guild.id);
        if(!message.author.bot) console.log(`${message.author.username}: ${message.content} | ${message.guild.name} (ID: ${message.guild.id}) (CHANNEL: ${message.channel.name}, ID: ${message.channel.id}) | ${message.author.id}`)
        if (!message.content.startsWith('/')) return;
        var args = message.content.substr(1).split(' ');
        if (args[0] == '핑퐁' || args[0] == 'pingpong') {
            pingpong.run(message, args);
        } else if (client.alises.get(args[0].toLowerCase())) {
            if (client.commands.get(client.alises.get(args[0].toLowerCase())).noRun) return;
            client.commands.get(client.alises.get(args[0].toLowerCase())).run(client, message, args, option);
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
