const { MessageEmbed } = require('discord.js');
const fs = require("fs");

exports.run = async (bot, message, args) => {
    if (fs.existsSync("./themes.json")) {
        fs.readFile("./themes.json", 'utf8', async (err, data) => {
            themeData = JSON.parse(data);
            themes = themeData.themes;
            themename = args.join(' ').trim();
            themeIndex = themes.map(t => t.name.toLowerCase()).indexOf(themename.toLowerCase());

            if (themeIndex != -1) {
                theme = themes[themeIndex];

                itemList = "";
                theme.items.forEach((m, i) => {
                    itemList += "(" + m.label + ") " + (m.emoji ? m.emoji + " " : "") + m.item + (theme.colors.length ? " - " + theme.colors[i] : "")
                        + (i == theme.items.length - 1 ? " " : "\n");
                })

                const themeEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle("Theme - " + theme.name)
                    .setDescription(itemList)
                    .setTimestamp()
                    .setFooter({ text: 'Command b.theme', iconURL: 'https://i.imgur.com/kk9lhk3.png' });

                message.reply({ embeds: [themeEmbed] });
            }
            else {
                message.reply("Theme " + themename + " not found.");
            }
        });
    }
}

exports.help = {
    name: "theme"
}