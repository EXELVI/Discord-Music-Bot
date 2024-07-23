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
      .setCustomId("off")

    let button2 = new Discord.ButtonBuilder()
      .setLabel("Song")
      .setStyle(2)
      .setCustomId("song")

    let button3 = new Discord.ButtonBuilder()
      .setLabel("Queue")
      .setStyle(2)
      .setCustomId("queue")


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
      .then(msg => {
        const collector = msg.createMessageComponentCollector({ filter: i => i.isButton(), time: 120000 })

        collector.on("collect", i => {
          i.deferUpdate()

          let mode = null
          switch (i.customId) {
            case 'off':
              mode = 0
              button1.setStyle(3)
              button2.setStyle(2)
              button3.setStyle(2)
              break
            case 'song':
              mode = 1
              button2.setStyle(3)
              button1.setStyle(2)
              button3.setStyle(2)
              break
            case 'queue':
              mode = 2
              button3.setStyle(3)
              button2.setStyle(2)
              button1.setStyle(2)
              break
          }
          mode = queue.setRepeatMode(mode)
          mode = mode ? (mode === 2 ? 'Queue' : 'Song') : 'Off'

          row = new Discord.ActionRowBuilder()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)


          interaction.editReply({ embeds: [embed], components: [row] })

        })

        collector.on("end", () => {
          button1.setDisabled(true)
          button2.setDisabled(true)
          button3.setDisabled(true)

          row = new Discord.ActionRowBuilder()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)

          interaction.editReply({ embeds: [embed], components: [row] })
        })
      })


      }
}
