const Discord = require('discord.js');
const { options } = require('./skipto');

module.exports = {
  name: 'rewind',
  inVoiceChannel: true,
  description: "Rewind the song for a specific amount of time",
 category: "music",
  options: [{
    name: "seconds",
    description: "The amount of seconds to rewind",
    required: true,
    type: 4,
  }],
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(":x: | There is nothing playing!")
    const seconds = interaction.options.getInteger("seconds")
    if (isNaN(seconds)) return interaction.reply(":x: | Invalid seconds!")
    try {
      await queue.seek(queue.currentTime - time)
      interaction.reply({ embeds: [ new Discord.EmbedBuilder().setTitle('Rewind').setDescription(`Rewinded ${seconds} seconds!`) ] })
    } catch (e) {
      interaction.reply(`:x: | Error: \`${e.message.slice(0, 100)}\``)
    }
    

  }
}
