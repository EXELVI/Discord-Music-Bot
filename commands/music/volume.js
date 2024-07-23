const Discord = require('discord.js');

module.exports = {
  name: 'volume',
  inVoiceChannel: true,
  description: "Set the volume of the music",
  category: "music",
  options: [{
    name: "volume",
    description: "The volume to set",
    required: true,
    type: 4,
  }],
  async execute(interaction, client) {
    let volumee = interaction.options.getInteger("volume")
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(":x: | There is nothing playing!")
    const volume = parseInt(volumee)
    if (isNaN(volume)) return interaction.reply(":x: | Invalid volume!")
    queue.setVolume(volume)
    interaction.reply({ embeds: [ new Discord.EmbedBuilder().setTitle('Volume').setDescription(`Volume set to \`${volume}\``) ] })    
  }
}
