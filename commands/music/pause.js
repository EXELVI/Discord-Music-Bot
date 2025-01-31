const Discord = require('discord.js');
function rgbToHex([r, g, b]) {
  return ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');
} 
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
      let palette = await getPalette(song.thumbnail)
      return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setTitle('Pause').setDescription('Music resumed!').setColor(rgbToHex(palette[0])) ] })
    }
    queue.pause()
    let palette = await getPalette(song.thumbnail)
    return interaction.reply({ embeds: [ new Discord.EmbedBuilder().setTitle('Pause').setDescription('Music paused!').setColor(rgbToHex(palette[0])) ] })

  }
}
