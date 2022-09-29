const { MessageEmbed } = require('discord.js');
const DataManager = require('../data/dataManager');

let dm = DataManager.getInstance();

let badges = {
    "Killer": ":knife:",
    "Serial Killer": ":dagger:",
    "Hero": ":superhero:",
    "Savior": ":innocent:",
    "Helping Hand": ":hand_splayed:",
    "True Homie": ":people_hugging:",
    "Memento Mori": ":skull:",
    "Double Trouble": ":camel:",
    "Finishing Blow": ":boom:"
}

exports.run = async (bot, message, args) => {
    let players = dm.getPlayerData(message.guildId);

    let badgeHolders = players.sort((a, b) => a.badges.length < b.badges.length ? 1 : -1);
    badgeHolders = badgeHolders.slice(0, 10);

    let list = "";

    for (let i = 0; i < badgeHolders.length; ++i) {
        list += "`" + getRankString(i + 1) + ".` <@" + badgeHolders[i].id + "> `" + badgeHolders[i].badges.length + " badge" + (badgeHolders[i].badges.length != 1 ? "s" : "") + "` (";
        badgeHolders[i].badges.forEach(b => {
            list += badges[b];
        });
        list += ")\n";
    }

    const badgeboardEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle("Top 10 Badge Holders")
        .setDescription(list);

    badgeboardEmbed.setTimestamp()
        .setFooter({ text: 'Command b.badgeboard', iconURL: 'https://i.imgur.com/kk9lhk3.png' });

    message.reply({ embeds: [badgeboardEmbed] });
}

exports.help = {
    name: ["badgeboard", "bb"]
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