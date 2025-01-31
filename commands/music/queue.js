const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  name: 'queue',
  description: "Shows the queue",
  category: "music",
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.reply(":x: | There is nothing playing!");

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

    const embed = new EmbedBuilder()
      .addFields({ name: "Queue", value: getSongsList(currentPage) || "Error" })
      .setFooter({ text: `Page ${currentPage}/${totalPages}` });

    const previousButton = new ButtonBuilder()
      .setLabel("Previous")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("queue|previous")
      .setDisabled(currentPage === 1);

    const nextButton = new ButtonBuilder()
      .setLabel("Next")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("queue|next")
      .setDisabled(currentPage === totalPages);

    const row = new ActionRowBuilder()
      .addComponents(previousButton, nextButton);

    interaction.reply({ embeds: [embed], components: [row] });
  }
};
