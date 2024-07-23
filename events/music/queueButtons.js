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

        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith("queue|")) return;
        /**
            * @type {Distube.Queue}
            * */
        const queue = client.distube.getQueue(interaction)
        if (!queue) return interaction.reply({ content: ":x: | There is nothing playing!", ephemeral: true })
        const song = queue.songs[0]

        interaction.deferUpdate()

        let totPage = Math.ceil(queue.songs.length / 10)

        let page = parseInt(interaction.message.embeds[0].footer.text.split("/")[0].split(" ")[1])

        if (interaction.user.id != interaction.user.id) return interaction.reply({ content: "You can't use this button!", ephemeral: true })

        if (interaction.customId == "queue|previous") {
            page--
            if (page < 1) page = 1
        }
        if (interaction.customId == "queue|next") {
            page++
            if (page > totPage) page = totPage
        }

        let songsList = ""
        for (let i = 10 * (page - 1); i < 10 * page; i++) {
            if (queue.songs[i]) {
                songsList += `${i + 1}. ${i == 0 ? "__" : " "}**${queue.songs[i].name.length <= 63 ? queue.songs[i].name : `${queue.songs[i].name.slice(0, 63)}...`}** - ${queue.songs[i].formattedDuration} ${i == 0 ? "__" : " "}\r`
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

        interaction.message.edit({ embeds: [embed], components: [row] })


    },

};