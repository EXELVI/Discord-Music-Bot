const Discord = require('discord.js');
const ColorThief = require("../../color-thief.js")
const fetch = require('node-fetch');
const Distube = require('distube')
module.exports = {
  name: 'nowplaying',
  aliases: ['np'],
  inVoiceChannel: true,
  description: "Shows the current playing song",
  category: "music",
  /**
   * 
   * @param {Discord.BaseInteraction} interaction Interaction
   * @param {Discord.ClientApplication} client 
   * @returns void
   */
  async execute(interaction, client) {
    /**
     * @type {Distube.Queue}
     * */
    const queue = client.distube.getQueue(interaction)
    if (!queue) return interaction.reply(":x: | There is nothing playing!")
    const song = queue.songs[0]

    const colorThief = new ColorThief();
    console.log(song.thumbnail)
    let palette;
    try {
      const response = await fetch(song.thumbnail);
      if (response.ok) {
        const buffer = await response.buffer();
        console.log(buffer)
        palette = await colorThief.getPalette(buffer)
      } else {
        console.log('Failed to fetch image:', response.status, response.statusText);
        palette = [[255, 255, 255]]; // Example: white
      }
    } catch (e) {
      console.log(e);
      palette = [[255, 255, 255]]; // Example: white
    }
    
    console.log(palette);
    const embed = new Discord.EmbedBuilder()
      .setTitle(song.name)
      .setURL(song.url)
      .setDescription("Playing \n\`\`\`" + song.name + "\`\`\`")
      .setColor(palette[0])
      .addFields({ name: 'Requested by', value: song.user.toString() },
        { name: 'Duration', value: song.formattedDuration },
        { name: "Filter" + (queue.filters.length > 0 ? "s [" + queue.filters.length + "]" : ""), value: queue.filters.names.map(f => `\`f\``).join("\n ") || "Off" },)
      .setThumbnail(song.thumbnail)

    const volumeButton = new Discord.ButtonBuilder()
      .setCustomId('volume')
      .setEmoji('🔊')
      .setLabel(queue.volume + '%')
      .setStyle('Secondary')
      .setDisabled(true)

    const pauseButton = new Discord.ButtonBuilder()
      .setCustomId('pause')
      .setEmoji('⏸')
      .setLabel(queue.paused ? 'Resume' : 'Pause')
      .setStyle('Secondary')

    const loopButton = new Discord.ButtonBuilder()
      .setCustomId('loop')
      .setEmoji('🔁')
      .setLabel(queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off')
      .setStyle('Secondary')

    const autoplayButton = new Discord.ButtonBuilder()
      .setCustomId('autoplay')
      .setEmoji('🔄')
      .setLabel(queue.autoplay ? 'On' : 'Off')
      .setStyle('Secondary')

    const row = new Discord.ActionRowBuilder()
      .addComponents(volumeButton, pauseButton, loopButton, autoplayButton)

    interaction.reply({ embeds: [embed], components: [row] })




  }
}
