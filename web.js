const http = require('http');
const url = require('url');
module.exports = {
    create: function (client, option) {
        const server = http.createServer(function (req, res) {
            try {
                if (req.method == 'GET') {
                    if (url.parse(req.url, true).pathname == '/') {
                        res.writeHead(200);
                        res.end(this.makeHTML(client));
                    } else {
                        res.writeHead(404);
                        res.end(`
                    <head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head>
                    <h1>에러...</h1>
                    <h2>에러 내용</h2>
                    <p>404: 페이지를 찾을 수 없습니다.</p>
                    <a href='/'>메인으로 돌아가기</a>
                `);
                    }
                } else {
                    res.writeHead(405);
                    res.end(`
                    <head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head>
                    <h1>에러...</h1>
                    <h2>에러 내용</h2>
                    <p>405: 허용되지 않은 메서드입니다. (허용된 메서드:GET)</p>
                    <a href='/'>메인으로 돌아가기</a>
                `);
                }

            } catch (err) {
                res.writeHead(500);
                res.end(`
                    <head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head>
                    <h1>에러...</h1>
                    <h2>에러 내용</h2>
                    <p>500: 서버 코드에 오류가 있습니다.(오류 내용: ${err})</p>
                    <a href='/'>메인으로 돌아가기</a>
                `);
            }
        });
        server.listen(option.port);
        function makeHTML(client) {
            return `< !DOCTYPE html >
<html>
<head>
<meta charset='utf-8'>
<meta name='keywords' content='${client.user.username}'>
<meta name='description' content='봇 테스트 페이지'>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="index, follow">
<style>
body {
font - family:'맑은 고딕', 'Malgun Gothic', sans-serif;
text-color:black;
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
`;
        }
    }
}