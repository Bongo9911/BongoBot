const { MessageEmbed } = require('discord.js');

let themename = "";
let items = [];
let ids = [];
let colors = [];
let emojis = [];


exports.run = async (bot, message, args) => {
    themename = args.join(' ');
    getItems(message);
    //TODO: Add ability to add custom colors or emojis
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
                    ids = Array.from({length: items.length}, (_, i) => i + 1);
                    finishCreateTheme();
                }
                else {
                    ids = message.content.split(/\r?\n/).filter(m => m.length);
                    if (ids.length === items.length) {
                        console.log(ids);
                        finishCreateTheme();
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
        .catch(collected => {
            message.reply('Request Timed Out');
        });
}

function finishCreateTheme() {
    let itemobjs = [];
    for(let i = 0; i < items.length; ++i) {
        itemobjs.push({
            item: items[i],
            label: ids[i]
        })
    }
    console.log("Items: " + itemobjs.map(m => "Name: " + m.name + ", Label: " + m.label));
}

exports.help = {
    name: "addtheme"
}
