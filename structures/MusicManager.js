const { Collection, MessageEmbed } = require("discord.js"),
{ Manager } = require("@lavacord/discord.js"),
{ Rest } = require("lavacord"),
Queue = require("./Queue")

/**
* @class MusicManager
*/
module.exports = class MusicManager {
/**
 * @param {import("./MusicClient")} client
 */
constructor(client) {
    this.client = client
    this.manager = new Manager(client, [{ id: "default", host: "localhost", port: 2334, password: process.env.LAVALINK_PASS }],  {
        user: client.user.id,
        shards: client.shard ? client.shard.count : 0
    })

    this.manager.connect().then(() => console.log("Lavalink Connected")).catch(console.error)
    
    this.queue = new Collection()
}

async handleVideo(message, voiceChannel, song) {
    const serverQueue = this.queue.get(message.guild.id)
    song.requestedBy = message.author

    if (!serverQueue) {
        const queue = new Queue(this.client, {
            textChannel: message.channel,
            voiceChannel
        })
        queue.songs.push(song)
        this.queue.set(message.guild.id, queue)

        try {
            const player = await this.manager.join({
                channel: voiceChannel.id,
                guild: message.guild.id,
                node: "default"
            })

            queue.setPlayer(player)
            this.play(message.guild, song)
        } catch (error) {
            console.error(error.message | error)

            this.queue.delete(message.guild.id)
            this.manager.leave(message.guild.id)
            message.channel.send(new MessageEmbed().setDescription(`❌ 음성 채널에 들어갈 수 없어요!\n${error}`).setColor(0xFF0000))
        }
    } else {
        serverQueue.songs.push(song)
        message.channel.send(new MessageEmbed().setTitle(song.info.title).setURL(song.info.uri).setDescription(`✅ **${song.info.title} - ${song.info.author}**이(가) 대기열에 추가되었어요!`).setColor(0x00FF00))
    }
}

async play(guild, song) {
    const serverQueue = this.queue.get(guild.id)

    if (!song) {
        serverQueue.textChannel.send(new MessageEmbed().setTitle("✅ 모든 음악 재생 완료!").setColor(0x00FF00))
        this.manager.leave(guild.id)
        this.queue.delete(guild.id)
    } else {
        serverQueue.player.play(song.track)
        serverQueue.player
            .once("error", console.error)
            .once("end", data => {
                if (data.reason === "REPLACED") return

                let shiffed

                if (!serverQueue.loop) shiffed = serverQueue.songs.shift()
                if (serverQueue.loopQueue) serverQueue.songs.push(shiffed)
                clearInterval(x);
                m.delete();
                //delete x;
                this.play(guild, serverQueue.songs[0])
            })
        serverQueue.player.volume(serverQueue.volume)
        console.log(song.info)
        const embed = new MessageEmbed().setColor(0x00FF00).setTitle(song.info.title).setURL(song.info.uri).setDescription(`✅ 곧 **${song.info.title}** - **${song.info.author}**이(가) 재생돼요!
재생 상황: 🔘️▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`)
        let m = await serverQueue.textChannel.send(embed);

        var x = setInterval(() => {
            m.edit(embed.setDescription(embed.description.replace('🔘️▬', '▬🔘️')))
        }, song.info.length / 19);
    }
}

async getSongs(query) {
    const node = this.manager.nodes.get("default")
    const result = await Rest.load(node, query)

    return result.tracks
}
}