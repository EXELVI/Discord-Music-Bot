require('dotenv').config()

const Discord = require('discord.js');
const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./bot.js', { token: process.env.token });

manager.on('shardCreate', shard => console.log(`Launched music shard ${shard.id}`));

manager.spawn();

process.on("uncaughtException", err => {
    return console.log(err);
})
process.on("unhandledRejection", err => {
    return console.log(err);
})

