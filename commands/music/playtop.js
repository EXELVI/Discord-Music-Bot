const Discord = require('discord.js');

module.exports = {
  name: "playtop",
  description: "Place a song at the top of the queue",
  inVoiceChannel: true,
  category: "music",
  options: [{
      name: 'song',
      description: "Song/url to play",
      required: true,
      type: 3,
  }],
  async execute(interaction, client) {
      let querry = interaction.options.getString('song');

      client.distube.play(interaction.member.voice.channel, querry, {
          member: interaction.member,
          textChannel: interaction.channel,
          interaction,
          position: 1
      })
      interaction.reply("Searching...")
  },
};