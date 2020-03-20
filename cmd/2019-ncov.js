const Discord = require('discord.js');
const cheerio = require('cheerio');
const fetch = require("node-fetch")
const axios = require('axios');
module.exports = {
    name: '2019-ncov',
    alises: ['코로나', '우한폐렴', '신종코로나', '코로나19', 'covid-19', 'covid19', '2019-ncov'],
    description: '코로나19 현황을 보여줍니다.',
    run: async function (client, message, args, option) {
        const getFetch = await fetch('https://is.gd/hihhls', { method: 'POST' })
        const getJSON = await getFetch.json();

        await axios.get('https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=%EC%BD%94%EB%A1%9C%EB%82%9819').then(res => {
            if (res.status === 200) {
                const $ = cheerio.load(res.data)
                let c = new Array()

                $('.graph_view > .box').each(function (i, d) {
                    c[i] = $(this).find('.num').text().trim()
                }).filter(n => n !== undefined)

                message.channel.send(new Discord.MessageEmbed()
                    .setTitle('코로나19 현황(네이버 기준, 코드 출처: ditto7890#8948)')
                    .setColor(0x00ffff)
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.avatarURL({
                        dynamic: true
                    }))
                    .setDescription(`**국내**\n확진 환자: **${c[0]}명**\n격리 해제: **${c[1]}명**\n사망자: **${c[2]}명**\n검사 진행: **${c[3]}명**\n\n**전세계**\n감염자: **${getJSON.features[0].attributes.confirmed}명**\n사망자: **${getJSON.features[0].attributes.deaths}명**\n완치: **${getJSON.features[0].attributes.recovered}명**\n\n**자료 출처**\n[질병 관리 본부](http://ncov.mohw.go.kr/index_main.jsp)\n[네이버](https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=%EC%BD%94%EB%A1%9C%EB%82%9819)\n[Johns Hopkins CSSE](https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6)`))
            }
        });
    }
}