const Discord = require('discord.js');
const Distube = require('distube')
module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {Discord.BaseInteraction} interaction Interaction
     * @param {Discord.ClientApplication} client 
     * @returns void
     */
    async execute(interaction, client) {
        var alowedIds = ["volume", "pause", "loop", "autoplay", "queue"]
        if (!interaction.isButton()) return;
        if (!alowedIds.includes(interaction.customId)) return;
        /**
            * @type {Distube.Queue}
            * */
           //all replies are ephemeral
        const queue = client.distube.getQueue(interaction)
        if (!queue) return interaction.reply({content: ":x: | There is nothing playing!", ephemeral: true})
        const song = queue.songs[0]

        



    },

};