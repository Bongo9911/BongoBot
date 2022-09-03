const { MessageEmbed } = require('discord.js');
const DataManager = require('../data/dataManager');

let dm = DataManager.getInstance();

exports.run = async (bot, message, args) => {
    themeData = dm.getGuildThemes(message.guildId);
    themes = themeData.themes.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);

    if (themes.length) {
        themeList = "";

        themes.forEach((t, i) => {
            themeList += "**" + t.name + "** - " + t.items.length + " Items" + (i == themes.length - 1 ? " " : "\n");
        })

        const themesEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle("Themes")
            .setDescription(themeList)
            .setTimestamp()
            .setFooter({ text: 'Command b.themes', iconURL: 'https://i.imgur.com/kk9lhk3.png' });

        message.reply({ embeds: [themesEmbed] });
    }
    else {
        message.reply("No themes found.");
    }
}

exports.help = {
    name: ["themes", "ts"]
}
