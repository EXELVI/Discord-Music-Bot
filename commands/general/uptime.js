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
    const uptime = client.uptime;
    const formattedUptime = discordTimestamp(Date.now() - uptime, 'RELATIVE');
    const ping = Math.round(client.ws.ping);
    const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const embed = new Discord.EmbedBuilder()
        .setColor('#0099ff')
        .setTitle("Uptime Information")
        .addFields(
            { name: 'Uptime', value: `${formattedUptime}`, inline: true },
            { name: 'Ping', value: `${ping} ms`, inline: true },
            { name: 'RAM Usage', value: `${memoryUsage} MB`, inline: true }
        )
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
    }
}
