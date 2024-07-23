const Discord = require('discord.js');

const { Constants } = require('discord.js')

module.exports = {
  name: 'join',
  description: "Makes the bot join the voice channel you are in or the voice channel you specify",
  inVoiceChannel: true,
  category: "music",
  options: [{
    name: "channel",
    description: "The voice channel you want the bot to join",
    required: false,
    type: 7,
}],
  async execute(interaction, client) {
    let voiceChannel = interaction.member.voice.channel
    if (await interaction.options.getChannel("channel")) {
      voiceChannel = await interaction.options.getChannel("channel")
      if (!Constants.VoiceBasedChannelTypes.includes(voiceChannel?.type)) {
        return
      }
    }
    client.distube.voices.join(voiceChannel)
    interaction.reply("Joined the voice channel " + voiceChannel.toString()) 
  }
}
