const Discord = require('discord.js');
const { inVoiceChannel } = require('./pause');

module.exports = {
  name: 'queue',
  description: "Shows the queue",
  category: "music",
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(":x: | There is nothing playing!")

    let totPage = Math.ceil(queue.songs.length / 10)
    let page = 1

    let songsList = ""
    for (let i = 10 * (page - 1); i < 10 * page; i++) {
      if (queue.songs[i]) {
        songsList += `${i + 1}. ${i == 0 ? "__" : " "}**[${queue.songs[i].name.length <= 63 ? queue.songs[i].name : `${queue.songs[i].name.slice(0, 63)}...`}](${queue.songs[i].url})** - ${queue.songs[i].formattedDuration} ${i == 0 ? "__" : " "}\r`
      }
    }

    let embed = new Discord.EmbedBuilder()
      .addFields({ name: "Queue", value: songsList })
      .setFooter({ text: `Page ${page}/${totPage}` })

    let button1 = new Discord.ButtonBuilder()
      .setLabel("Previous")
      .setStyle(1)
      .setCustomId("queue|previous")

    let button2 = new Discord.ButtonBuilder()
      .setLabel("Next")
      .setStyle(1)
      .setCustomId("queue|next")

    if (page == 1) button1.setDisabled()
    if (page == totPage) button2.setDisabled()

    let row = new Discord.ActionRowBuilder()
      .addComponents(button1)
      .addComponents(button2)

      interaction.reply({ embeds: [embed], components: [row] })
  }
}
