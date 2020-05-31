const Discord = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
module.exports = {
    name: 'namuwiki',
    alises: ['나무위키', 'namuwiki', '꺼무위키'],
    description: '나무위키에서 입력한 제목의 문서를 불러와서 보여줘요.',
    category: 'crawling',
    usage: '/나무위키 <문서 제목>',
    run: async function (client, message, args, option) {
        if (!args[1]) return;
        await axios.get(`https://namu.wiki/Search?q=${encodeURIComponent(args.slice(1).join(' '))}`).then(async res => {
            const embed = new Discord.MessageEmbed()
                .setTitle(`${args.slice(1).join(' ')} 검색 결과`)
                .setColor(0x008275)
                .setAuthor('나무위키', 'https://namu.wiki/img/icon.png', `https://namu.wiki/Search?q=${encodeURIComponent(args.slice(1).join(' '))}`)
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true,
                    format: 'jpg',
                    size: 2048
                }))
                .setTimestamp();
            var $ = cheerio.load(res.data);
            var str = '';
            $('div.search-item').each((i ,e) => {
                if (i > 9) return;
                str += `[${e.children[0].children[2].children[0].data.trim()}](https://namu.wiki/Search?q=${encodeURIComponent(e.children[0].children[2].children[0].data.trim())})\n`;
            });
            embed.setDescription(str);
            if (embed.description == '' || embed.description == null || embed.description == undefined) return message.channel.send('검색 결과가 없어요.');
            await message.channel.send(embed);
        });
    }
}