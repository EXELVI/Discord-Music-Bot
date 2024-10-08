const Discord = require('discord.js');

module.exports = {
  name: 'pause',
  inVoiceChannel: true,
  description: "Pause/Resume the current song",
  category: "music",
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(":x: | There is nothing playing!")
    if (queue.paused) {
      queue.resume()
      return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setTitle('Pause').setDescription('Music resumed!') ] })
    }
    queue.pause()
    return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setTitle('Pause').setDescription('Music paused!') ] })

  }
}
