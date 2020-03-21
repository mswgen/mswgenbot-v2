const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config({
    path: './assets/.env'
});
const manager = new Discord.ShardingManager('./bot.js', {
    token: process.env.TOKEN
});
manager.spawn();
manager.on('shardCreate', function (shard) {
    console.log(`샤드 ${shard.id} 생성됨`);
});