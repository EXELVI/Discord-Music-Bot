const Discord = require('discord.js');

module.exports = {
  name: 'repeat',
  inVoiceChannel: true,
  description: "Set the repeat mode",
  category: "music",
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(":x: | There is nothing playing!")

    let embed = new Discord.EmbedBuilder()
      .setTitle("Repeat Mode")

    let button1 = new Discord.ButtonBuilder()
      .setLabel("Off")
      .setStyle(2)
      .setCustomId("loop|off")

    let button2 = new Discord.ButtonBuilder()
      .setLabel("Song")
      .setStyle(2)
      .setCustomId("loop|song")

    let button3 = new Discord.ButtonBuilder()
      .setLabel("Queue")
      .setStyle(2)
      .setCustomId("loop|queue")

    switch (queue.repeatMode) {
      case 0:
        button1.setStyle(3)
        break;
      case 1:
        button2.setStyle(3)
        break;
      case 2:
        button3.setStyle(3)
        break;
    }


    let row = new Discord.ActionRowBuilder()
      .addComponents(button1)
      .addComponents(button2)
      .addComponents(button3)


    interaction.reply({ embeds: [embed], components: [row] })



  }
}
