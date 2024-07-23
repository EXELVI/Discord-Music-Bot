const Discord = require('discord.js');

let listFormats = ['RELATIVE', 'DATE', 'TIME', 'SHORT TIME', 'FULL']
let listUnformatted = ['R', 'D', 'T', 't', 'F']

function discordTimestamp(date, format) {
    let parsed = Math.floor(date / 1000)
    return `<t:${parsed}:${listUnformatted[listFormats.indexOf(format.toUpperCase())]}>`
}

module.exports = {
    name: 'uptime',
    description: "Shows the bot's uptime",
    category: "general",
    async execute(interaction, client) {
        var clients = await client.shard.broadcastEval(x => { return { ready: x.isReady(), ping: x.ws.ping } })
        var fields = []

        for (var i = 0; client.shard.ids.length > i; i++) {
            fields.push({ name: "Shard " + client.shard.ids[i], value: clients[i].ready ? ":green_circle: " + clients[i].ping + "ms" : ":red_circle:", inline: true})
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle("Bot stats")
            .setDescription("**Uptime** " + `${discordTimestamp(new Date().getTime() - client.uptime, "Relative")}`)
            .setFields(fields)

        interaction.reply({ embeds: [embed] })

    }
}
