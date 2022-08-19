const { MessageEmbed } = require('discord.js');
const fs = require("fs");

exports.run = async (bot, message, args) => {
    if (fs.existsSync("./data.json")) {
        fs.readFile("./data.json", 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            let fullData = JSON.parse(data);

            let killers = fullData.players.sort((a, b) => a.kills < b.kills ? 1 : -1);
            killers = killers.slice(0, 10);

            let list = "";

            for (let i = 0; i < killers.length; ++i) {
                list += "`" + getRankString(i + 1) + ".` <@" + killers[i].id + "> `" + killers[i].kills + " kill" + (killers[i].kills != 1 ? "s`\n" : "`\n");
            }

            const killboardEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle("Top 10 Killers")
                .setDescription(list);

            killboardEmbed.setTimestamp()
                .setFooter({ text: 'Command b.killboard', iconURL: 'https://i.imgur.com/kk9lhk3.png' });

            message.reply({ embeds: [killboardEmbed] });
        });

    }
}

exports.help = {
    name: "killboard"
}

function getRankString(n) {
    if (n == 1) {
        return "1st";
    }
    else if (n == 2) {
        return "2nd";
    }
    else if (n == 3) {
        return "3rd";
    }
    else {
        return n + "th";
    }
}