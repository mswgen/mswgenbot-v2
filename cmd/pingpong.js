const Discord = require('discord.js');
const fetch = require('node-fetch');
module.exports = {
    name: 'pingpong',
    alises: ['핑퐁', 'pingpong', 'vldvhd'],
    description: '핑퐁 빌더(https://pingpong.us)를 사용한 인공지능과 대화합니다. ',
    noRun: true,
    run: function (message, args) {
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
                if (res[0].text.startsWith('아무말에도 곧잘 대답하는 이 봇은')) {
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
}