const { MessageEmbed } = require('discord.js');
const DataManager = require('../data/dataManager');

let dm = DataManager.getInstance();

exports.run = async (bot, message, args) => {
    let gameData = dm.getGameData(message.guildId, message.channelId);

    let nonZeroItems = gameData.items.filter(m => m.points > 0);

    if (nonZeroItems.length && gameData.active) {
        let columns = Math.ceil(nonZeroItems.length / 25);
        let perColumn = Math.ceil(nonZeroItems.length / columns);

        const pointsEmbed = new MessageEmbed()
            .setColor('#0099ff');

        for (let i = 0; i < columns; ++i) {
            let pointCol = "";
            for (let j = i * perColumn; j < (i + 1) * perColumn && j < nonZeroItems.length; ++j) {
                pointCol += "(" + nonZeroItems[j].label + ") " + (nonZeroItems[j].emoji ? nonZeroItems[j].emoji + " " : "") + nonZeroItems[j].item + " - **" + nonZeroItems[j].points + "**\n";
            }
            if (i == 0) {
                pointsEmbed.addField("Points", pointCol, true);
            }
            else {
                pointsEmbed.addField("\u200b", pointCol, true);
            }
        }
        pointsEmbed.setFooter({ text: 'Command b.points', iconURL: 'https://i.imgur.com/kk9lhk3.png' });
        message.reply({ embeds: [pointsEmbed] });
    }
    else {
        message.reply("There is currently no active game.");
    }
}

exports.help = {
    name: ["points", "p"]
}
