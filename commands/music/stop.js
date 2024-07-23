const Discord = require('discord.js');

module.exports = {
  name: 'stop',
  inVoiceChannel: true,
  description: "Stops the music",
  category: "music",
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(":x: | There is nothing playing!")
    queue.stop()
    interaction.reply({ embeds: [ new Discord.EmbedBuilder().setTitle('Stop').setDescription('Music stopped!') ] })
  }
}
