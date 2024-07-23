const Discord = require('discord.js');

module.exports = {
  name: 'previous',
  inVoiceChannel: true,
  description: "Play the previous song",
  category : "music",
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(":x: | There is nothing playing!")
    const song = await queue.previous()
    interaction.reply({ embeds: [ new Discord.EmbedBuilder().setTitle('Previous').setDescription(`Playing previous song: \`${song.name}\``) ] })
    
  }
}
