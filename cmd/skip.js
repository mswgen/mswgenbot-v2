const fn = require('../functions.js');
module.exports = {
    name: 'skip',
    alises: ['스킵', '건너뛰기', 'skip'],
    description: '재생 중인 노래를 스킵해요.',
    run: async function (client, message, args, option) {
        fn.skip(message);
    }
}