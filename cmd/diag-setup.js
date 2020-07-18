const Discord = require('discord.js');
module.exports = {
    name: 'diag_setup',
    alises: ['자가진단설정'],
    description: '자가진단 데이터를 저장해요',
    category: 'crawling',
    usage: '/diag_setup',
    run: async (client, message, args, ops) => {
        if (await client.dbs.diag.get(message.author.tag)) {
            return message.channel.send('이미 자가진단 정보가 등록되어 있어요. `diag_delete` 명령어를 이용해 삭제하고 다시 시도해주세요.')
        }
        const embed = new Discord.MessageEmbed()
            .setTitle('개인정보처리방침 동의')
            .setColor("RANDOM")
            .setDescription(`
자가진단 서비스를 이용하려면 개인정보처리반침에 동의해주세요.

1. 수집하는 정보: 이름, 학교, 지역, 생년월일
2. 사용 기간: 코로나 시즌이 끝날 때까지
3. 동의 취소 방법: \`/diag_remove\` 명령어 이용
4. 이를 거부할 수 있으며, 거부시에는 자가진단 서비스를 이용할 수 없습니다.
`)
        .setFooter(message.author.tag, message.author.avatarURL())
        .setTimestamp()
        let m = await message.channel.send(embed);
        await m.react('✅');
        await m.react('❌');
        const filter = (reaction, user) => (reaction.emoji.name == '✅' || reaction.emoji.name == '❌') && user.id == message.author.id;
        const collector1 = m.createReactionCollector(filter, {
            max: 1,
            time: 30000
        });
        collector1.on('end', async collected => {
            if (collected.first().emoji.name == '✅') {
                embed.setTitle('자가진단 정보 입력')
                .setDescription('DM을 봐주세요!')
                .setColor('RANDOM')
                .setTimestamp()
                await m.edit(embed);
                embed.setTitle('지역 입력')
                .setDescription(`자신이 사는 지역의 코드를 입력해주세요.
                
**지역 코드 목록**

\`\`\`
서울특별시: sen

부산광역시: pen

인천광역시: ice

경기도: goe

충청북도: cbe

충청남도: cne

전라북도: jbe

전라남도: jne

경상북도: gbe

경상남도: gne

강원도: kwe

울산광역시: use

대전광역시: dje

대구광역시: dge

광주광역시: gen

세종특별자치시: sje

제주도: jje
\`\`\`
                `)
                .setColor("RANDOM")
                .setTimestamp()
                let m2 = await message.author.send(embed);
                const filter2 = msg => msg.author.id == message.author.id;
                const collector2 = m2.channel.createMessageCollector(filter2, {
                    max: 1
                });
                let config = {};
                collector2.on('end', async collected2 => {
                    config.region = collected2.first().content;
                    embed.setTitle('이름 입력')
                    .setDescription('이름을 입력해주세요')
                    .setColor('RANDOM')
                    .setTimestamp()
                    await m2.edit(embed);
                    const collector3 = m2.channel.createMessageCollector(filter2, {
                        max: 1
                    });
                    collector3.on('end', async collected3 => {
                        config.name = collected3.first().content;
                        embed.setTitle('학교 입력')
                        .setDescription('자신이 다니는 학교의 이름을 입력해주세요(초등학교, 중학교 등도 같이 입력해주세요)')
                        .setColor("RANDOM")
                        .setTimestamp()
                        await m2.edit(embed);
                        const collector4 = m2.channel.createMessageCollector(filter2, {
                            max: 1
                        });
                        collector4.on('end', async collected4 => {
                            config.school = collected4.first().content;
                            embed.setTitle('학교 순서 입력')
                            .setDescription('자신이 다니는 학교가 검색 페이지에서 몇번째로 뜨는지 숫자만 입력해주세요\n숫자가 아닌 수를 입력하면 아무것도 나오지 않으니 그럴 경우에는 다시 입력해주세요.')
                            .setColor("RANDOM")
                            .setTimestamp()
                            await m2.edit(embed);
                            const filter3 = m => (m.author.id == message.author.id) && !isNaN(parseInt(m.content))
                            const collector5 = m2.channel.createMessageCollector(filter3, {
                                max: 1
                            });
                            collector5.on('end', async collected5 => {
                                config.schoolorder = parseInt(collected5.first().content);
                                embed.setTitle('생일 입력')
                                .setDescription('생일(6자리)를 숫자만 입력해주세요')
                                .setColor("RANDOM")
                                .setTimestamp()
                                await m2.edit(embed);
                                const collector6 = m2.channel.createMessageCollector(filter2, {
                                    max: 1
                                });
                                collector6.on('end', async collected6 => {
                                    config.birth = collected6.first().content;
                                    embed.setTitle('완료!')
                                    .setColor('RANDOM')
                                    .setDescription(`자가진단 설정이 완료되었어요. \`diag\`명령어로 자가진단을 하거나 \`diag_delete\` 명령어로 정보를 지울 수 있어요
                                    
                                    
입력된 정보
지역 코드: ${config.region}
학교: ${config.school}(${config.schoolorder}번째)
이름: ${config.name}
생일: ${config.birth}
`);
await m2.edit(embed);
await client.dbs.diag.set(message.author.id, `${config.region}$${config.school}$${config.schoolorder}$${config.name}$${config.birth}`);
                                });
                            });
                        });
                    });
                });
            } else {
                embed.setTitle('자가진단 설정이 취소되었어요')
                .setDescription('')
                .setColor('RANDOM')
                .setTimestamp()
                await m.edit(embed);
            }
        });
    }
}