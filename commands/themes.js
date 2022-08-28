const { MessageEmbed } = require('discord.js');
const fs = require("fs");

exports.run = async (bot, message, args) => {
    if (fs.existsSync("./themes.json")) {
        fs.readFile("./themes.json", 'utf8', async (err, data) => {
            themeData = JSON.parse(data);
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
        });
    }
}

exports.help = {
    name: ["themes", "ts"]
}
