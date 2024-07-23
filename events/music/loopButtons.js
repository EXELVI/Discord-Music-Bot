const Discord = require('discord.js');
const Distube = require('distube')
module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {Discord.BaseInteraction} interaction Interaction
     * @param {Discord.ClientApplication} client 
     * @returns void
     */
    async execute(interaction, client) {

        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith("loop|")) return;
        /**
            * @type {Distube.Queue}
            * */
        const queue = client.distube.getQueue(interaction)
        if (!queue) return interaction.reply({ content: ":x: | There is nothing playing!", ephemeral: true })
        const song = queue.songs[0]

        let repeatMode = interaction.customId.split("|")[1]

        let embed = new Discord.EmbedBuilder()
            .setTitle("Repeat Mode")

        let button1 = new Discord.ButtonBuilder()
            .setLabel("Off")
            .setStyle(2)
            .setCustomId("loop|off")

        let button2 = new Discord.ButtonBuilder()
            .setLabel("Song")
            .setStyle(2)
            .setCustomId("loop|song")

        let button3 = new Discord.ButtonBuilder()
            .setLabel("Queue")
            .setStyle(2)
            .setCustomId("loop|queue")

        interaction.deferUpdate()
        console.log(interaction.message)

        let mode = null
        switch (repeatMode) {
            case 'off':
                mode = 0
                button1.setStyle(3)
                button2.setStyle(2)
                button3.setStyle(2)
                break
            case 'song':
                mode = 1
                button2.setStyle(3)
                button1.setStyle(2)
                button3.setStyle(2)
                break
            case 'queue':
                mode = 2
                button3.setStyle(3)
                button2.setStyle(2)
                button1.setStyle(2)
                break
        }
        mode = queue.setRepeatMode(mode)
        mode = mode ? (mode === 2 ? 'Queue' : 'Song') : 'Off'

        row = new Discord.ActionRowBuilder()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)


        interaction.message.edit({ embeds: [embed], components: [row] })


    },

};