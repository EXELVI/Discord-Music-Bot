require('events').EventEmitter.prototype._maxListeners = 200;

const Discord = require("discord.js")

const client = new Discord.Client({
    intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildVoiceStates, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.GuildPresences, Discord.GatewayIntentBits.GuildMessageReactions, Discord.GatewayIntentBits.DirectMessages, Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.MessageContent],
    partials: [Discord.Partials.Channel, Discord.Partials.Message, Discord.Partials.Reaction, Discord.Partials.User, Discord.Partials.GuildMember, Discord.Partials.ThreadMember, Discord.Partials.Reaction]
});

const packageJSON = require("./package.json");
const discordJSVersion = packageJSON.dependencies["discord.js"];
console.log("Siamo in V" + discordJSVersion)
require('dotenv').config()
const fs = require("fs");
const moment = require("moment");
const Parser = require('expr-eval').Parser;
const ms = require("ms");

const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')

client.distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin({
            emitEventsAfterFetching: true
        }),
        new SoundCloudPlugin(),
        new YtDlpPlugin()
    ]
})

client.emotes = {
    "play": "▶️",
    "stop": "⏹️",
    "queue": "📄",
    "success": "☑️",
    "repeat": "🔁",
    "error": "❌"

}

//COMMANDS
client.commands = new Discord.Collection();
const commandsFolder = fs.readdirSync("./commands");
for (const folder of commandsFolder) {
    const commandsFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
    for (const file of commandsFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}
//EVENTS
const eventsFolders = fs.readdirSync('./events');
for (const folder of eventsFolders) {
    const eventsFiles = fs.readdirSync(`./events/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of eventsFiles) {
        const event = require(`./events/${folder}/${file}`);
        client.on(event.name, (...args) => event.execute(...args));
    }
}
//FUNCTIONS
const functionFiles = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
for (const file of functionFiles) {
    require(`./functions/${file}`);
}




client.on("interactionCreate", async (interaction) => {
    if (interaction.type != "APPLICATION_COMMAND") {
        if (!interaction.isCommand()) return
    }
    let comando = client.commands.get(interaction.commandName)
    if (!comando) return interaction.reply({ content: "Error!", ephemeral: true })


    if (comando?.inVoiceChannel && !interaction.member.voice.channel) {
        return interaction.channel.send(`${client.emotes.error} | You must be in a voice channel!`)
    }
    await comando.execute(interaction, client);
})


process.on("uncaughtException", err => {
    return console.log(err);
})
process.on("unhandledRejection", err => {
    return console.log(err);
})





client.login(process.env.token)