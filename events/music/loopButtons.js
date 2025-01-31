const Discord = require('discord.js');
const Distube = require('distube');

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {Discord.BaseInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        if (!interaction.isButton() || !interaction.customId.startsWith("loop|")) return;

        const queue = client.distube.getQueue(interaction);
        if (!queue) {
            return interaction.reply({ content: ":x: | There is nothing playing!", ephemeral: true });
        }

        const repeatMode = interaction.customId.split("|")[1];
        let mode;
        const buttons = {
            off: new Discord.ButtonBuilder().setLabel("Off").setStyle(Discord.ButtonStyle.Secondary).setCustomId("loop|off"),
            song: new Discord.ButtonBuilder().setLabel("Song").setStyle(Discord.ButtonStyle.Secondary).setCustomId("loop|song"),
            queue: new Discord.ButtonBuilder().setLabel("Queue").setStyle(Discord.ButtonStyle.Secondary).setCustomId("loop|queue"),
        };

        switch (repeatMode) {
            case 'off':
                mode = 0;
                buttons.off.setStyle(Discord.ButtonStyle.Primary);
                break;
            case 'song':
                mode = 1;
                buttons.song.setStyle(Discord.ButtonStyle.Primary);
                break;
            case 'queue':
                mode = 2;
                buttons.queue.setStyle(Discord.ButtonStyle.Primary);
                break;
            default:
                mode = 0;
        }

        queue.setRepeatMode(mode);
        const currentMode = mode === 2 ? 'Queue' : mode === 1 ? 'Song' : 'Off';

        const embed = new Discord.EmbedBuilder()
            .setTitle("🔁 Repeat Mode")
            .setColor(mode === 0 ? '#FF0000' : mode === 1 ? '#00FF00' : '#0000FF')
            .setDescription(`Current repeat mode: **${currentMode}**`)
            .setTimestamp();

        const row = new Discord.ActionRowBuilder().addComponents(buttons.off, buttons.song, buttons.queue);

        await interaction.update({ embeds: [embed], components: [row] });
    },
};
