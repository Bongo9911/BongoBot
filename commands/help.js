const { MessageEmbed } = require('discord.js');

exports.run = async (bot, message, args) => {

    const helpEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle("Commands")
        .addFields(
            {
                name: 'Game Info', value: "`b.points` - Lists the points for each item\n`b.kills` - Lists the killer of each item for the current round\n" +
                    "`b.saves` - Lists all of the saves performed in the current round\n`b.graph` - Graphs all the point changes made from the start of the round\n" +
                    "`b.graphlast <n>` - Graphs the last n point changes for the current round", inline: true
            },
            {
                name: 'Player Info', value: "`b.stats` - Lists your player stats\n`b.stats <ping>` - Lists the stats for the user pinged\n" +
                    "`b.badges` - Lists all the obtainable badges\n`b.setbadge <badge name>` - Set your featured badge to a badge you own\n" +
                    "`b.killboard` - Lists the players with the most kills\n`b.saveboard` - Lists the players with the most saves", inline: true
            },
        )
        .setTimestamp()
        .setFooter({ text: 'Command b.help', iconURL: 'https://i.imgur.com/kk9lhk3.png' });

    message.reply({ embeds: [helpEmbed] });
}

exports.help = {
    name: ["help", "h"]
}
