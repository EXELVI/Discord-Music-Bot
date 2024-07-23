const Discord = require('discord.js');

const { ChannelType, EmbedBuilder } = require('discord.js');


module.exports = {
    name: "messageCreate",
    async execute(message) {
        try {
            if (message.channel.type != ChannelType.DM) return
            if (message.content.toLowerCase().split(" ").includes("hello")) if (getRandomIntInclusive(1, 4) == 3) message.channel.send("Hello!")
            if (message.content.toLowerCase().split(" ").includes("hi")) if (getRandomIntInclusive(1, 4) == 3) message.channel.send("Hi!")
        } catch {

        }

    },

};