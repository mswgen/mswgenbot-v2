const Discord = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
module.exports = {
    name: 'weather',
    alises: ['날씨', 'weather'],
    description: `입력한 지역의 날씨를 보여줘요. (코드 출처: ditto7890#5158y)`,
    run: async function (client, message, args, option) {
        if (!args[1]) return await message.channel.send('지역을 입력해주세요');
        await axios.get(`https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=${encodeURI(`${args.join(" ").replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '')} 날씨`)}`).then(async function (res) {
            if (res.status !== 200) return;
            const $ = cheerio.load(res.data);
            const get = {
                region: $('div.sort_box > div.lst_select > div.select_box > span.btn_select > em').text(),
                stats: {
                    result: $('div.today_area._mainTabContent > div.main_info > div.info_data > ul.info_list > li > p.cast_txt').text().split(',')[0],
                    stats: $('div.today_area._mainTabContent > div.main_info > div.info_data > ul.info_list > li > p.cast_txt').text()
                },
                temp: $('div.today_area._mainTabContent > div.main_info > div > p > span.todaytemp').text(),
                findDust: {
                    result: $('div.today_area > div.sub_info > div.detail_box > dl.indicator > dd > span.num').eq(0).text().split('㎍/㎥')[0],
                    stats: $('div.today_area > div.sub_info > div.detail_box > dl.indicator > dd').first().text().split('㎍/㎥')[1]
                },
                ultrafineDust: {
                    result: $('div.today_area > div.sub_info > div.detail_box > dl.indicator > dd > span.num').eq(1).text().split('㎍/㎥')[0],
                    stats: $('div.today_area > div.sub_info > div.detail_box > dl.indicator > dd').eq(1).text().split('㎍/㎥')[1]
                },
                ozoneIndex: {
                    result: $('div.today_area > div.sub_info > div.detail_box > dl.indicator > dd > span.num').eq(2).text().split('ppm')[0],
                    stats: $('div.today_area > div.sub_info > div.detail_box > dl.indicator > dd').eq(2).text().split('ppm')[1]
                },
                ultravioletRays: {
                    result: $('div.today_area > div.main_info > div.info_data > ul.info_list > li:nth-child(3) > span.indicator > span > span.num').first().text(),
                    stats: $('div.today_area > div.main_info > div.info_data > ul.info_list > li:nth-child(3) > span.indicator > span').first().text().split($('div.today_area > div.main_info > div.info_data > ul.info_list > li:nth-child(3) > span.indicator > span > span.num').first().text())[1]
                },
                sensoryTemp: $('div.today_area > div.main_info > div.info_data > ul.info_list > li:nth-child(2) > span.sensible > em').text().split('˚')[0],
                precipitationPerHour: $('div.today_area > div.main_info > div.info_data > ul.info_list > li:nth-child(3) > span.rainfall > em').text().split('mm')[0],
                probabilityOfPrecipitation: $('div.today_area > div.table_info.bytime._todayWeatherByTime > div.info_list.rainfall._tabContent > ul.list_area > li.on.now.merge1:nth-child(1) > dl > dd.weather_item._dotWrapper > span').text(),
                windSpeed: $('div.today_area > div.table_info > div.info_list.wind._tabContent > ul.list_area > li.on.now:nth-child(1) > dl > dd.weather_item > span').text(),
                windDirection: $('div.today_area > div.table_info > div.info_list.wind._tabContent > ul.list_area > li.on.now:nth-child(1) > dl > dd.item_condition > span.wt_status > span.ico_wind').text().split('˚')[0],
                humidity: $('div.today_area > div.table_info > div.info_list.humidity._tabContent > ul.list_area > li.on.now:nth-child(1) > dl > dd.weather_item._dotWrapper > span').text().split('˚')[0],
                lowestTemperature: $('div.today_area > div.main_info > div.info_data > ul.info_list > li:nth-child(2) > span.merge > span.min').text().split('˚')[0],
                peakTemperature: $('div.today_area > div.main_info > div.info_data > ul.info_list > li:nth-child(2) > span.merge > span.max').text().split('˚')[0],
                update: $('div.guide_bx._guideBox > p.guide > span.guide_txt > span.update').eq(0).text()
            };
            const embed = new Discord.MessageEmbed()
                .setColor(0x00ffff)
                .setTimestamp()
                .setFooter(message.author.username, message.author.avatarURL({
                    dynamic: true,
                    format: 'jpg',
                    size: 2048
                }))
                .setDescription(`${stats[get.stats.result]} ${get.stats.stats}`)
                .setFooter(`${get.update} 업데이트`)
                .setFooter(`코드 출처: ${client.users.cache.get('604617640891121664').tag}`)
                .setTitle(get.region)
                .addField('온도', `${get.temp}℃`, true)
                .addField('체감 온도', `${get.sensoryTemp}℃`, true)
                .addField('최저 기온', `${get.lowestTemperature}℃`, true)
                .addField('최고 기온', `${get.peakTemperature}℃`, true)
                .addField('강수 확률', `${get.probabilityOfPrecipitation}%`, true)
                .addField('풍속', `${get.windSpeed}m/s`, true)
                .addField('풍향', `${get.windDirection}쪽`, true)
                .addField('습도', `${get.humidity}%`, true)
                .addField('미세먼지', `${get.findDust.result}㎍/㎥(${findDust[get.findDust.stats]} ${get.findDust.stats})`, true)
                .addField('초미세먼지', `${get.ultrafineDust.result}㎍/㎥(${findDust[get.ultrafineDust.stats]} ${get.ultrafineDust.stats})`, true)
                .addField('오존', `${get.ozoneIndex.result}ppm(${get.ozoneIndex.stats})`, true);
            if (get.ultravioletRays.result) {
                embed.addField('자외선', `${get.ultravioletRays.result}(${ultravioletRays[get.ultravioletRays.stats]} ${get.ultravioletRays.stats})`);
            } else {
                embed.addField('시간당 강수량', `${get.precipitationPerHour}mm`);
            }
            await message.channel.send(embed);
        });
    }
}
const stats = {
    "맑음": "☀",
    "흐림": "☁",
    "구름많음": "🌥"
}
const findDust = {
    "매우좋음": '😀',
    "좋음": '😃',
    "보통": '🙂',
    "나쁨": '🙁',
    "매우나쁨": '😷'
};

const ultravioletRays = {
    "매우낮음": '😀',
    "낮음": '😃',
    "보통": '🙂',
    "높음": '🙁',
    "매우높음": '☹'
};