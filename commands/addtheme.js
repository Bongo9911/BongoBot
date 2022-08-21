const { MessageEmbed } = require('discord.js');
const fs = require("fs");

let themename = "";
let items = [];
let ids = [];
let colors = [];
let emojis = [];

exports.run = async (bot, message, args) => {
    if (fs.existsSync("./themes.json")) {
        fs.readFile("./themes.json", 'utf8', async (err, tdata) => {
            if (fs.existsSync("./settings.json")) {
                fs.readFile("./settings.json", 'utf8', async (err, sdata) => {
                    themeData = JSON.parse(tdata);
                    settingsData = JSON.parse(sdata);
                    if (settingsData.indexOf(message.author.id) !== -1) {
                        themename = args.join(' ').trim();
                        if (themename.length > 0) {
                            if (themeData.themes.filter(t => t.name.toLowerCase() == themename.toLowerCase()).length == 0) {
                                getItems(message);
                            }
                            else {
                                message.reply("Theme already exists, please use a different name.");
                            }
                        }
                        else {
                            message.reply("No theme name provided, please use syntax b.addtheme <Theme Name>.");
                        }
                        //TODO: Add ability to add custom colors or emojis
                    }
                    else {
                        message.reply("Only admins can perform this action.");
                    }
                });
            }
        });
    }
}

function getItems(message) {
    let filter = m => m.author.id === message.author.id
    message.reply("What items should be in theme '" + themename + "'?\nPlease reply with a list of items separated by newlines.").then(() => {
        message.channel.awaitMessages({
            filter,
            max: 1,
            time: 30000,
            errors: ['time']
        }).then(messages => {
            console.log("Add theme test");
            let message = messages.first()
            items = message.content.split(/\r?\n/).filter(m => m.length);
            if (items.length > 2) {
                console.log(items);
                getIDs(message);
            }
            else {
                message.reply("Invalid number of items provided. Must have at least 3.");
                getItems(message);
            }
        }).catch(collected => {
            message.reply('Request Timed Out');
        });
    })
}

function getIDs(message) {
    let filter = m => m.author.id === message.author.id
    message.reply("Would you like to add custom IDs for these items? If not they will be assigned numbers from 1 to " + items.length +
        "\nIf yes, reply with a list of IDs, if no, reply 'NO'").then(() => {
            message.channel.awaitMessages({
                filter,
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(messages => {
                let message = messages.first();
                if (message.content.toUpperCase() === "NO") {
                    ids = Array.from({ length: items.length }, (_, i) => (i + 1).toString());
                    finishCreateTheme(message);
                }
                else {
                    ids = message.content.split(/\r?\n/).filter(m => m.length);
                    if (ids.length === items.length) {
                        console.log(ids);
                        finishCreateTheme(message);
                    }
                    else {
                        message.reply("Invalid number of ids provided. Must equal number of items (" + items.length + ").");
                        getIDs(message);
                    }
                }
            }).catch(collected => {
                message.reply('Request Timed Out');
            });
        })
}

function finishCreateTheme(message) {
    let itemobjs = [];
    for (let i = 0; i < items.length; ++i) {
        itemobjs.push({
            item: items[i],
            label: ids[i],
            emoji: null
        })
    }
    console.log("Items: " + itemobjs.map(m => "{ Item: " + m.item + ", Label: " + m.label + " } "));

    fs.readFile("./themes.json", 'utf8', async (err, data) => {
        themeData = JSON.parse(data);
        if (themeData.themes.filter(t => t.name.toLowerCase() == themename.toLowerCase()).length == 0) {
            themeData.themes.push({
                name: themename,
                items: itemobjs,
                colors: [],
            });

            fs.writeFile("./themes.json", JSON.stringify(themeData), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                }
                message.reply("Theme " + themename + " succesfully created.");
            });
        }
        else {
            message.reply("Theme already exists, please use a different name.");
        }
    });
}

exports.help = {
    name: "addtheme"
}
