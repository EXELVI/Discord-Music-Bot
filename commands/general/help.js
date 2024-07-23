const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
    name: "help",
    description: "Shows all commands",
    category: "general",
    async execute(interaction, client) {
        var commandsid = JSON.parse(fs.readFileSync("./commands.json", "utf8"))
        let totalPage = 2;
        let page = 1;

        var page1commands = []
        var page2commands = []

        let page1 = new Discord.EmbedBuilder() // General
            .setTitle("Music commands")
            .setDescription("All the commands that you can use in the music category")
            .setColor("Blurple")

        let page2 = new Discord.EmbedBuilder() // To-dos
            .setTitle("General commands")
            .setDescription("All the commands that you can use in the general category")
            .setColor("Navy")

        var commands = client.commands.sort((a, b) => a.name.localeCompare(b.name))

        commands.forEach(command => {
            if (command.category == "music")
                page1commands.push({ name: `</${command.name}:${commandsid.find(c => c.name == command.name)?.id}>`, value: command.description })
            if (command.category == "general")
                page2commands.push({ name: `</${command.name}:${commandsid.find(c => c.name == command.name)?.id}>`, value: command.description })
        })
        page1.addFields(page1commands);
        page2.addFields(page2commands);

        let button2 = new Discord.ButtonBuilder()
            .setCustomId("next")
            .setLabel("Next")
            .setStyle("Primary")

        let button1 = new Discord.ButtonBuilder()
            .setCustomId("previous")
            .setLabel("Previous")
            .setStyle("Primary")

        if (page == 1) button1.setDisabled()
        if (page == totalPage) button2.setDisabled()

        let row = new Discord.ActionRowBuilder()
            .addComponents(button1)
            .addComponents(button2)

        interaction.reply({ embeds: [eval("page" + page.toString())], components: [row] })
            .then(msg => {
                const collector = msg.createMessageComponentCollector({ filter: i => i.isButton(), time: 120000 })

                collector.on("collect", async i => {
                    i.deferUpdate()
                    if (i.user.id !== interaction.user.id) {
                        return i.reply({ content: "You can't interact with this", ephemeral: true });
                    }

                    if (i.customId == "previous") {
                        
                        page--
                        if (page < 1) page = 1
                    }
                    if (i.customId == "next") {
                        
                        page++
                        if (page > totalPage) page = totalPage
                    }

                    let button2 = new Discord.ButtonBuilder()
                        .setCustomId("next")
                        .setLabel("Next")
                        .setStyle("Primary")

                    let button1 = new Discord.ButtonBuilder()
                        .setCustomId("previous")
                        .setLabel("Previous")
                        .setStyle("Primary")

                    if (page == 1) button1.setDisabled()
                    if (page == totalPage) button2.setDisabled()

                    let row = new Discord.ActionRowBuilder()
                        .addComponents(button1)
                        .addComponents(button2)

                    interaction.editReply({ embeds: [eval("page" + page.toString())], components: [row] })
                })
            })

    },
};
