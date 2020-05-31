const Discord = require('discord.js')
module.exports = {
    name: 'delete',
    alises: ['삭제', 'clear', 'delete'],
    description: '입력한 개수만큼 메세지를 삭제해요.(서버 관리 권한 필요)',
    category: 'admin',
    usage: '/삭제 <삭제할 메세지 개수>',
    run: async function (client, message, args, option) {
        if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('서버 관리 권한이 필요해요.');
        await message.delete();
        await message.channel.bulkDelete(parseInt(args[1]));
        await message.channel.send(`${args[1]}개의 메세지를 삭제했어요.`).then(m => {
            setTimeout(async () => {
                await m.delete();
            }, 3000);
        });
    }
}