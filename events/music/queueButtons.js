const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events } = require('discord.js');
const Distube = require('distube');

module.exports = {
    name: Events.InteractionCreate,
    /**
     * 
     * @param {Discord.BaseInteraction} interaction 
     * @param {Discord.Client} client 
     */
    async execute(interaction, client) {
        if (!interaction.isButton() || !interaction.customId.startsWith("queue|")) return;

        const queue = client.distube.getQueue(interaction.guildId);
        if (!queue) {
            return interaction.reply({ content: ":x: | There is nothing playing!", ephemeral: true });
        }

        const song = queue.songs[0];
        await interaction.deferUpdate();

        const totalPages = Math.ceil(queue.songs.length / 10);
        let currentPage = parseInt(interaction.message.embeds[0]?.footer?.text.split("/")[0].split(" ")[1]) || 1;

        if (interaction.user.id !== queue.userId) {
            return interaction.reply({ content: "You can't use this button!", ephemeral: true });
        }

        if (interaction.customId === "queue|previous") {
            currentPage = Math.max(currentPage - 1, 1);
        } else if (interaction.customId === "queue|next") {
            currentPage = Math.min(currentPage + 1, totalPages);
        }

        const start = (currentPage - 1) * 10;
        const songsList = queue.songs.slice(start, start + 10)
            .map((song, index) => `${start + index + 1}. ${index === 0 ? "__" : " "}**[${song.name.length <= 63 ? song.name : `${song.name.slice(0, 63)}...`}](${song.url})** - ${song.formattedDuration} ${index === 0 ? "__" : ""}`)
            .join('\r\n');

        const embed = new EmbedBuilder()
            .addFields({ name: "Queue", value: songsList })
            .setFooter({ text: `Page ${currentPage}/${totalPages}` });

        const buttons = [
            new ButtonBuilder()
                .setLabel("Previous")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("queue|previous")
                .setDisabled(currentPage === 1),
            new ButtonBuilder()
                .setLabel("Next")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("queue|next")
                .setDisabled(currentPage === totalPages)
        ];

        const row = new ActionRowBuilder().addComponents(buttons);

        await interaction.message.edit({ embeds: [embed], components: [row] });
    },
};
