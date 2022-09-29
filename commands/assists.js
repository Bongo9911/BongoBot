const { MessageEmbed } = require('discord.js');
const DataManager = require('../data/dataManager');

let dm = DataManager.getInstance();

let items = [];
let players = [];
let kills = [];
let assisters = [];

exports.run = async (bot, message, args) => {
    let gameData = dm.getGameData(message.guildId, message.channelId);
    items = gameData.items;
    players = dm.getPlayerData(message.guildId);
    kills = gameData.kills;
    assisters = gameData.assisters;

    console.log(assisters);

    let msg = "";
    for (let i = 0; i < kills.length; ++i) {
        msg += "**" + items[items.map(m => m.label).indexOf(kills[i])].item + "** - Assisted By: <@" + players.filter(p => p.id == assisters[i])[0].id + ">";
        if (i != kills.length - 1) {
            msg += "\n";
        }
    }

    if (msg.length) {
        const assistsEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle("Assists")
            .setDescription(msg);

        assistsEmbed.setTimestamp()
            .setFooter({ text: 'Command b.assists', iconURL: 'https://i.imgur.com/kk9lhk3.png' });

        message.reply({ embeds: [assistsEmbed] });
    }
    else {
        message.reply("There have been no assists yet");
    }
}

exports.help = {
    name: ["assists", "a"]
}
