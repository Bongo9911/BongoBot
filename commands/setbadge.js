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
    let player = dm.getPlayerData(message.guildId).filter(p => p.id == message.author.id);

    if (player) {
        let badge = message.content.slice(10).trim();
        if (badge.toLowerCase() in badges) {
            fullData.players.forEach(p => {
                if (p.id == message.author.id) {
                    p.featuredBadge = badges[badge.toLowerCase()];
                }
            })
            console.log(fullData.players.filter(p => p.id == message.author.id));

            dm.saveData(fullData, message.guildId, message.channelId);
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
