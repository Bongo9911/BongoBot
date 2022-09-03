const { MessageEmbed } = require('discord.js');
const DataManager = require('../data/dataManager');

let dm = DataManager.getInstance();

let items = [];
let players = [];
let saves = [];
let savers = [];

exports.run = async (bot, message, args) => {
    let fullData = dm.getGameData(message.guildId, message.channelId);
    items = fullData.items;
    players = dm.getPlayerData(message.guildId);
    saves = fullData.saves;
    savers = fullData.savers;

    console.log(savers);

    let msg = "";
    for (let i = 0; i < saves.length; ++i) {
        msg += "**" + items[items.map(m => m.label).indexOf(saves[i])].item + "** - Saved By: <@" + players.filter(p => p.id == savers[i])[0].id + ">";
        if (i != saves.length - 1) {
            msg += "\n";
        }
    }

    if (msg.length) {
        const savesEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle("Saves")
            .setDescription(msg);

        savesEmbed.setTimestamp()
            .setFooter({ text: 'Command b.saves', iconURL: 'https://i.imgur.com/kk9lhk3.png' });

        message.reply({ embeds: [savesEmbed] });
    }
    else {
        message.reply("There have been no saves yet");
    }
}

exports.help = {
    name: ["saves", "s"]
}
