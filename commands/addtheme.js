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
                    if (settingsData.admins.indexOf(message.author.id) !== -1) {
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
                    getEmojis(message);
                }
                else {
                    ids = message.content.split(/\r?\n/).filter(m => m.length);
                    if (ids.length === items.length) {
                        console.log(ids);
                        getEmojis(message);
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

function getEmojis(message) {
    let filter = m => m.author.id === message.author.id
    message.reply("Would you like to add custom emojis for these items? (Note: Emojis must be default or from a server the bot is in)" +
        "\nIf yes, reply with a list of emojis, if no, reply 'NO'").then(() => {
            message.channel.awaitMessages({
                filter,
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(messages => {
                let message = messages.first();
                if (message.content.toUpperCase() === "NO") {
                    getColors(message);
                }
                else {
                    emojis = message.content.split(/\r?\n/).filter(m => m.length);
                    if (emojis.length === items.length) {
                        console.log(emojis);
                        getColors(message);
                    }
                    else {
                        message.reply("Invalid number of emojis provided. Must equal number of items (" + items.length + ").");
                        getEmojis(message);
                    }
                }
            }).catch(collected => {
                message.reply('Request Timed Out');
            });
        })
}

function getColors(message) {
    let filter = m => m.author.id === message.author.id
    message.reply("Would you like to add custom colors for these items for graphing?" +
        "\nIf yes, reply with a list of hex colors, if no, reply 'NO'").then(() => {
            message.channel.awaitMessages({
                filter,
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(messages => {
                let message = messages.first();
                if (message.content.toUpperCase() === "NO") {
                    finishCreateTheme(message);
                }
                else {
                    hexcolors = message.content.split(/\r?\n/).filter(m => m.length);
                    if (hexcolors.length === items.length) {
                        console.log(hexcolors);
                        rgbcolors = [];
                        let valid = true;
                        for(let i = 0; i < hexcolors.length; ++i) {
                            let rgb = hexToRgb(hexcolors[i]);
                            if(rgb) {
                                rgbcolors.push(rgb);
                            }
                            else {
                                valid = false;
                                message.reply("Invalid hex code: " + hexcolors[i]);
                                getColors(message);
                            }
                        }
                        if(valid) {
                            console.log(rgbcolors);
                            colors = rgbcolors;
                            finishCreateTheme(message);
                        }
                    }
                    else {
                        message.reply("Invalid number of colors provided. Must equal number of items (" + items.length + ").");
                        getColors(message);
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
            emoji: emojis.length ? emojis[i] : null,
            color: colors.length ? colors[i] : []
        })
    }
    console.log("Items: " + itemobjs.map(m => "{ Item: " + m.item + ", Label: " + m.label + " } "));

    fs.readFile("./themes.json", 'utf8', async (err, data) => {
        themeData = JSON.parse(data);
        if (themeData.themes.filter(t => t.name.toLowerCase() == themename.toLowerCase()).length == 0) {
            themeData.themes.push({
                name: themename,
                items: itemobjs,
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

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

exports.help = {
    name: "addtheme"
}
