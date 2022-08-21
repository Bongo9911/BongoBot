const { MessageEmbed } = require('discord.js');
const fs = require("fs");
const DataManager = require('../data/dataManager');

let themes = [];
let themename = "";
let themeIndex = -1;

let dm = DataManager.getInstance();

exports.run = async (bot, message, args) => {
    if (fs.existsSync("./settings.json")) {
        fs.readFile("./settings.json", 'utf8', async (err, sdata) => {
            let settingsData = JSON.parse(sdata);
            if (settingsData.admins.indexOf(message.author.id) !== -1) {
                if (fs.existsSync("./themes.json")) {
                    fs.readFile("./themes.json", 'utf8', async (err, data) => {
                        themeData = JSON.parse(data);
                        themes = themeData.themes;
                        themename = args.join(' ').trim();
                        themeIndex = themes.map(t => t.name.toLowerCase()).indexOf(themename.toLowerCase());

                        if (themeIndex != -1) {
                            startTheme(message);
                        }
                        else {
                            message.reply("Theme " + themename + " not found.");
                        }
                    });
                }
            }
            else {
                message.reply("Only admins can perform this action.");
            }
        });
    }
}

function startTheme(message) {
    if (fs.existsSync("./data.json")) {
        fs.readFile("./data.json", 'utf8', async (err, data) => {
            let fullData = JSON.parse(data);
            if (!fullData.active) {
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
                            themes[themeIndex].items.forEach(m => {
                                items.push({
                                    item: m.item,
                                    itemlower: m.item.toLowerCase(),
                                    label: m.label,
                                    labellower: m.label.toLowerCase(),
                                    emoji: m.emoji,
                                    points: points,
                                    savetime: 0
                                })
                            })
                            fullData.items = items;
                            fullData.active = true;

                            dm.saveData(fullData);
                            message.reply("Starting theme: " + themes[themeIndex].name);
                        }
                        else {
                            message.reply("Points must be greater than 0.");
                        }
                    }).catch(collected => {
                        message.reply('Request Timed Out');
                    });
                })

            }
            else {
                message.reply("Can't start new theme while there is an active game");
            }
        });
    }
}

exports.help = {
    name: "starttheme"
}
