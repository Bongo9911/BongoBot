const { MessageEmbed } = require('discord.js');
const DataManager = require('../data/dataManager');

let dm = DataManager.getInstance();

let badges = {
    "killer": "Killer",
    "hero": "Hero",
    "serial killer": "Serial Killer",
    "savior": "Savior",
    "memento mori": "Memento Mori",
    "double trouble": "Double Trouble",
    "finishing blow": "Finishing Blow"
}

exports.run = async (bot, message, args) => {
    let players = dm.getPlayerData(message.guildId)
    let player = players.filter(p => p.id == message.author.id);

    if (player) {
        let badge = message.content.slice(10).trim();
        if (badge.toLowerCase() in badges) {
            player.featuredBadge = badges[badge.toLowerCase()];

            dm.savePlayerData(players, message.guildId, message.channelId);
            message.reply("Featured badge successfully set");
        }
        else {
            message.reply("Badge " + badge + " not found.");
        }
    }
    else {
        message.reply("Player has no badges to set.");
    }
}

exports.help = {
    name: ["setbadge", "setb"]
}
