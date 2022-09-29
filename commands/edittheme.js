const DataManager = require('../data/dataManager');

let dm = DataManager.getInstance();

exports.run = async (bot, message, args) => {
    let themeData = dm.getGuildThemes(message.guildId);
    let settingsData = dm.getGuildSettings(message.guildId);
    let themename = args.join(' ').trim();
    let themeIndex = themes.map(t => t.name.toLowerCase()).indexOf(themename.toLowerCase());
    if (settingsData.admins.indexOf(message.author.id) !== -1) {
        if (themeIndex != -1) {
            theme = themes[themeIndex];
        }
        else {
            message.reply("Theme " + themename + " not found.");
        }
    }
    else {
        message.reply("Only admins can perform this action.");
    }
}

exports.help = {
    name: ["edittheme", "et"]
}
