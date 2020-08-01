const http = require('http');
const url = require('url');
const qs = require('querystring');
const axios = require('axios');
const fs = require('fs');
const Discord = require('discord.js');
function avatar (user) {
    if (user.avatar) {
        return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg?size=2048`;
    } else {
        return `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;
    }
}
function rgbToHex (r, g, b) {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}
function componentToHex (c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
module.exports = {
    create: function (client, option) {
        const server = http.createServer(function (req, res) {
            try {
                if (req.method == 'GET') {
                    var query = url.parse(req.url, true).query;
                    if (url.parse(req.url, true).pathname == '/') {
                        res.writeHead(200)
                            .end(makeHTML(client).toString());
                    } else if (url.parse(req.url, true).pathname == '/api') {
                        if (query.type == 'mask') {
                            require('./cmd/mask.js').api(res, query);
                        } else if (query.type == 'entry') {
                            require('./cmd/entry.js').api(res, query);
                        } else {
                            res.writeHead(200, {
                                'Content-Type': 'application/json; type=utf-8'
                            }).end(JSON.stringify({
                                'mask crawling': "/api?type=mask (In POST, set data 'type' to 'mask'",
                                'entry user crawling': "/api?type=entry (In POST, set data 'type' to 'entry'",
                                'bot info': "use POST method (set data 'type' to 'info')"
                            }))
                        }
                    } else if (url.parse(req.url, true).pathname == '/login') {
                        res.writeHead(302, {
                            'Location': `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(`${process.env.WEBSITE}/callback`)}&scope=identify%20guilds&response_type=code`
                        });
                        res.end();
                    } else if (url.parse(req.url, true).pathname == '/callback') {
                        axios.post('https://discord.com/api/oauth2/token', qs.stringify({
                            client_id: process.env.CLIENT_ID,
                            client_secret: process.env.CLIENT_SECRET,
                            scope: 'identify guilds',
                            code: query.code,
                            redirect_uri: `${process.env.WEBSITE}/callback`,
                            state: process.env.STATE,
                            grant_type: 'authorization_code'
                        }), {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            validateStatus: () => true
                        }).then(async tokenRes => {
                            axios.get('https://discord.com/api/users/@me', {
                                headers: {
                                    Authorization: `${tokenRes.data.token_type} ${tokenRes.data.access_token}`
                                },
                                validateStatus: () => true
                            }).then(async userRes => {
                                axios.get('https://discord.com/api/users/@me/guilds', {
                                    headers: {
                                        Authorization: `${tokenRes.data.token_type} ${tokenRes.data.access_token}`
                                    },
                                    validateStatus: () => true
                                }).then(async guildRes => {
                                    var str = '';
                                    for (var x of guildRes.data) {
                                        if (new Discord.Permissions(x.permissions).has('MANAGE_GUILD')) {
                                            str += `<p><strong>${x.name}</strong>에 봇 <a href="https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=${x.permissions}&scope=bot&guild_id=${x.id}&disable_guild_select=true">추가하기</a></p>`;
                                        }
                                    }
                                    fs.readFile('./selectguild.html', 'utf8', (err, data) => {
                                        res.writeHead(200, {
                                            'Content-Type': 'text/html; charset=utf-8'
                                        });
                                        res.end(data
                                            .replace(/!!!!!!avatar!!!!!!/gi, avatar(userRes.data))
                                            .replace(/!!!!!!nick!!!!!!/gi, `${userRes.data.username}#${userRes.data.discriminator}`)
                                            .replace(/!!!!!!guilds!!!!!!/gi, str)
                                        );
                                    });
                                });
                            });
                        });
                    } else if (url.parse(req.url, true).pathname == '/logined_css.css') {
                        fs.readFile('./logined_css.css', 'utf8', (err, data) => {
                            if (err) {
                                res.writeHead(404);
                                res.end();
                            } else {
                                res.writeHead(200, {
                                    'Content-Type': 'text/css; charset=utf-8'
                                });
                                res.end(data);
                            }
                        });
                    } else if (url.parse(req.url, true).pathname == '/boticon.webp') {
                        res.writeHead(200);
                        res.end(client.user.avatarURL({
                            dynamic: false
                        }));
                    } else if (url.parse(req.url, true).pathname == '/draw') {
                        if (client.drawings.get(query.token)) {
                            fs.readFile('./draw.html', 'utf8', (err, data) => {
                                res.writeHead(200, {
                                    'Content-Type': "text/html; charset=utf-8"
                                });
                                res.end(data
                                    .replace('{nick}', client.drawings.get(query.token).nick)
                                    .replace(/{avatar}/gi, client.user.displayAvatarURL())
                                    .replace('{url}', process.env.WEBSITE)
                                );
                            });
                        } else {
                            res.writeHead(400, {
                                'Content-Type': 'text/plain; charset=utf-8'
                            });
                            res.end('토큰이 올바르지 않아요. 올바른 링크로 들어왔는지 확인해주세요.');
                        }
                    } else {
                        res.writeHead(404)
                            .end(`
                    <head>
                    <meta charset='utf-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <meta name="keywords" content="${client.user.username}">
                    <meta name="description" content="${client.user.username} 사이트">
                    </head>
                    <h1>에러...</h1>
                    <h2>에러 내용</h2>
                    <p>404: 페이지를 찾을 수 없어요.</p>
                    <a href='/'>메인으로 돌아가기</a>
                `);
                    }
                } else if (req.method == 'POST') {
                    var _post = '';
                    req.on('data', function (data) {
                        _post += data;
                    });
                    req.on('end', async function () {
                        let post;
                        if (req.headers['content-type'] == 'application/x-www-form-urlencoded') {
                            post = qs.parse(_post);
                        } else {
                            post = JSON.parse(post);
                        }
                        if (post.type == 'mask') {
                            require('./cmd/mask.js').api(res, post);
                        } else if (post.type == 'entry') {
                            require('./cmd/entry.js').api(res, post);
                        } else if (post.type == 'info') {
                            res.writeHead(200, {
                                'Content-Type': 'application/json; type=utf-8'
                            })
                                .end(JSON.stringify({
                                    ping: client.ws.ping,
                                    displayAvatarURL: client.user.displayAvatarURL({
                                        dynamic: true,
                                        size: 2048,
                                        format: 'jpg'
                                    }),
                                    uptime: client.uptime,
                                    user: client.user
                                }));
                        } else if (post.type == 'drawing') {
                            if (client.drawings.get(post.token)) {
                                let r = Math.floor(Math.random() * 10000);
                                fs.writeFileSync(`./tmp/file_${r}.png`, new Buffer.from(post.img.split(',').slice(1).join(','), 'base64'));
                                await client.channels.cache.get(client.drawings.get(post.token).channel).send({
                                    files: [new Discord.MessageAttachment(`./tmp/file_${r}.png`, 'file.png')],
                                    embed: {
                                        title: `${client.drawings.get(post.token).nick}님의 그림`,
                                        hexColor: rgbToHex(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)),
                                        footer: {
                                            text: client.drawings.get(post.token).nick,
                                            iconURL: client.users.cache.get(client.drawings.get(post.token).usr).avatarURL()
                                        },
                                        timestamp: new Date(),
                                        image: {
                                            url: `attachment://file.png`
                                        }
                                    }
                                });
                                await client.drawings.delete(post.token);
                                fs.unlinkSync(`./tmp/file_${r}.png`);
                                res.writeHead(201, {
                                    'Content-Type': 'text/plain; charset=utf-8'
                                });
                                res.end(`완료!`)
                            } else {
                                res.writeHead(400, {
                                    'Content-Type': 'text/plain; charset=utf-8'
                                });
                                res.end('토큰이 올바르지 않아요. 올바른 링크로 들어왔는지 확인해주세요.');
                            }
                        } else {
                            res.writeHead(200, {
                                'Content-Type': 'application/json; type=utf-8'
                            }).end(JSON.stringify({
                                'mask crawling': "set data 'type' to 'mask'",
                                'entry user crawling': "set data 'type' to 'entry'",
                                'bot info': "set data 'type' to 'info'"
                            }))
                        }
                    });
                } else {
                    res.writeHead(405);
                    res.end(`
                    <head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head>
                    <h1>에러...</h1>
                    <h2>에러 내용</h2>
                    <p>405: 허용되지 않은 메서드에요. (허용된 메서드:GET, POST)</p>
                    <a href='/'>메인으로 돌아가기</a>
                `);
                }
            } catch (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/html; charset=utf-8',
                    err: err
                });
                res.end(`
                    <head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head>
                    <h1>에러...</h1>
                    <h2>에러 내용</h2>
                    <p>500: 서버 코드에 오류가 있어요.(오류 내용: ${err})</p>
                    <a href='/'>메인으로 돌아가기</a>
                `);
            }
        });
            server.listen(option.port);
            setInterval(() => {
                axios.get(process.env.WEBSITE).then();
            }, 600000);
        function makeHTML(client) {
            return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="keywords" content=${client.user.username}>
<meta name="description" content="mswgen봇 v2 사이트">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body {
font-family: '맑은 고딕', 'Malgun Gothic', sans-serif;
color: black;
}
</style>
<title>
${client.user.username}
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
<h2>초대하기</h2>
<p>
<form action="/login">
<input type="submit" value="로그인">
</form>
</p>
<img src=${client.user.displayAvatarURL({
                dynamic: true
            })}>
<p>
<iframe src="https://discordapp.com/widget?id=688681923698229294&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0"></iframe>
</p>
</body>
</html>
`;
        }
    }
}