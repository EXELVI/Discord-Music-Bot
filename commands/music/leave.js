const Discord = require('discord.js');

module.exports = {
  name: 'leave',
  description: "Makes the bot leave the voice channel",
  category: "music",
  async execute(interaction, client) {
    client.distube.voices.leave(interaction)
    interaction.reply(":wave: | Left the voice channel!")
  }
}
  