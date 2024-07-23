const Discord = require('discord.js');

module.exports = {
  name: 'autoplay',
  inVoiceChannel: true,
  tipo: "music",
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return error(interaction, `${client.emotes.error}`, ":x: | There is nothing playing!")
    const autoplay = queue.toggleAutoplay()
    let embed = new Discord.EmbedBuilder()
      .setTitle('AutoPlay')
      .setDescription(`AutoPlay: \`${autoplay ? 'On' : 'Off'}\``)
      .setColor('Blurple')
    interaction.reply({ embeds: [embed] })

  }
}