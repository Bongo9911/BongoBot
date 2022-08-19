const { MessageEmbed } = require('discord.js');
const fs = require("fs");


let items = [];
let labels = []
let players = [];
let kills = [];
let killers = [];

exports.run = async (bot, message, args) => {
    if (fs.existsSync("./data.json")) {
        fs.readFile("./data.json", 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            let fullData = JSON.parse(data);
            items = fullData.items;
            players = fullData.players;
            kills = fullData.kills;
            killers = fullData.killers;

            console.log(killers);

            let msg = "";
            for (let i = 0; i < kills.length; ++i) {
                msg += "**" + items[items.map(m => m.label).indexOf(kills[i])].item + "** - Killed By: <@" + players.filter(p => p.id == killers[i])[0].id + ">";
                if (i != kills.length - 1) {
                    msg += "\n";
                }
            }

            if (msg.length) {
                const killsEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle("Kills")
                    .setDescription(msg);

                    killsEmbed.setTimestamp()
                    .setFooter({ text: 'Command b.kills', iconURL: 'https://i.imgur.com/kk9lhk3.png' });

                message.reply({ embeds: [killsEmbed] });
            }
            else {
                message.reply("There have been no kills yet");
            }
        });
    }
}

exports.help = {
    name: "kills"
}
