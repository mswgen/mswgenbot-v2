const fn = require('../functions.js');
module.exports = {
    name: 'stop',
    alises: ['정지', 'stop'],
    description: '재생 중인 노래를 정지합니다.',
    run: async function (client, message, args, option) {
        fn.stop(message);
    }
}