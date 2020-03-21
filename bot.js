var Discord = require('discord.js');
var client = new Discord.Client();
var fs = require('fs');
var restart = require('./assets/restart.json');
var http = require('http');
var url = require('url');
var dotenv = require('dotenv');
var option = require('./assets/config.json');
dotenv.config({
    path: __dirname + '/assets/.env'
});
client.on('ready', function () {
    console.log(`${client.user.tag}로 로그인됨`);
    setInterval(function () {
        var r = Math.floor(Math.random() * 3);
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
        var done = false;
        if (!message.content.startsWith('/')) return;
        var args = message.content.substr(1).split(' ');
        fs.readdir('./cmd/', function (err, list) {
            for (var i = 0; i < list.length; i++) {
                var cmds = require(`./cmd/${list[i]}`);
                for (var x = 0; x < cmds.alises.length; x++) {
                    for (var a = 0; a < args.length; a++) {
                        if (args[a] == cmds.alises[x] && !done) {
                            cmds.run(client, message, args, option);
                            done = true;
                        }
                    }
                }
            }
        });
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
        client.users.get('647736678815105037').send(embed);
    }
});
const server = http.createServer(function (req, res) {
    try {
        if (req.method == 'GET') {
            if (url.parse(req.url, true).pathname == '/') {
                res.writeHead(200);
                res.end(`
<!DOCTYPE html>
<html>
<head>
<meta charset='utf-8'>
<meta name='keywords' content='${client.user.username}'>
<meta name='description' content='봇 테스트 패이지'>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="index, follow">
<style>
body {
font-family:'맑은 고딕', 'Malgun Gothic', sans-serif;
text-color:black;
}
</style>
<title>
${client.user.displayAvatarURL({
    dynamic: true
})}
</title>
<link rel='icon' href=${client.user.displayAvatarURL({
    dynamic: true
})}>
</head>
<body>
<h1>${client.user.username}</h1>
<h2>봇의 핑</h2>
<p>
API 지연 시간: ${client.ws.ping}
</p>
<h2>초대 링크</h2>
<p>
<a href='https://discordapp.com/api/oauth2/authorize?client_id=688672545184022579&permissions=8&scope=bot'>관리자 권한</a>
<a href='https://discordapp.com/api/oauth2/authorize?client_id=688672545184022579&permissions=37214528&scope=bot'>기본 권한</a>
</p>
<img src=${client.user.displayAvatarURL({
    dynamic: true
})}>
<p>
<iframe src="https://discordapp.com/widget?id=688681923698229294&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0"></iframe>
</p>
</body>
</html>
                `);
            } else {
                res.writeHead(404);
                res.end(`
                    <h1>에러...</h1>
                    <h2>에러 내용</h2>
                    <p>404: 페이지를 찾을 수 없습니다.</p>
                    <a href='/'>메인으로 돌아가기</a>
                `);
            }
        } else {
            res.writeHead(405);
            res.end(`
                    <h1>에러...</h1>
                    <h2>에러 내용</h2>
                    <p>405: 허용되지 않은 메서드입니다. (허용된 메서드:GET)</p>
                    <a href='/'>메인으로 돌아가기</a>
                `);
        }

    } catch (err) {
        res.writeHead(500);
        res.end(`
                    <h1>에러...</h1>
                    <h2>에러 내용</h2>
                    <p>500: 서버 코드에 오류가 있습니다.(오류 내용: ${err})</p>
                    <a href='/'>메인으로 돌아가기</a>
                `);
    }
});
server.listen(option.port);
client.login(process.env.TOKEN);

