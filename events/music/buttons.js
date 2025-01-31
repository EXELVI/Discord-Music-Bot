const Discord = require('discord.js');
const Distube = require('distube');

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
            .setStyle(queue.autoplay ? 'Primary' : 'Secondary')

        const queueButton = new Discord.ButtonBuilder()
            .setCustomId('queue')
            .setEmoji('📜')
            .setLabel(queue.songs.length + ' songs')
            .setStyle('Secondary')



        if (interaction.customId == "loop") {



            switch (queue.repeatMode) {
                case 0:
                    queue.setRepeatMode(1)
                    loopButton.setLabel('This Song')
                    loopButton.setStyle('Primary')
                    interaction.deferUpdate()
                    return interaction.message.edit({ components: [new Discord.ActionRowBuilder().addComponents(volumeButton, pauseButton, loopButton, autoplayButton, queueButton)] })
                    break;
                case 1:
                    queue.setRepeatMode(2)
                    loopButton.setLabel('All Queue')
                    loopButton.setStyle('Primary')
                    interaction.deferUpdate()
                    return interaction.message.edit({ components: [new Discord.ActionRowBuilder().addComponents(volumeButton, pauseButton, loopButton, autoplayButton, queueButton)] })
                    break;
                case 2:
                    queue.setRepeatMode(0)
                    loopButton.setLabel('Off')
                    loopButton.setStyle('Secondary')
                    interaction.deferUpdate()
                    return interaction.message.edit({ components: [new Discord.ActionRowBuilder().addComponents(volumeButton, pauseButton, loopButton, autoplayButton, queueButton)] })
                    break;
            }

        } else if (interaction.customId == "pause") {
            if (queue.paused) {
                queue.resume()
                pauseButton.setLabel('Pause')
                pauseButton.setEmoji('⏸')
                interaction.deferUpdate()
                return interaction.message.edit({ components: [new Discord.ActionRowBuilder().addComponents(volumeButton, pauseButton, loopButton, autoplayButton, queueButton)] })
            } else {
                queue.pause()
                pauseButton.setLabel('Resume')
                pauseButton.setEmoji('▶')
                interaction.deferUpdate()
                return interaction.message.edit({ components: [new Discord.ActionRowBuilder().addComponents(volumeButton, pauseButton, loopButton, autoplayButton, queueButton)] })
            }
        } else if (interaction.customId == "autoplay") {
            queue.toggleAutoplay()
            if (queue.autoplay) {
                autoplayButton.setLabel('On')
                autoplayButton.setStyle('Primary')
                interaction.deferUpdate()
                return interaction.message.edit({ components: [new Discord.ActionRowBuilder().addComponents(volumeButton, pauseButton, loopButton, autoplayButton, queueButton)] })
            } else {
                autoplayButton.setLabel('Off')
                autoplayButton.setStyle('Secondary')
                interaction.deferUpdate()
                return interaction.message.edit({ components: [new Discord.ActionRowBuilder().addComponents(volumeButton, pauseButton, loopButton, autoplayButton, queueButton)] })
            }

        } else if (interaction.customId == "queue") {
            const PAGE_SIZE = 10;
            const totalPages = Math.ceil(queue.songs.length / PAGE_SIZE);
            let currentPage = 1;

            const getSongsList = (page) => {
                return queue.songs
                    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
                    .map((song, index) => {
                        const songNumber = (PAGE_SIZE * (page - 1)) + index + 1;
                        const songName = song.name.length > 63 ? `${song.name.slice(0, 63)}...` : song.name;
                        const isNowPlaying = index === 0;
                        return `${songNumber}. ${isNowPlaying ? "__" : " "}` +
                            `**[${songName}](${song.url})** - ${song.formattedDuration} ${isNowPlaying ? "__" : " "}`;
                    })
                    .join('\r');
            };

            let embed = new EmbedBuilder()
                .addFields({ name: "Queue", value: getSongsList(currentPage) })
                .setFooter({ text: `Page ${currentPage}/${totalPages}` });

            let button1 = new Discord.ButtonBuilder()
                .setLabel("Previous")
                .setStyle(1)
                .setCustomId("queue|previous")

            let button2 = new Discord.ButtonBuilder()
                .setLabel("Next")
                .setStyle(1)
                .setCustomId("queue|next")

            if (page == 1) button1.setDisabled()
            if (page == totPage) button2.setDisabled()

            let row = new Discord.ActionRowBuilder()
                .addComponents(button1)
                .addComponents(button2)

            interaction.reply({ embeds: [embed], components: [row] })
        }
    },
}; 