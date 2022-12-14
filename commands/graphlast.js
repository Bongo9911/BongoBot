const { MessageEmbed, MessageAttachment } = require('discord.js');
const ChartJSImage = require('chart.js-image');
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

const DataManager = require('../data/dataManager');

let dm = DataManager.getInstance();

// colors = [
//     [255, 0, 0],
//     [0, 255, 0],
//     [0, 0, 255],
//     [255, 255, 0],
//     [0, 255, 255],
//     [255, 0, 255],
//     [255, 128, 0],
//     [128, 255, 0],
//     [128, 0, 255],
//     [255, 0, 128],
//     [0, 255, 128],
//     [0, 128, 255],
//     [255, 128, 128],
//     [128, 255, 128],
//     [128, 128, 255],
//     [0, 0, 0],
//     [128, 128, 128],
//     [128, 0, 0],
//     [0, 128, 0],
//     [0, 0, 128],
//     [128, 128, 0],
//     [0, 128, 128],
//     [128, 0, 128],
//     [128, 64, 0],
//     [64, 128, 0],
//     [64, 0, 128],
//     [128, 0, 64],
//     [0, 128, 64],
//     [0, 64, 128],
//     [128, 64, 64],
//     [64, 128, 64],
//     [64, 64, 128],
//     [64, 64, 64],
// ]

let colors = [
    [255, 0, 0],
    [255, 106, 0],
    [255, 216, 0],
    [182, 255, 0],
    [76, 255, 0],
    [0, 255, 144],
    [0, 255, 255],
    [0, 148, 255],
    [0, 38, 255],
    [101, 0, 255],
    [178, 0, 255],
    [255, 0, 220],
    [255, 0, 110],
    [255, 127, 127],
    [255, 178, 127],
    [255, 233, 127],
    [218, 255, 127],
    [165, 255, 127],
    [127, 255, 142],
    [127, 255, 197],
    [127, 201, 255],
    [127, 146, 255],
    [161, 127, 255],
    [214, 127, 255],
    [255, 127, 237],
    [255, 127, 182]
];

exports.run = async (bot, message, args) => {

    message.channel.sendTyping();

    if (args.length >= 1) {
        let gameData = dm.getGameData(message.guildId, message.channelId);
        let items = gameData.items;
        let history = gameData.history;

        let max = parseInt(args[0].trim());

        let start = history[0].length - max;
        if (start < 0) start = 0;
        if (max > 1000) max = 1000;

        let datasets = [];

        for (let i = 0; i < items.length; ++i) {
            datasets.push({
                label: items[i].item, data: history[i].slice(start, history[i].length),
                borderColor: items[i].color.length ? ['rgba(' + items[i].color[0] + "," + items[i].color[1] + "," + items[i].color[2] + ", 1)"] :
                    ['rgba(' + Math.round(colors[i % colors.length][0] / (1 + Math.floor(i / colors.length))) + ',' + Math.round(colors[i % colors.length][1] / (1 + Math.floor(i / colors.length)))
                        + ',' + Math.round(colors[i % colors.length][2] / (1 + Math.floor(i / colors.length))) + ', 1)'],
                backgroundColor: items[i].color.length ? 'rgba(' + items[i].color[0] + "," + items[i].color[1] + "," + items[i].color[2] + ", 1)" :
                    'rgba(' + Math.round(colors[i % colors.length][0] / (1 + Math.floor(i / colors.length))) + ',' + Math.round(colors[i % colors.length][1] / (1 + Math.floor(i / colors.length)))
                    + ',' + Math.round(colors[i % colors.length][2] / (1 + Math.floor(i / colors.length))) + ', 1)' //0.2
            })
        }

        const renderer = new ChartJSNodeCanvas({ width: 800, height: 600, backgroundColour: 'white' });
        renderer.renderToBuffer({
            // Build your graph passing option you want
            type: "line", // Show a line chart
            backgroundColor: "rgba(236,197,1)",
            data: {
                labels: [...Array(history[0].length - start).fill().map((_, idx) => start + idx)],
                datasets: datasets
            },
            options: {
                elements: {
                    point: {
                        radius: 0
                    }
                }
            }
        }).then(image => {
            const attachment = new MessageAttachment(image, "graph.png");

            const graphEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle("Point Graph")
                .setImage('attachment://graph.png')
                .setTimestamp()
                .setFooter({ text: 'Command b.graphlast', iconURL: 'https://i.imgur.com/kk9lhk3.png' });

            message.reply({ embeds: [graphEmbed], files: [attachment] });
        })
    }
    else {
        message.reply("Invalid syntax. Format should be: b.graphlast <num> (e.g. b.graphlast 50)");
    }
}

exports.help = {
    name: ["graphlast", "gl"]
}
