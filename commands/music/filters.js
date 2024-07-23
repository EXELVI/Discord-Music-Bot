const Discord = require('discord.js');
const Distube = require('distube')
module.exports = {
  name: 'filter',
  inVoiceChannel: true,
  description: "Apply audio filters to the music",
  category: "music",
  options: [{
    name: "filter",
    description: "Filter",
    required: true,
    type: 3,
    choices: [
      {
        "name": "3D",
        "value": "3d"
      },
      {
        "name": "BassBoost",
        "value": "bassboost"
      },
      {
        "name": "Echo",
        "value": "bassboost"
      },
      {
        "name": "Flanger",
        "value": "flanger"
      },
      {
        "name": "Gate",
        "value": "gate"
      },
      {
        "name": "Haas",
        "value": "haas"
      },
      {
        "name": "Karaoke",
        "value": "karaoke"
      },
      {
        "name": "Nightcore",
        "value": "nightcore"
      },
      {
        "name": "Reverse",
        "value": "reverse"
      },
      {
        "name": "Vaporwave",
        "value": "vaporwave"
      },
      {
        "name": "Mcompand",
        "value": "mcompand"
      },
      {
        "name": "Phaser",
        "value": "phaser"
      },
      {
        "name": "Tremolo",
        "value": "tremolo"
      },
      {
        "name": "Surround",
        "value": "surround"
      },
      {
        "name": "Earwax",
        "value": "earwax"
      },
      {
        "name": "Off",
        "value": "off"
      }
    ]
  }
  ],
  async execute(interaction, client) {
        /**
     * @type {Distube.Queue}
     * */
    const queue = client.distube.getQueue(interaction)
    if (!queue) return await interaction.reply(":x: | There is nothing playing!")
    const filter = await interaction.options.getString("filter")
    if (filter === 'off' && queue.filters.size) queue.filters.clear()
    else if (Object.keys(client.distube.filters).includes(filter)) {
      if (queue.filters.has(filter)) queue.filters.remove(filter)
      else queue.filters.add(filter)
    }
    interaction.reply(`:white_check_mark: | ${filter.charAt(0).toUpperCase() + filter.slice(1)} filter is now ${queue.filters.has(filter) ? "enabled" : "disabled"}\n ${queue.filters.size ? "**Filters:** " + queue.filters.names.map((f) => f.charAt(0).toUpperCase() + f.slice(1)).join(", ") : ""}`)
  }
}
