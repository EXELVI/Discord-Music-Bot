const Discord = require('discord.js');

module.exports = {
  name: 'skipto',
  inVoiceChannel: true,
  description: "Skip to a specific song in the queue",
  category: "music",
  options: [{
    name: 'number',
    description: "The number of the song in the queue",
    required: true,
    type: 4,
  }],
    async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(":x: | There is nothing playing!")
    const num = interaction.options.getInteger('number')
    await client.distube.jump(interaction, num).then(song => {
      interaction.reply({ embeds: [ new Discord.EmbedBuilder().setTitle('Skip').setDescription(`Skipped! Now playing: \`${song.name}\``) ] })
    })
  }
}
