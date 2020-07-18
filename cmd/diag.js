const Discord = require('discord.js');
const puppeteer = require('puppeteer');
module.exports = {
    name: 'diag',
    alises: ['자가진단', 'diagnosics'],
    description: '학생 건강상태 자가진단을 진행해요.',
    category: 'crawling',
    usage: '/diag',
    run: async (client, message, args, ops) => {
        if (!(await client.dbs.diag.get(message.author.id))) return message.channel.send('자가진단 정보가 등록되어있지 않아요.');
        const embed = new Discord.MessageEmbed()
            .setTitle('자가진단 진행 중')
            .setDescription('현재 진행 상황: 설정을 읽고 있어요.')
            .setFooter(message.author.tag, message.author.avatarURL())
            .setTimestamp()
            .setColor("RANDOM")
        let m = await message.channel.send(embed);
        puppeteer.launch().then(async browser => {
            const config = await client.dbs.diag.get(message.author.id).split('$');
            const page = await browser.newPage();
            await page.goto(`https://eduro.${config[0]}.go.kr/hcheck/index.jsp`);
            await page.evaluate(() => {
                document.querySelector('a[title="학생정보 입력"]').click();
            });
            embed.setDescription('현재 진행 상황: 학생정보를 입력하고 있어요.')
            .setColor("RANDOM")
            .setTimestamp()
            await m.edit(embed);
            await page.waitFor(500);
            await page.focus('#schulNm');
            await page.keyboard.type(config[1]);
            await page.evaluate(() => {
                document.querySelector(`#schulNm`).blur()
            });
            page.on('popup', async popup => {
                await popup.evaluate(config => {
                    document.querySelectorAll(`a`)[parseInt(config[2]) - 1].click();
                }, config);
                popup.on('close', async () => {
                    await page.focus('#pName');
                    await page.keyboard.type(config[3]);
                    await page.evaluate(birth => {
                        document.querySelector('#frnoRidno').value = birth;
                    }, config[4]);
                    await page.waitFor(500);
                    await page.click('#btnConfirm');
                    await page.waitFor(500);
                    embed.setDescription('현재 진행 상황: 체크를 하고 있어요.')
                    .setColor("RANDOM")
                    .setTimestamp()
                    await m.edit(embed);
                    await page.click('#rspns011');
                    await page.click('#rspns02');
                    await page.click('#rspns070');
                    await page.click('#rspns080');
                    await page.click('#rspns090');
                    await page.click('#btnConfirm');
                    await page.waitFor(500);
                    embed.setTitle('자가진단 완료!')
                    .setDescription('DM을 확인해주세요.')
                    .setColor("RANDOM")
                    .setTimestamp()
                    await m.edit(embed);
                    await page.screenshot().then(async x => {
                        embed.setTitle('자가진단 스크린샷')
                        .setDescription('')
                        .setImage(x)
                        .setTimestamp()
                        .setColor("RANDOM")
                        await message.author.send(embed);
                        await browser.close();
                    });
                });
            });
        });
    }
}