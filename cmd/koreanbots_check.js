module.exports = {
    name: 'koreanbots',
    alises: ['hellothisisverification'],
    description: 'koreanbots 봇 소유자 확인을 위한 명령어에요.',
    category: 'info',
    usage: '/hellothisisverification',
    run: async function (client, message, args, option) {
        message.channel.send(`${client.users.cache.get('647736678815105037').tag}(${client.users.cache.get('647736678815105037').id})`);
    }
}