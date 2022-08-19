const { MessageEmbed } = require('discord.js');
const fs = require("fs");

let badges = {
    "Killer": ":knife:",
    "Serial Killer": ":dagger:",
    "Hero": ":superhero:",
    "Savior": ":innocent:",
    "Memento Mori": ":skull:",
    "Double Trouble": ":camel:"
}

let badgeLinks = {
    "Killer": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/kitchen-knife_1f52a.png",
    "Serial Killer": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/dagger_1f5e1-fe0f.png",
    "Hero": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/superhero_1f9b8.png",
    "Savior": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/smiling-face-with-halo_1f607.png",
    "Memento Mori": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/skull_1f480.png",
    "Double Trouble": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/two-hump-camel_1f42b.png"
}

exports.run = async (bot, message, args) => {
    let userId = message.author.id
    if (args.length != 0 && args[0].trim() != "" && args[0].startsWith("<@") && args[0].endsWith(">")) {
        userId = args[0].slice(2).slice(0, -1);
    }

    console.log(userId);

    let players = [];

    fs.readFile('./data.json', 'utf8', function (err, data) {
        if (err) {
            console.log(err)
        } else {
            players = JSON.parse(data).players;

            let player = players.filter(p => p.id == userId)[0];
            if (player) {
                let user = bot.users.cache.get(userId);

                let badgeText = "";

                console.log(player);

                player.badges.forEach(b => {
                    badgeText += badges[b];
                })

                const statsEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    //.setTitle('<@' + user + '>')
                    //.setURL('https://discord.js.org/')
                    .setAuthor({ name: user.tag, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`, /*url: 'https://discord.js.org'*/ })
                    //.setDescription('Some description here')
                    //.setThumbnail('https://i.imgur.com/AfFp7pu.png')
                    .addFields(
                        //{ name: 'Regular field title', value: 'Some value here' },
                        //{ name: '\u200B', value: '\u200B' },
                        { name: 'Kills', value: player.kills.toString(), inline: true },
                        { name: 'Saves', value: player.saves.toString(), inline: true },
                    )

                if (badgeText.length) {
                    statsEmbed.addField('Badges', badgeText, false);
                    console.log(player.featuredBadge);
                    if (player.featuredBadge.length) {
                        statsEmbed.setThumbnail(badgeLinks[player.featuredBadge]);
                    }
                }

                //.setImage('https://i.imgur.com/AfFp7pu.png')

                statsEmbed.setTimestamp()
                    .setFooter({ text: 'Command b.stats', iconURL: 'https://i.imgur.com/kk9lhk3.png' });

                message.reply({ embeds: [statsEmbed] });
            }
            else {

            }
        }
    });
}

exports.help = {
    name: "stats"
}
