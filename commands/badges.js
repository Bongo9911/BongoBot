const { MessageEmbed } = require('discord.js');

exports.run = async (bot, message, args) => {

    const badgeEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle("Badges")
        .setDescription(":knife: **Killer** - Get your first kill\n" +
            ":superhero: **Hero** - Get your first save\n" +
            ":dagger: **Serial Killer** - Get 5 kills\n" +
            ":innocent: **Savior** - Get 5 saves\n" +
            ":skull: **Memento Mori** - Kill something within 5 minutes of it being saved\n" +
            ":camel: **Double Trouble** - Save something that has already been saved.\n"+
            ":boom: **Finishing Blow** - Get the last kill of the game.")
        .setTimestamp()
        .setFooter({ text: 'Command b.badges', iconURL: 'https://i.imgur.com/kk9lhk3.png' });

    message.reply({ embeds: [badgeEmbed] });
}

exports.help = {
    name: ["badges", "b"]
}
