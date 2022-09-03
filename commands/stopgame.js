const { MessageEmbed } = require('discord.js');
const DataManager = require('../data/dataManager');

let dm = DataManager.getInstance();

exports.run = async (bot, message, args) => {
    let settingsData = dm.getGuildSettings(message.guildId);
    if (settingsData.admins.indexOf(message.author.id) !== -1) {
        let data = dm.getGameData(message.guildId, message.channelId);
        if (data && data.active) {
            message.reply("Are you sure you want to end the current game?\nReply 'Yes' or 'No'.").then(() => {
                let filter = m => m.author.id === message.author.id
                message.channel.awaitMessages({
                    filter,
                    max: 1,
                    time: 30000,
                    errors: ['time']
                }).then(messages => {
                    let message = messages.first();
                    if (message.content.toUpperCase() == "YES") {
                        data.active = false;
                        dm.saveGameData(data, message.guildId, message.channelId);
                        message.reply("Game stopped");
                    }
                    else {
                        message.reply('Request Cancelled');
                    }
                }).catch(collected => {
                    message.reply('Request Timed Out');
                });
            })
        }
        else {
            message.reply("There is currently no active game.");
        }
    }
    else {
        message.reply("Only admins can perform this action.");
    }
}

exports.help = {
    name: ["stopgame", "stop"]
}
