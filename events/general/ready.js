const colors = require('colors/safe');
const Discord = require('discord.js');
const chalk = require('chalk');
const fs = require('fs');

const ascii = [
    `888b     d888                   d8b          `,
    `8888b   d8888                   Y8P          `,
    `88888b.d88888                                `,
    `888Y88888P888 888  888 .d8888b  888  .d8888b `,
    `888 Y888P 888 888  888 88K      888 d88P"    `,
    `888  Y8P  888 888  888 "Y8888b. 888 888      `,
    `888   "   888 Y88b 888      X88 888 Y88b.    `,
    `888       888  "Y88888  88888P' 888  "Y8888P `
]

function fadeColors(colors) {
    const startColor = [255, 0, 0];
    const endColor = [0, 0, 255];


    const colorSteps = colors.length - 1;

    const colorFade = [];
    for (let i = 0; i <= colorSteps; i++) {
        const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * (i / colorSteps));
        const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * (i / colorSteps));
        const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * (i / colorSteps));
        colorFade.push([r, g, b]);
    }

    for (let i = 0; i < colorFade.length; i++) {
        const color = colorFade[i];
        console.log(chalk.rgb(color[0], color[1], color[2])(colors[i]))
    }
}

module.exports = {
    name: 'ready',
    execute: async (client) => {
        console.log("Bot is ready!");
        colors.enable();
        console.log(colors.green(`-- ONLINE --`));
        fadeColors(ascii);
        console.log(colors.blue(`
User: ${client.user.tag}
      
        `))

        if (process.env.commands != "false") {

            const globalCommands = []

            console.log("Starting commands creation!")
            let guildCommands = []

            await client.commands
                .forEach(async command => {
                    let data = command.data || {}
                    data.name = command.name
                    data.description = (command.onlyStaff ? "🔒" : "") + command.description
                    if (command.options) data.options = command.options
                    if (command.integration_types) data.integration_types = command.integration_types
                    if (command.contexts) data.contexts = command.contexts

                    if (!guildCommands.find(x => x.name == command.name)) {
                        globalCommands.push(data)

                        if (command.type) {
                            var data2 = {
                                name: command.name,
                                type: command.type,
                            }
                            if (command.integration_types) data2.integration_types = command.integration_types
                            if (command.contexts) data2.contexts = command.contexts
                            globalCommands.push(data2)
                        }
                    }
                })

            const rest = new Discord.REST().setToken(process.env.token);

            console.log(`Started refreshing ${globalCommands.length} application (/) commands.`);

            const data = await rest.put(
                Discord.Routes.applicationCommands("1139163650632990721"),
                { body: globalCommands },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);

            let db = JSON.parse(await fs.readFileSync("./commands.json", "utf-8"))

            data.forEach(async cmd => {
                let cmdDb = db.find(x => x.name == cmd.name)
                if (!cmdDb) {
                    db.push({ name: cmd.name, id: cmd.id })
                } else {
                    cmdDb.id = cmd.id
                }

                console.log("------------------------ Created ------------------------\n", cmd.name)
            })

            await fs.writeFileSync("./commands.json", JSON.stringify(db, null, 2))


            console.log("Commands created!")
        } else console.log("Commands creation disabled!")



    }
}