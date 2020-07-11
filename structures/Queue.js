const { ms, s, m, h } = require("time-convert")

/**
 * @class Queue
 */
module.exports = class Queue {
    /**
     * @param {import("./MusicClient")} client
     * @param {Object} data
     * @param {import("discord.js").TextChannel} data.textChannel
     * @param {import("discord.js").VoiceChannel} data.voiceChannel
     */
    constructor(client, data = {}) {
        this.client = client
        this.textChannel = data.textChannel
        this.voiceChannel = data.voiceChannel
        this.player = null
        this.songs = []
        this.volume = 100
        this.playing = true
        this.loop = false
        this.loopQueue = false
    }

    /**
     * @param {import("lavacord").Player} player
     */
    setPlayer(player) {
        this.player = player
    }

    async pause() {
        if (!this.playing) return false
        await this.player.pause(true)
        this.playing = false
        return true
    }

    async resume() {
        if (this.playing) return false
        await this.player.pause(false)
        this.playing = true
        return true
    }

    async skip() {
        return await this.player.stop()
    }

    async setVolume(value) {
        if (!value || isNaN(value)) return false
        await this.player.volume(value)
        this.volume = parseInt(value)
        return true
    }

    async destroy() {
        this.client.musicManager.queue.delete(this.textChannel.guild.id)
        await this.client.musicManager.manager.leave(this.textChannel.guild.id)
    }

    /*
        https://github.com/TeamZenithy/Araha/blob/master/instances/guild.js
    */

    songProgress(count = 20) {
        const res = new Array(count).fill("▬")
        res[Math.floor((this.player.state.position / this.songs[0].info.length) * count)] = "🔘"
        return res.join("")
    }

    format(s, m, h) {
        if (isNaN(s) || isNaN(m) || isNaN(h)) return "00:00:00"
        s = s < 10 ? `0${s}` : s
        m = m < 10 ? `0${m}` : m
        h = h < 10 ? `0${h}` : h
        return `${h}:${m}:${s}`
    }

    duration(time) {
        const [hour, min, sec] = ms.to(h, m, s)(time)
        return this.format(sec, min, hour)
    }

    percent() {
        return ((this.player.state.position / this.songs[0].info.length) * 100).toFixed(1)
    }

    seek(s, m = 0, h = 0) {
        if (isNaN(s) || isNaN(m) || isNaN(h)) return
        if (!this.songs[0].info.isSeekable) return
        const time = (s * 1000) + (m * 60 * 1000) + (h * 60 * 60 * 1000)
        this.player.seek(time)
        return this.format(s, m, h)
    }

    /*
        https://github.com/TeamZenithy/Araha/blob/master/instances/guild.js
    */
}