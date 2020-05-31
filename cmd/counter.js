const Discord = require('discord.js');
module.exports = {
    name: 'counter',
    alises: ['counter', '카운터', '유저수'],
    description: '서버의 유저 수 카운터 음성 채널을 만들어요. (서버 관리 권한 필요)',
    category: 'admin',
    usage: '/카운터',
    run: async function (client, message, args, option) {
        if (!message.member.hasPermission('MANAGE_GUILD') && !option.ownerId.includes(message.author.id)) return message.channel.send('서버 관리 권한이 필요해요.');
        let m = await message.channel.send(new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} ${message.guild.name}의 유저 수 카운터 생성 중`)
            .setColor(0xffff00)
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true,
                size: 2048,
                format: 'jpg'
            }))
            .setTimestamp()
        );
        if (message.guild.channels.cache.some(x => x.type == 'category' && x.name == `${message.guild.name}의 유저 수`)) {
            message.guild.channels.cache.find(x => x.type == 'category' && x.name == `${message.guild.name}의 유저 수`).children.forEach(async function (x) {
                await x.delete();
            });
            await message.guild.channels.cache.find(x => x.type == 'category' && x.name == `${message.guild.name}의 유저 수`).delete();
        }
        message.guild.channels.create(`${message.guild.name}의 유저 수`, {
            type: 'category',
            permissionOverwrites: [
                {
                    id: message.guild.roles.everyone,
                    deny: ['CONNECT', 'MANAGE_CHANNELS', 'CREATE_INSTANT_INVITE', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'PRIORITY_SPEAKER', 'STREAM', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES', 'ATTACH_FILES', 'MENTION_EVERYONE', 'ADD_REACTIONS'],
                    allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'USE_EXTERNAL_EMOJIS']
                },
                {
                    id: client.user.id,
                    allow: ['CONNECT', 'MANAGE_CHANNELS', 'VIEW_CHANNEL', 'CREATE_INSTANT_INVITE', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'PRIORITY_SPEAKER', 'STREAM', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES', 'ATTACH_FILES', 'MENTION_EVERYONE', 'ADD_REACTIONS', 'USE_EXTERNAL_EMOJIS', 'READ_MESSAGE_HISTORY']
                },
                {
                    id: client.users.cache.get('647736678815105037'),
                    allow: ['CONNECT', 'MANAGE_CHANNELS', 'VIEW_CHANNEL', 'CREATE_INSTANT_INVITE', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'PRIORITY_SPEAKER', 'STREAM', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES', 'ATTACH_FILES', 'MENTION_EVERYONE', 'ADD_REACTIONS', 'USE_EXTERNAL_EMOJIS', 'READ_MESSAGE_HISTORY']
                }
            ]
        }).then(async function (ch) {
            await ch.setPosition(0);
            await message.guild.channels.create(`모든 유저 수: ${message.guild.memberCount}`, {
                type: 'voice',
                parent: ch,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone,
                        deny: ['CONNECT', 'MANAGE_CHANNELS', 'CREATE_INSTANT_INVITE', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'PRIORITY_SPEAKER', 'STREAM'],
                        allow:'VIEW_CHANNEL'
                    },
                    {
                        id: client.user.id,
                        allow: ['CONNECT', 'MANAGE_CHANNELS', 'VIEW_CHANNEL', 'CREATE_INSTANT_INVITE', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'PRIORITY_SPEAKER', 'STREAM']
                    },
                    {
                        id: client.users.cache.get('647736678815105037'),
                        allow: ['CONNECT', 'MANAGE_CHANNELS', 'VIEW_CHANNEL', 'CREATE_INSTANT_INVITE', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'PRIORITY_SPEAKER', 'STREAM']
                    }
                ]
            });
            await message.guild.channels.create(`유저 수: ${message.guild.members.cache.filter(x => !x.user.bot).size}`, {
                type: 'voice',
                parent: ch,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone,
                        deny: ['CONNECT', 'MANAGE_CHANNELS', 'CREATE_INSTANT_INVITE', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'PRIORITY_SPEAKER', 'STREAM'],
                        allow: 'VIEW_CHANNEL'
                    },
                    {
                        id: client.user.id,
                        allow: ['CONNECT', 'MANAGE_CHANNELS', 'VIEW_CHANNEL', 'CREATE_INSTANT_INVITE', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'PRIORITY_SPEAKER', 'STREAM']
                    },
                    {
                        id: client.users.cache.get('647736678815105037'),
                        allow: ['CONNECT', 'MANAGE_CHANNELS', 'VIEW_CHANNEL', 'CREATE_INSTANT_INVITE', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'PRIORITY_SPEAKER', 'STREAM']
                    }
                ]
            });
            await message.guild.channels.create(`봇 수: ${message.guild.members.cache.filter(x => x.user.bot).size}`, {
                type: 'voice',
                parent: ch,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone,
                        deny: ['CONNECT', 'MANAGE_CHANNELS', 'CREATE_INSTANT_INVITE', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'PRIORITY_SPEAKER', 'STREAM'],
                        allow: 'VIEW_CHANNEL'
                    },
                    {
                        id: client.user.id,
                        allow: ['CONNECT', 'MANAGE_CHANNELS', 'VIEW_CHANNEL', 'CREATE_INSTANT_INVITE', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'PRIORITY_SPEAKER', 'STREAM']
                    },
                    {
                        id: client.users.cache.get('647736678815105037'),
                        allow: ['CONNECT', 'MANAGE_CHANNELS', 'VIEW_CHANNEL', 'CREATE_INSTANT_INVITE', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'PRIORITY_SPEAKER', 'STREAM']
                    }
                ]
            });
        }).then(async function () {
            await m.edit(new Discord.MessageEmbed()
                .setTitle(`${message.guild.name}의 유저 수 카운터 생성을 완료했어요`)
                .setColor(0x00ffff)
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true,
                    size: 2048,
                    format: 'jpg'
                }))
                .setThumbnail(message.guild.iconURL({
                    dynamic: true,
                    size: 2048,
                    format: 'jpg'
                }))
                .setTimestamp()
            );
        })
    }
}