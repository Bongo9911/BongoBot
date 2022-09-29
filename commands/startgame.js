const DataManager = require('../data/dataManager');

let dm = DataManager.getInstance();

let themes = [];
let themename = "";
let themeIndex = -1;

exports.run = async (bot, message, args) => {
    let settingsData = dm.getGuildSettings(message.guildId);
    if (settingsData.admins.indexOf(message.author.id) !== -1) {
        themeData = dm.getGuildThemes(message.guildId);
        themes = themeData.themes;
        themename = args.join(' ').trim();
        themeIndex = themes.map(t => t.name.toLowerCase()).indexOf(themename.toLowerCase());

        if (themeIndex != -1) {
            startTheme(message);
        }
        else {
            message.reply("Theme " + themename + " not found.");
        }
    }
    else {
        message.reply("Only admins can perform this action.");
    }
}

function startTheme(message) {
    let gameData = dm.getGameData(message.guildId, message.channelId);
    if ((gameData && !gameData.active) || !gameData) {
        if(!gameData) {
            gameData = {};
        }
        let filter = m => m.author.id === message.author.id
        message.reply("How many points should each item start with?").then(() => {
            message.channel.awaitMessages({
                filter,
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(messages => {
                let message = messages.first();
                let points = parseInt(message.content);
                if (points > 0) {
                    let items = [];
                    gameData.history = [];
                    themes[themeIndex].items.forEach(m => {
                        items.push({
                            item: m.item,
                            itemLower: m.item.toLowerCase(),
                            label: m.label,
                            labelLower: m.label.toLowerCase(),
                            emoji: m.emoji,
                            color: m.color,
                            points: points,
                            savetime: 0
                        })
                        gameData.history.push([points]);
                    })
                    gameData.items = items;
                    gameData.active = true;
                    gameData.saves = [];
                    gameData.savers = [];
                    gameData.kills = [];
                    gameData.killers = [];
                    gameData.assisters = [];

                    dm.saveGameData(gameData, message.guildId, message.channelId);
                    message.reply("Starting theme: " + themes[themeIndex].name);
                }
                else {
                    message.reply("Points must be greater than 0.");
                }
            }).catch(error => {
                console.error(error);
                message.reply('Request Timed Out');
            });
        })

    }
    else {
        message.reply("Can't start new theme while there is an active game");
    }
}

exports.help = {
    name: ["startgame", "sg"]
}
