const Discord = require('discord.js');

module.exports = {
  name: 'repeat',
  inVoiceChannel: true,
  description: "Set the repeat mode",
  category: "music",
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction);
    if (!queue) {
      return interaction.reply(":x: | There is nothing playing!");
    }

    const embed = new Discord.EmbedBuilder()
      .setTitle("🔁 Repeat Mode")
      .setColor(queue.repeatMode === 0 ? '#FF0000' : queue.repeatMode === 1 ? '#00FF00' : '#0000FF')
      .setDescription(`Current repeat mode: **${['Off', 'Song', 'Queue'][queue.repeatMode]}**`)
      .setTimestamp();

    const modes = [
      { label: 'Off', customId: 'loop|off' },
      { label: 'Song', customId: 'loop|song' },
      { label: 'Queue', customId: 'loop|queue' },
    ];

    const buttons = modes.map((mode, index) =>
      new Discord.ButtonBuilder()
        .setLabel(mode.label)
        .setStyle(queue.repeatMode === index ? Discord.ButtonStyle.Primary : Discord.ButtonStyle.Secondary)
        .setCustomId(mode.customId)
    );

    const row = new Discord.ActionRowBuilder().addComponents(buttons);

    interaction.reply({ embeds: [embed], components: [row] });
  }
};
