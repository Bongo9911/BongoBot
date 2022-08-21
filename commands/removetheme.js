const { MessageEmbed } = require('discord.js');
const fs = require("fs");

let themename = "";

exports.run = async (bot, message, args) => {
    if (fs.existsSync("./themes.json")) {
        fs.readFile("./themes.json", 'utf8', async (err, data) => {
            themeData = JSON.parse(data);
            themename = args.join(' ').trim();
            if (themename.length > 0) {
                if (themeData.themes.filter(t => t.name.toLowerCase() == themename.toLowerCase()).length != 0) {
                    confirmRemoveTheme(message);
                }
                else {
                    message.reply("Theme " + themename + " not found.");
                }
            }
            else {
                message.reply("No theme name provided, please use syntax b.removetheme <Theme Name>.");
            }
        });
    }
}

function confirmRemoveTheme(message) {
    let filter = m => m.author.id === message.author.id
    message.reply("Are you sure you would like to remove theme '" + themename + "'?\nReply 'Yes' or 'No'.").then(() => {
        message.channel.awaitMessages({
            filter,
            max: 1,
            time: 30000,
            errors: ['time']
        }).then(messages => {
            let message = messages.first()
            if (message.content.toUpperCase() == "NO") {
                fs.readFile("./themes.json", 'utf8', async (err, data) => {
                    let themeData = JSON.parse(data);
                    if(themeData.themes.filter(t => t.name.toLowerCase() == themename.toLowerCase()).length == 1) {
                        themeData.themes.splice(themeData.themes.map(t => t.name.toLowerCase()).indexOf(themename.toLowerCase()), 1);
                        message.reply("Theme " + themename + " successfully removed.");
                    }
                    else {
                        message.reply("Theme " + themename + " not found. Maybe someone else already removed it?");
                    }
                });
            }
            else {
                message.reply("Cancelled remove request.");
            }
        }).catch(collected => {
            message.reply('Request Timed Out');
        });
    })
}

exports.help = {
    name: "removetheme"
}
