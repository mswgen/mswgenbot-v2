const Discord = require('discord.js');
const cheerio = require('cheerio');
const axios = require('axios');
module.exports = {
    name: '2019-ncov',
    alises: ['코로나', '우한폐렴', '신종코로나', '코로나19', 'covid-19', 'covid19', '2019-ncov'],
    description: '코로나19 현황을 보여줘요.',
    run: async function (client, message, args, option) {
        const loadingEmbed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 코로나19 현황 로딩 중`)
            .setColor('RANDOM')
            .setTimestamp()
        let m = await message.channel.send(loadingEmbed);
        const korea = {};
        await axios.get('http://ncov.mohw.go.kr/').then(async res => {
            const $ = cheerio.load(res.data);
            korea.hwakjinja = $('ul.liveNum > li > span.num')[0].children[1].data.replace(/,/gi, '');
            korea.hwakjinjaAdd = $('ul.liveNum > li > span.before')[0].children[0].data.substr(6).split(')')[0].replace(/,/gi, '');
            korea.wanchija = $('ul.liveNum > li > span.num')[1].children[0].data.replace(/,/gi, '');
            korea.wanchijaAdd = $('ul.liveNum > li > span.before')[1].children[0].data.substr(1).split(')')[0].replace(/,/gi, '');
            korea.chiryojung = $('ul.liveNum > li > span.num')[2].children[0].data.replace(/,/gi, '');
            korea.chiryojungAdd = $('ul.liveNum > li > span.before')[2].children[0].data.substr(1).split(')')[0].replace(/,/gi, '');
            korea.samang = $('ul.liveNum > li > span.num')[3].children[0].data.replace(/,/gi, '');
            korea.samangAdd = $('ul.liveNum > li > span.before')[3].children[0].data.substr(1).split(')')[0].replace(/,/gi, '');
            const koreaEmbed = new Discord.MessageEmbed()
                .setTitle('국내 코로나19 현황')
                .setColor('RANDOM')
                .addField('확진', `${korea.hwakjinja}명(${korea.hwakjinjaAdd})`, true)
                .addField('사망', `${korea.samang}명(${korea.samangAdd})`, true)
                .addField('완치', `${korea.wanchija}명(${korea.wanchijaAdd})`, true)
                .addField('치료 중', `${korea.chiryojung}명(${korea.chiryojungAdd})`, true)
                .setDescription('[질병관리본부](http://ncov.mohw.go.kr) 기준')
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true,
                    format: 'jpg',
                    size: 2048
                }))
                .setTimestamp()
            const regionEmbed = new Discord.MessageEmbed()
                .setTitle('국내 지역별 코로나19 현황')
                .setColor('RANDOM')
                .setDescription('[질병관리본부](http://ncov.mohw.go.kr) 기준')
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true,
                    format: 'jpg',
                    size: 2048
                }))
                .setTimestamp()
            var regions = {};
            $('#main_maplayout > button').each(async (i, e) => {
                var x = `${e.children[1].children[0].data}${e.children[2].children[0].data}`;
                regions[e.children[0].children[0].data] = x;
            });
            for (var x in regions) {
                regionEmbed.addField(x, regions[x], true);
            }
            await m.edit(koreaEmbed);
            await message.channel.send(regionEmbed);
            await axios.get('https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?f=json&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Confirmed%22%2C%22outStatisticFieldName%22%3A%22confirmed%22%7D%2C%20%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Deaths%22%2C%22outStatisticFieldName%22%3A%22deaths%22%7D%2C%20%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Recovered%22%2C%22outStatisticFieldName%22%3A%22recovered%22%7D%5D').then(async res2 => {
                const worldEmbed = new Discord.MessageEmbed()
                    .setTitle('전세계 코로나19 현황')
                    .setDescription(`[Johns Hopkins CSSE](https://systems.jhu.edu/) 기준`)
                    .setColor('RANDOM')
                    .addField('확진', `${res2.data.features[0].attributes.confirmed}명`, true)
                    .addField('완치', `${res2.data.features[0].attributes.recovered}명`, true)
                    .addField('사망', `${res2.data.features[0].attributes.deaths}명`, true)
                    .setFooter(message.author.tag, message.author.avatarURL({
                        dynamic: true,
                        format: 'jpg',
                        size: 2048
                    }))
                    .setTimestamp()
                await message.channel.send(worldEmbed);
            })
        })
    }
}