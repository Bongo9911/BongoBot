const { MessageEmbed } = require('discord.js');
const DataManager = require('../data/dataManager');

let dm = DataManager.getInstance();

exports.run = async (bot, message, args) => {
    let players = dm.getPlayerData(message.guildId);

    let assisters = players.sort((a, b) => a.assists < b.assists ? 1 : -1);
    assisters = assisters.slice(0, 10);

    let list = "";

    for (let i = 0; i < assisters.length; ++i) {
        list += "`" + getRankString(i + 1) + ".` <@" + assisters[i].id + "> `" + assisters[i].assists + " assist" + (assisters[i].assists != 1 ? "s`\n" : "`\n");
    }

    const assistboardEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle("Top 10 Assisters")
        .setDescription(list);

    assistboardEmbed.setTimestamp()
        .setFooter({ text: 'Command b.assistboard', iconURL: 'https://i.imgur.com/kk9lhk3.png' });

    message.reply({ embeds: [assistboardEmbed] });
}

exports.help = {
    name: ["assistboard", "ab"]
}

function getRankString(n) {
    if (n == 1) {
        return "1st";
    }
    else if (n == 2) {
        return "2nd";
    }
    else if (n == 3) {
        return "3rd";
    }
    else {
        return n + "th";
    }
}