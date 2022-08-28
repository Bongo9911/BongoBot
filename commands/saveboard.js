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

            let savers = fullData.players.sort((a, b) => a.saves < b.saves ? 1 : -1);
            savers = savers.slice(0, 10);

            let list = "";

            for (let i = 0; i < savers.length; ++i) {
                list += "`" + getRankString(i + 1) + ".` <@" + savers[i].id + "> `" + savers[i].saves + " save" + (savers[i].saves != 1 ? "s`\n" : "`\n");
            }

            const saveboardEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle("Top 10 Savers")
                .setDescription(list);

            saveboardEmbed.setTimestamp()
                .setFooter({ text: 'Command b.saveboard', iconURL: 'https://i.imgur.com/kk9lhk3.png' });

            message.reply({ embeds: [saveboardEmbed] });
        });

    }
}

exports.help = {
    name: ["saveboard", "sb"]
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