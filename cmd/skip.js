const fn = require('../functions.js');
module.exports = {
    name: 'skip',
    alises: ['스킵', '건너뛰기', 'skip'],
    description: '~~재생 중인 노래를 스킵해요.~~현재 호스팅 에러로 인해 뮤직 기능을 사용할 수 없습니다. 죄송합니다.',
    category: 'music',
    usage: '/스킵',
    run: async function (client, message, args, option) {
        //fn.skip(message);
    }
}