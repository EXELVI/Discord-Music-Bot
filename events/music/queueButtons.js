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
        console.log(totPage)
        let page = interaction.message.embeds[0].footer.text.split("/")[0]

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
          for (let interaction = 10 * (page - 1); interaction < 10 * page; interaction++) {
            if (queue.songs[interaction]) {
              songsList += `${interaction + 1}. **${queue.songs[interaction].name.length <= 100 ? queue.songs[interaction].name : `${queue.songs[interaction].name.slice(0, 100)}...`}** - ${queue.songs[interaction].formattedDuration}\r`
            }
          }

          let embed = new Discord.EmbedBuilder()
          .addFields({ name: "Queue", value: songsList }, { name: "Page", value: `${page}/${totPage}` })

          let button1 = new Discord.ButtonBuilder()
            .setLabel("Previous")
            .setStyle(1)
            .setCustomId("previous")

          let button2 = new Discord.ButtonBuilder()
            .setLabel("Next")
            .setStyle(1)
            .setCustomId("Next")

          if (page == 1) button1.setDisabled()
          if (page == totPage) button2.setDisabled()

          let row = new Discord.ActionRowBuilder()
            .addComponents(button1)
            .addComponents(button2)

          interaction.editReply({ embeds: [embed], components: [row] })


    },

};