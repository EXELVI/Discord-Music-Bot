const Discord = require('discord.js');
const fetch = require('node-fetch');
const Distube = require('distube')
const Jimp = require('jimp');

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

    console.log(song.thumbnail);
    let palette;
    try {
      const response = await fetch(song.thumbnail);
      if (response.ok) {
        const buffer = await response.buffer();

        const img = await Jimp.read(buffer);

        const colors = [];
        img.resize(10, 10).scan(0, 0, 10, 10, function (x, y, idx) {
          const red = this.bitmap.data[idx + 0];
          const green = this.bitmap.data[idx + 1];
          const blue = this.bitmap.data[idx + 2];
          colors.push([red, green, blue]);
        });

        const frequency = {};
        colors.forEach(color => {
          const key = color.join(',');
          frequency[key] = (frequency[key] || 0) + 1;
        });

        palette = Object.keys(frequency).map(key => key.split(',').map(Number)).sort((a, b) => frequency[b.join(',')] - frequency[a.join(',')]);

      } else {
        console.log('Failed to fetch image:', response.status, response.statusText);
        palette = [[255, 255, 255]]; // Example: white
      }
    } catch (e) {
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
      .setImage(song.thumbnail)

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

    const queueButton = new Discord.ButtonBuilder()
      .setCustomId('queue')
      .setEmoji('📜')
      .setLabel(queue.songs.length + ' songs')
      .setStyle('Secondary')



    const row = new Discord.ActionRowBuilder()
      .addComponents(volumeButton, pauseButton, loopButton, autoplayButton, queueButton)

    interaction.reply({ embeds: [embed], components: [row] })




  }
}
