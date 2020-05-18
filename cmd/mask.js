const Discord = require('discord.js');
const axios = require('axios');
module.exports = {
    name: 'mask',
    alises: ['마스크', '공적마스크', '마스크현황', '공적마스크현황', 'mask'],
    description: '입력한 주소지에 있는 약국의 공적 마스크 정보를 보여줘요.',
    run: async function (client, message, args, option) {
        var days = {
            0: '누구나',
            1: '태어난 연도 끝자리가 1 또는 6',
            2: '태어난 연도 끝자리가 2 또는 7',
            3: '태어난 연도 끝자리가 3 또는 8',
            4: '태어난 연도 끝자리가 4 또는 9',
            5: '태어난 연도 끝자리가 5 또는 0',
            6: '누구나'
        };
        var stat = {
            plenty: '🟢많음(100개 이상)',
            some: '🟡보통(30~99개)',
            few: '🔴적음(2~29개)',
            empty: '⚪없음(0~1개)',
            break: '⚪판매 중이 아님'
        };
        if (!args[1]) return message.channel.send('검색하려는 곳의 주소를 입력해주세요');
        let m = await message.channel.send(new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 정보를 가져오는 중`)
            .setColor(0xffff00)
            .addField('지역', args.slice(1).join(' '))
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true,
                size: 2048,
                format: 'jpg'
            }))
            .setTimestamp()
        );
        axios.get(`https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=${encodeURIComponent(args.slice(1).join(' '))}`).then(function (response) {
            var sliced = response.data.stores;
            if (sliced.length == 0) {
                m.edit(new Discord.MessageEmbed()
                    .setTitle('공적마스크 현황 검색 실패...')
                    .setColor(0xff0000)
                    .setDescription(`${args.slice(1).join(' ')}의 마스크 현황을 찾을 수 없어요.
다음을 시도해 보세요: 
1. 주소를 정확히 입력했는지 확인
2. 더 자세히 주소를 입력(예: 경기도 성남시 -> 경기도 성남시 분당구)
3. 도시 이름을 정확히 입력(예: 서울시 -> 서울특별시)
그래도 계속 오류가 난다면 \`/건의\` 명령어를 사용해주세요.
`)
                    .setFooter(message.author.tag, message.author.avatarURL({
                        dynamic: true,
                        size: 2048,
                        format: 'jpg'
                    }))
                    .setTimestamp()
                )
            } else {
                var i = 0;
                const filter = function (reaction, user) {
                    return (reaction.emoji.name == '◀' || reaction.emoji.name == '▶') && user.id == message.author.id;
                }
                const imbed = new Discord.MessageEmbed()
                    .setTitle(sliced[i].name)
                    .setColor(0x00ffff)
                    .setFooter(message.author.tag, message.author.avatarURL({
                        dynamic: true,
                        size: 2048,
                        format: 'jpg'
                    }))
                    .setTimestamp();
                imbed.addField('주소', sliced[i].addr)
                    .addField('현황', stat[sliced[i].remain_stat] || '정보 없음')
                    .addField('입고 시각', sliced[i].stock_at || '정보 없음')
                    .addField('마지막 업데이트', sliced[i].created_at || '정보 없음')
                    .setDescription(`오늘 마스크 구매 조건: ${days[new Date().getDay()]}`)
                m.edit(imbed).then(async function () {
                    await m.react('◀');
                    await m.react('▶');
                    const collector = await m.createReactionCollector(filter, {
                        time: 20000
                    });
                    collector.on('collect', async function (r) {
                        await r.users.remove(client.users.cache.get(message.author.id))
                        if (r.emoji.name == '▶') {
                            i++;
                        } else {
                            i--;
                        }
                        if (i < 0) {
                            i++;
                            return;
                        }
                        if (i >= sliced.length) {
                            i--;
                            return;
                        }
                        collector.resetTimer({
                            time: 20000
                        });
                        imbed.spliceFields(0, imbed.fields.length);
                        imbed.setTitle(sliced[i].name)
                            .addField('주소', sliced[i].addr)
                            .addField('현황', stat[sliced[i].remain_stat] || '정보 없음')
                            .addField('입고 시각', sliced[i].stock_at || '정보 없음')
                            .addField('마지막 업데이트', sliced[i].created_at || '정보 없음')
                            .setDescription(`오늘 마스크 구매 조건: ${days[new Date().getDay()]}`)
                        m.edit(imbed);
                    });
                    collector.on('end', function () {
                        m.reactions.removeAll();
                    });
                });
            }
        });
    },
    api: async function (res, query) {
        try {
            var days = {
                0: ['everyone'],
                1: [1, 6],
                2: [2, 7],
                3: [3, 8],
                4: [4, 9],
                5: [5, 0],
                6: ['everyone']
            };
            if (!query.region) return res.writeHead(422, {
                'Content-Type': 'application/json; type=utf-8'
            }).end(JSON.stringify({
                message: 'Missing region',
                usage: '/api?type=mask&region=<region to search>'
            }));
            axios.get(`https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=${encodeURIComponent(query.region)}`).then(function (response) {
                var sliced = response.data.stores;
                if (sliced.length == 0) {
                    res.writeHead(422, {
                        'Content-Type': 'application/json; type=utf-8'
                    }).end(JSON.stringify({
                        message: 'Invaild region'
                    }));
                } else {
                    var result = new Array();
                    for (var x of response.data.stores) {
                        result.push({
                            address: x.addr,
                            name: x.name,
                            stat: x.remain_stat,
                            update: x.created_at,
                            stock: x.stock_at
                        });
                    }
                    res.writeHead(200, {
                        'Content-Type': 'application/json; type=utf-8'
                    }).end(JSON.stringify({
                        region: response.data.address,
                        availableToBuy: days[new Date().getDay()],
                        count: response.data.count,
                        stat: result
                    }));
                }
            });
        } catch (e) {
            res.writeHead(500, {
                'Content-Type': 'application/json; type=utf-8'
            }).end(JSON.stringify({
                message: 'Internal server error',
                content: e
            }));
        }
    }
}