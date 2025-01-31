const Discord = require('discord.js');
function rgbToHex([r, g, b]) {
  return ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');
}
module.exports = {
  name: 'autoplay',
  description: "Toggle autoplay",
  inVoiceChannel: true,
  category: "music",
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(":x: | There is nothing playing!")
    const autoplay = queue.toggleAutoplay()
    let palette = await getPalette(song.thumbnail)
    let embed = new Discord.EmbedBuilder()
      .setTitle('AutoPlay')
      .setDescription(`AutoPlay: \`${autoplay ? 'On' : 'Off'}\``)
      .setColor(rgbToHex(palette[0]))
    interaction.reply({ embeds: [embed] })

  }
}