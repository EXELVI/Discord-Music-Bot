require('events').EventEmitter.prototype._maxListeners = 200;

const Discord = require("discord.js");
const { DisTube, Events } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { YouTubePlugin } = require('@distube/youtube');
const { DirectLinkPlugin } = require('@distube/direct-link');
const { FilePlugin } = require('@distube/file');
const { AppleMusicPlugin } = require('distube-apple-music');
const ytdl = require("@distube/ytdl-core");

const dotenv = require('dotenv');
const fs = require("fs");
const Jimp = require('jimp').default;
const fetch = require('node-fetch');
const { ytCookies } = require('./ytCookies.js');

dotenv.config();

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.MessageContent
    ],
    partials: [
        Discord.Partials.Channel,
        Discord.Partials.Message,
        Discord.Partials.Reaction,
        Discord.Partials.User,
        Discord.Partials.GuildMember,
        Discord.Partials.ThreadMember,
        Discord.Partials.Reaction
    ]
});

const packageJSON = require("./package.json");
console.log("Siamo in V" + packageJSON.dependencies["discord.js"]);

client.emotes = {
    play: "▶️",
    stop: "⏹️",
    queue: "📄",
    success: "☑️",
    repeat: "🔁",
    error: "❌"
};

client.commands = new Discord.Collection();
const commandsFolder = fs.readdirSync("./commands");
commandsFolder.forEach(folder => {
    const commandsFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
    commandsFiles.forEach(file => {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    });
});

const eventsFolders = fs.readdirSync('./events');
eventsFolders.forEach(folder => {
    const eventsFiles = fs.readdirSync(`./events/${folder}`).filter(file => file.endsWith('.js'));
    eventsFiles.forEach(file => {
        const event = require(`./events/${folder}/${file}`);
        client.on(event.name, (...args) => event.execute(...args, client));
    });
});

const functionFiles = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
functionFiles.forEach(file => require(`./functions/${file}`));

const rgbToHex = ([r, g, b]) => ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');

const getPalette = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch image');

        const buffer = await response.buffer();
        const img = await Jimp.read(buffer);
        const colors = [];

        img.resize(10, 10).scan(0, 0, 10, 10, function (x, y, idx) {
            colors.push([this.bitmap.data[idx], this.bitmap.data[idx + 1], this.bitmap.data[idx + 2]]);
        });

        const frequency = colors.reduce((acc, color) => {
            const key = color.join(',');
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        return Object.keys(frequency)
            .map(key => key.split(',').map(Number))
            .sort((a, b) => frequency[b.join(',')] - frequency[a.join(',')]);
    } catch {
        return [[255, 255, 255]];
    }
};

const main = async () => {

 

   let cookies = null;
    if (fs.existsSync('yt-cookies.json')) {
        try {
            cookies = JSON.parse(fs.readFileSync('yt-cookies.json', 'utf8'));
            console.log("✅ Loaded 'yt-cookies.json'");
        } catch {
            console.error("❌ Failed to load 'yt-cookies.json'");
            if (process.env.googlMail && process.env.googlPass) {
                cookies = await ytCookies();
            }
        }
    } else if (process.env.googlMail && process.env.googlPass) {
        cookies = await ytCookies();
    } else {
        console.log("'yt-cookies.json' not found");
    } 

    if (!cookies) {
        console.warn('❌ No cookies found, requests to YouTube may be blocked');
    }

    const plugins = [new YouTubePlugin({cookies: cookies }), new SpotifyPlugin(), new AppleMusicPlugin(), new DirectLinkPlugin(), new FilePlugin(), new YtDlpPlugin({ update: true })];


    console.log(`✅ Loaded ${plugins.length} plugins`);

    client.distube = new DisTube(client, {
        emitNewSongOnly: true,
        emitAddSongWhenCreatingQueue: false,
        emitAddListWhenCreatingQueue: false,
        plugins
      });
      
   // client.distube.on(Events.FFMPEG_DEBUG, console.log);


    client.distube
        .on('playSong', async (queue, song) => {
            const palette = await getPalette(song.thumbnail);
            const embed = new Discord.EmbedBuilder()
                .setTitle(`${client.emotes.play} Playing`)
                .setURL(song.url)
                .setDescription(song.name)
                .setImage(song.thumbnail)
                .setColor(rgbToHex(palette[0]))
                .addFields({ name: ' Duration', value: `${song.formattedDuration}`, inline: true }, { name: 'Requested by', value: `${song.user}`, inline: true })

            const row = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder().setCustomId('volume').setEmoji('🔊').setLabel(`${queue.volume}%`).setStyle('Secondary').setDisabled(true),
                new Discord.ButtonBuilder().setCustomId('pause').setEmoji('⏸').setLabel(queue.paused ? 'Resume' : 'Pause').setStyle('Secondary'),
                new Discord.ButtonBuilder().setCustomId('loop').setEmoji('🔁').setLabel(queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off').setStyle('Secondary'),
                new Discord.ButtonBuilder().setCustomId('autoplay').setEmoji('🔄').setLabel(queue.autoplay ? 'On' : 'Off').setStyle(queue.autoplay ? 'Primary' : 'Secondary'),
                new Discord.ButtonBuilder().setCustomId('queue').setEmoji('📜').setLabel(`${queue.songs.length} songs`).setStyle('Secondary')
            );

            queue.textChannel.send({ embeds: [embed], components: [row] });
        })// 
        .on('addSong', async (queue, song) => {
            const palette = await getPalette(song.thumbnail);
            console.log(song, palette);
            const embed = new Discord.EmbedBuilder()
                .setTitle(`${client.emotes.play} Added to the queue`)
                .setDescription(song.name)
                .setURL(song.url)
                .setColor(rgbToHex(palette[0]))
                .addFields({ name: 'Duration', value: `${song.formattedDuration}`, inline: true }, { name: 'Requested by', value: `${song.user}`, inline: true })
                .setImage(song.thumbnail);
            queue.textChannel.send({ embeds: [embed] });
        })
        .on('addList', (queue, playlist) => {
            const embed = new Discord.EmbedBuilder()
                .setTitle(`${client.emotes.play} Added to the queue`)
                .setDescription(playlist.name)
                .addFields({ name: 'Duration', value: `${playlist.duration}`, inline: true }, { name: "Songs", value: "" + playlist.songs.length, inline: true }, { name: 'Requested by', value: `${playlist.user}`, inline: true })
                .setImage(playlist.thumbnail)
                .setURL(playlist.url);
            queue.textChannel.send({ embeds: [embed] });
        })
        .on('error', (e, queue) => {
            console.error(e);
            queue.textChannel.send(`${client.emotes.error} | An error encountered: ${e?.message?.slice(0, 1582)}`);
        })
        .on('empty', msg => msg.channel.send('Channel is empty, leaving the channel'))
        .on('searchNoResult', (message, query) => message.channel.send(`${client.emotes.error} | No result found for ${query}!`))
        .on('finish', queue => queue.textChannel.send('Finished!'));

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return interaction.reply({ content: "Error!", ephemeral: true });

        if (command.inVoiceChannel && !interaction.member.voice.channel) {
            return interaction.reply({ content: ":x: | You must be in a voice channel to use this command", ephemeral: true });
        }
        await command.execute(interaction, client);
    });

    process.on("uncaughtException", console.log);
    process.on("unhandledRejection", console.log);

    client.login(process.env.token);
};

main().catch(console.error);
