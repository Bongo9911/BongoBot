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
                let data = dm.getData();
                if (data.active) {
                    message.reply("Are you sure you want to end the current game?\nReply 'Yes' or 'No'.").then(() => {
                        message.channel.awaitMessages({
                            filter,
                            max: 1,
                            time: 30000,
                            errors: ['time']
                        }).then(messages => {
                            let message = messages.first();
                            if (message.content.toUpperCase() == "Yes") {
                                data.active = false;
                                dm.saveData(data);
                            }
                            else {
                                message.reply('Request Cancelled');
                            }
                        }).catch(collected => {
                            message.reply('Request Timed Out');
                        });
                    })
                }
                else {
                    message.reply("There is currently no active game.");
                }
            }
            else {
                message.reply("Only admins can perform this action.");
            }
        });
    }
}

exports.help = {
    name: "stopgame"
}
