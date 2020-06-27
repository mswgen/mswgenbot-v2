const fn = require('../functions.js');
module.exports = {
    name: 'stop',
    alises: ['정지', 'stop'],
    description: '~~재생 중인 노래를 정지해요.~~현재 호스팅 에러로 인해 뮤직 기능을 사용할 수 없습니다. 죄송합니다.',
    category: 'music',
    usage: '/정지',
    run: async function (client, message, args, option) {
        //fn.stop(message);
    }
}