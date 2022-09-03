const { MessageEmbed } = require('discord.js');
const DataManager = require('../data/dataManager');

let dm = DataManager.getInstance();

let items = [];
let players = [];
let kills = [];
let killers = [];

exports.run = async (bot, message, args) => {
    let fullData = dm.getGameData(message.guildId, message.channelId);
    items = fullData.items;
    players = dm.getPlayerData(message.guildId);
    kills = fullData.kills;
    killers = fullData.killers;

    console.log(killers);

    let msg = "";
    for (let i = 0; i < kills.length; ++i) {
        msg += "**" + items[items.map(m => m.label).indexOf(kills[i])].item + "** - Killed By: <@" + players.filter(p => p.id == killers[i])[0].id + ">";
        if (i != kills.length - 1) {
            msg += "\n";
        }
    }

    if (msg.length) {
        const killsEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle("Kills")
            .setDescription(msg);

        killsEmbed.setTimestamp()
            .setFooter({ text: 'Command b.kills', iconURL: 'https://i.imgur.com/kk9lhk3.png' });

        message.reply({ embeds: [killsEmbed] });
    }
    else {
        message.reply("There have been no kills yet");
    }
}

exports.help = {
    name: ["kills", "k"]
}
