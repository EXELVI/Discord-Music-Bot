const Discord = require('discord.js');

module.exports = {
  name: 'resume',
  inVoiceChannel: true,
  description: "Resume the music",
  category: "music",
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return 
    if (queue.paused) {
      queue.resume()
      return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setTitle('Resume').setDescription('Resumed the music!').setColor('Blurple') ] })
    } else {
      return interaction.reply(":x: | The music is not paused")
    }
  }
}
