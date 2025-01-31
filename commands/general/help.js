const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: "help",
    description: "Shows all commands",
    category: "general",
    async execute(interaction, client) {
        const commandsData = JSON.parse(fs.readFileSync("./commands.json", "utf8"));
        const categories = ["music", "general"];
        const embeds = categories.map((category) => {
            const filteredCommands = client.commands
                .filter(cmd => cmd.category === category)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(cmd => ({
                    name: `</${cmd.name}:${commandsData.find(c => c.name === cmd.name)?.id}>`,
                    value: cmd.description,
                }));

            return new EmbedBuilder()
                .setTitle(`${category.charAt(0).toUpperCase() + category.slice(1)} Commands`)
                .setDescription(`All the commands you can use in the ${category} category`)
                .addFields(filteredCommands)
                .setColor(category === "music" ? "Blurple" : "Navy");
        });

        let currentPage = 0;
        const totalPages = embeds.length;

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(totalPages === 1)
            );
        await interaction.reply({ embeds: [embeds[currentPage]], components: [buttons] })
        .then(msg => {
            const collector = msg.createMessageComponentCollector({ filter: i => i.isButton(), time: 120000 })

            collector.on('collect', async i => {
                if (i.user.id !== interaction.user.id) {
                    return i.reply({ content: "You can't interact with this.", ephemeral: true });
                }

                if (i.customId === 'previous') currentPage--;
                if (i.customId === 'next') currentPage++;

                currentPage = Math.max(0, Math.min(currentPage, totalPages - 1));
                console.log(currentPage);
                await i.update({
                    embeds: [embeds[currentPage]],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('previous')
                                .setLabel('Previous')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === 0),
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setLabel('Next')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === totalPages - 1)
                        )
                    ],
                });
            });

            collector.on('end', () => {
                const disabledButtons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true)
                );
                interaction.editReply({ components: [disabledButtons] });
            });
        });
    },
};
