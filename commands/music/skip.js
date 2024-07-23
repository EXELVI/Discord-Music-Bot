const Discord = require('discord.js');

module.exports = {
  name: 'skip',
  inVoiceChannel: true,
  description: "Skip the current song",
  category: "music",
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(":x: | There is nothing playing!")
    try {
      const song = await queue.skip()
      interaction.reply({ embeds: [ new Discord.EmbedBuilder().setTitle('Skip').setDescription(`Skipped! Now playing: \`${song.name}\``) ] })
    } catch (e) {
      interaction.reply(`:x: | Error: \`${e.message.slice(0, 100)}\``)
    }
  }
}
