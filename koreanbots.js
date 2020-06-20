const axios = require('axios').default;
module.exports = {
    update: async client => {
        setInterval(() => {
            axios.post('https://api.koreanbots.dev/bots/servers', {
                servers: client.guilds.cache.size
            }, {
                'Content-Type': 'application/json',
                token: process.env.KOREANBOTS
            });
        }, 120000);
    },
    getVotes: user => {
        axios.get(`https://api.koreanbots.dev/bots/voted/${user.id}`, {
            token: process.env.KOREANBOTS
        }).then(res => {
            return res.data.voted;
        });
    }
}