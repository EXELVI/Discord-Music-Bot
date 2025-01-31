const Discord = require('discord.js');
const { options } = require('./skipto');
function rgbToHex([r, g, b]) {
  return ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');
}
module.exports = {
  name: 'forward',
  inVoiceChannel: true,
  description: "Forward the song for a specific amount of time",
 category: "music",
  options: [{
    name: "seconds",
    description: "The amount of seconds to forward",
    required: true,
    type: 4,
  }],
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(":x: | There is nothing playing!")
    const seconds = interaction.options.getInteger("seconds")
    if (isNaN(seconds)) return interaction.reply(":x: | Invalid seconds!")
    try {
      await queue.seek(queue.currentTime + seconds * 1000)
      let palette = await getPalette(song.thumbnail)
      interaction.reply({ embeds: [ new Discord.EmbedBuilder().setTitle('Forward').setDescription(`Forwarded ${seconds} seconds!`).setColor(rgbToHex(palette[0]))] })
    } catch (e) {
      interaction.reply(`:x: | Error: \`${e.message.slice(0, 100)}\``)
    }
    

  }
}
