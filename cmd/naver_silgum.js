const Discord = require('discord.js');
const axios = require('axios');
module.exports = {
    name: 'naver_silgum',
    alises: ['네이버실검', '네이버실시간급상승', '네이버실시간검색어', 'naver-silgum', 'naversilgum'],
    description: '네이버 실시간 급상승 검색어를 보여줘요.',
    run: async function (client, message, args, option) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 네이버 실검 로드 중`)
            .setColor(0xffff00)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true,
                format: 'jpg',
                size: 2048
            }))
            .setTimestamp()
        await message.channel.send(embed).then(async function (m) {
            await axios.get('https://www.naver.com/srchrank?frm=main', {
                validateStatus: () => true
            }).then(async function (response) {
                for (var x of response.data.data) {
                    embed.addField(`${x.rank}위`, `[${x.keyword}](https://search.naver.com/search.naver?query=${encodeURIComponent(x.keyword)})`, true);
                }
                embed.setColor(0x00ffff)
                    .setTitle('네이버 실검')
                await m.edit(embed);
            })
        })
    }
}