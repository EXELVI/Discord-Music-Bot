const Discord = require('discord.js');
const Distube = require('distube');
const pause = require('../../commands/music/pause');
module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {Discord.BaseInteraction} interaction Interaction
     * @param {Discord.ClientApplication} client 
     * @returns void
     */
    async execute(interaction, client) {
        var alowedIds = ["volume", "pause", "loop", "autoplay", "queue"]
        if (!interaction.isButton()) return;
        if (!alowedIds.includes(interaction.customId)) return;
        /**
            * @type {Distube.Queue}
            * */
        //all replies are ephemeral
        const queue = client.distube.getQueue(interaction)
        if (!queue) return interaction.reply({ content: ":x: | There is nothing playing!", ephemeral: true })
        const song = queue.songs[0]

        const volumeButton = new Discord.ButtonBuilder()
            .setCustomId('volume')
            .setEmoji('🔊')
            .setLabel(queue.volume + '%')
            .setStyle('Secondary')
            .setDisabled(true)

        const pauseButton = new Discord.ButtonBuilder()
            .setCustomId('pause')
            .setEmoji('⏸')
            .setLabel(queue.paused ? 'Resume' : 'Pause')
            .setStyle('Secondary')

        const loopButton = new Discord.ButtonBuilder()
            .setCustomId('loop')
            .setEmoji('🔁')
            .setLabel(queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off')
            .setStyle('Secondary')

        const autoplayButton = new Discord.ButtonBuilder()
            .setCustomId('autoplay')
            .setEmoji('🔄')
            .setLabel(queue.autoplay ? 'On' : 'Off')
            .setStyle('Secondary')

        const queueButton = new Discord.ButtonBuilder()
            .setCustomId('queue')
            .setEmoji('📜')
            .setLabel(queue.songs.length + ' songs')
            .setStyle('Secondary')



        if (interaction.customId == "loop") {
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


            switch (queue.repeatMode) {
                case 0:
                    button1.setStyle(3)
                    break;
                case 1:
                    button2.setStyle(3)
                    break;
                case 2:
                    button3.setStyle(3)
                    break;
            }


            let row = new Discord.ActionRowBuilder()
                .addComponents(button1)
                .addComponents(button2)
                .addComponents(button3)


            interaction.reply({ embeds: [embed], components: [row] })
        } else if (interaction.customId == "pause") {
            if (queue.paused) {
                queue.resume()
                pauseButton.setLabel('Pause')
                return interaction.message.edit({ components: [new Discord.ActionRowBuilder().addComponents(volumeButton, pauseButton, loopButton, autoplayButton, queueButton)] })
            } else {
                queue.pause()
                pauseButton.setLabel('Resume')
                return interaction.message.edit({ components: [new Discord.ActionRowBuilder().addComponents(volumeButton, pauseButton, loopButton, autoplayButton, queueButton)] })
            }
        } else if (interaction.customId == "autoplay") {
            queue.toggleAutoplay()
            if (queue.autoplay) {
                autoplayButton.setLabel('On')
                return interaction.message.edit({ components: [new Discord.ActionRowBuilder().addComponents(volumeButton, pauseButton, loopButton, autoplayButton, queueButton)] })
            } else {
                autoplayButton.setLabel('Off')
                return interaction.message.edit({ components: [new Discord.ActionRowBuilder().addComponents(volumeButton, pauseButton, loopButton, autoplayButton, queueButton)] })
            }
        } else if (interaction.customId == "queue") {
            let embed = new Discord.EmbedBuilder()
                .setTitle("Queue")
                .setDescription(queue.songs.map((song, i) => {
                    return `**${i + 1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``
                }).join('\n'))
            interaction.reply({ embeds: [embed] })
        }

    },

};