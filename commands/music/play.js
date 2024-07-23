const Discord = require('discord.js');

module.exports = {
    name: "play",
    description: "Plays a song",
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
            interaction
        });

        interaction.reply("Searching...")
    },
};