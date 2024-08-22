# 🎵 Discord Music Bot

![GitHub repo size](https://img.shields.io/github/repo-size/EXELVI/Discord-Music-Bot?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/EXELVI/Discord-Music-Bot?style=for-the-badge)
![GitHub stars](https://img.shields.io/github/stars/EXELVI/Discord-Music-Bot?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/EXELVI/Discord-Music-Bot?style=for-the-badge)
![GitHub pull requests](https://img.shields.io/github/issues-pr/EXELVI/Discord-Music-Bot?style=for-the-badge)

![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PNPM](https://img.shields.io/badge/PNPM-CF51E1?style=for-the-badge&logo=pnpm&logoColor=white)
![Distube](https://img.shields.io/badge/Distube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)

A simple Discord Music Bot made with Discord.js and Distube.

## ✨ Features

- Play music from YouTube, SoundCloud, Spotify, and more (also supports audio files)
- Queue system
- Loop, autoplay, shuffle, and repeat
- Volume control
- Pause, resume, skip, stop, and leave
- Forward, rewind, and seek
- Play next, play previous, and skipto
- Now playing, queue, and clear queue
- Play now, play top, and play related


## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [PNPM](https://pnpm.io/installation)
- [FFmpeg](https://ffmpeg.org/download.html)

### Setup

1.  Clone the repository:

    ```bash
    git clone https://github.com/EXELVI/Discord-To-Do-Bot.git
    cd Discord-To-Do-Bot
    ```

2.  Install the dependencies:

    If you are using [pnpm](https://pnpm.io/):

    ```bash
        pnpm install
    ```

    else:

    ```bash
        npm install
    ```

3.  Create a `.env` file in the root directory and add the following:

    ```env
    token=YOUR_DISCORD_BOT_TOKEN
    ```

4.  Start the bot:

    ```bash
    node index.js
    ```


## 📝 Commands

- General
  - `help` - Lists all commands
  - `ping` - Returns the bot's latency
  - `uptime` - Returns the bot's uptime

- Music
  - `autoplay` - Toggles autoplay
  - `filters` - Shows all available filters
  - `forward` - Forwards the current song
  - `join` - Joins the voice channel
  - `leave` - Leaves the voice channel
  - `nowplaying` - Shows the current playing song
  - `pause` - Pauses the current song
  - `play` - Plays a song
  - `playnow` - Plays a song instantly
  - `playtop` - Plays a song at the top of the queue
  - `previous` - Plays the previous song
  - `queue` - Shows the queue
  - `repeat` - Toggles repeat
  - `resume` - Resumes the current song
  - `rewind` - Rewinds the current song
  - `shuffle` - Shuffles the queue
  - `skip` - Skips the current song
  - `skipto` - Skips to a specific song
  - `stop` - Stops the current song
  - `volume` - Sets the volume

## 📂 Project Structure

```bash
Discord-Music-Bot
│   .env                # (excluded from git)
│   .gitattributes
│   .gitignore
│   .node-version
│   bot.js               # Handles the bot's shard
│   commands.json        # Command IDs list, database
│   index.js             # Main file, shard manager
│   package-lock.json
│   package.json
│   pnpm-lock.yaml
│   README.md           # You are here!
│
├───commands            # Commands directory
│   ├───general
│   │       help.js     # Help command, lists all commands
│   │       ping.js     # Ping command, returns the bot's latency
│   │       uptime.js   # Uptime command, returns the bot's uptime
│   │
│   └───music
│           autoplay.js
│           filters.js
│           forward.js
│           join.js
│           leave.js
│           nowplaying.js
│           pause.js
│           play.js
│           playnow.js
│           playtop.js
│           previous.js
│           queue.js
│           repeat.js
│           resume.js
│           rewind.js
│           shuffle.js
│           skip.js
│           skipto.js
│           stop.js
│           volume.js
│
├───events
│   ├───general
│   │       dmMessage.js # Reply's Hi randomly if a user sends a message with "Hi" or "Hello"
│   │       ready.js    # Logs the bot's ready event, registers slash commands
│   │
│   └───music
│           buttons.js  # Handles the button interactions, like "volume", "pause", "loop", "autoplay", "queue"
│           loopButtons.js # Handles the loop buttons interactions (song, queue, off)
│           queueButtons.js # Handles the queue buttons interactions (next, previous)
│
└───functions
        general.js
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/EXELVI/Discord-To-Do-Bot/issues).