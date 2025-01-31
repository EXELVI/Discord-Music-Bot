const { ChannelType } = require('discord.js');

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const responses = {
    hello: "Hello!",
    hi: "Hi!", 
    ciao: "Ciao!",
    hey: "Hey!",
    sup: "Sup!",
    howdy: "Howdy!",
    hola: "Hola!",
    bonjour: "Bonjour!",
   
};

module.exports = {
    name: "messageCreate",
    async execute(message) {
        try {
            if (message.channel.type !== ChannelType.DM) return;

            const words = message.content.toLowerCase().split(" ");
            for (const word of words) {
                if (responses[word] && getRandomIntInclusive(1, 4) === 3) {
                    await message.channel.send(responses[word]);
                    break;
                }
            }
        } catch (error) {
            console.error(error);
        }
    },
};  