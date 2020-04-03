const Discord = require('discord.js');
const axios = require('axios');
const fn = require('../functions.js');
module.exports = {
    name: 'entry',
    alises: ['엔트리', '엔트리유저', 'entry', 'entry-user'],
    description: '엔트리 유저의 정보를 불러옵니다.',
    run: async function (client, message, args, option) {
        var roles = {
            member: '학생',
            teacher: '선생님',
            admin: '엔트리 운영자||~~영자~~||'
        }
        if (!args[1]) return await message.channel.send('정보를 가져오려는 유저의 닉네임을 입력해 주세요');
        var toGet = null;
        if (args[1] == '운영자' || args[1] == '영자') {
            toGet = 'entry';
        } else {
            toGet = args[1];
        }
        const imbed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 정보를 가져오는 중`)
            .setColor(0xffff00)
            .addField('닉네임', toGet)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true,
                size: 2048,
                format: 'jpg'
            }))
            .setTimestamp();
        let m = await message.channel.send(imbed);
        axios.get(`https://playentry.org/api/getUserByUsername/${encodeURIComponent(toGet)}`).then(function (response) {
            if (response.status != 200) return;
            axios.get(`https://playentry.org/api/project/find?option=list&sort=updated&rows=0&type=project&user=${encodeURIComponent(response.data._id)}`).then(function (response2) {
                if (response2.status != 200) return;
                axios.get(`https://playentry.org/api/discuss/find?username=${response.data.username}`).then(function (response3) {
                    if (response3.status != 200) return;
                    const embed = new Discord.MessageEmbed()
                        .setTitle('유저 검색 결과')
                        .setColor(0x00ffff)
                        .addField('닉네임', response.data.username, true)
                        .addField('유저 id', response.data._id, true)
                        .addField('계정 유형', roles[response.data.role], true)
                        .addField('상태 메세지', response.data.description || '없음')
                    if (response.data.avatarImage) {
                        embed.setAuthor(response.data.username, `https://playentry.org/uploads/profile/${response.data._id.substr(0, 2)}/${response.data._id.substr(2, 2)}/avatar_${response.data._id}.png`, `https://playentry.org/${response.data.username}`)
                            .setThumbnail(`https://playentry.org/uploads/profile/${response.data._id.substr(0, 2)}/${response.data._id.substr(2, 2)}/avatar_${response.data._id}.png`);
                    } else {
                        embed.setAuthor(response.data.username, null, `https://playentry.org/${response.data.username}`)
                            .setThumbnail(`https://playentry.org/img/assets/avatar_img.png`);
                    }
                    if (response.data.blogImage) {
                        embed.setImage(`https://playentry.org/uploads/profile/${response.data._id.substr(0, 2)}/${response.data._id.substr(2, 2)}/blog_${response.data._id}.png`);
                    }
                    var see = 0;
                    for (var x of response2.data.data) {
                        see += x.visit;
                    }
                    embed.addField('조회수 총합', `${see || 0}회`, true);
                    var like = 0;
                    for (var x of response2.data.data) {
                        like += x.likeCnt;
                    }
                    embed.addField('좋아요 총합', `${like || 0}개`, true);
                    var comment = 0;
                    for (var x of response2.data.data) {
                        comment += x.comment;
                    }
                    embed.addField('댓글 총합', `${comment || 0}개`, true);
                    var child = 0;
                    for (var x of response2.data.data) {
                        child += x.childCnt;
                    }
                    embed.addField('사본된 횟수 총합', `${child || 0}회`, true)
                        .addField('커뮤니티에 쓴 글 수', `${response3.data.data.length}개`, true)
                        .setFooter(message.author.tag, message.author.avatarURL({
                            dynamic: true,
                            size: 2048,
                            format: 'jpg'
                        }))
                        .setTimestamp()
                    m.edit(embed);
                });
            });
        });
    }
}