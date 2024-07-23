const Discord = require('discord.js');

module.exports = {
  name: 'shuffle',
  inVoiceChannel: true,
  description: "Shuffle the queue",
  category: "music",
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(":x: | There is nothing playing!")
    queue.shuffle()
    interaction.reply({ embeds: [ new Discord.EmbedBuilder().setTitle('Shuffle').setDescription('Shuffled the queue!').setColor('Blurple') ] })
  }
}
