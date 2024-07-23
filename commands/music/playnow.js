const Discord = require('discord.js');

module.exports = {
  name: "playnow",
  description: "Plays a song immediately skipping the queue",
  inVoiceChannel: true,
  tipo: "music",
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
          skip: true
      })
      interaction.reply("Searching...")
  },
};