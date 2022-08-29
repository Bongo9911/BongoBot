const { MessageEmbed, MessageAttachment } = require('discord.js');
const ChartJSImage = require('chart.js-image');
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const fs = require("fs");

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

colors = [
    [1, 196, 114],
    [24, 120, 106],
    [141, 210, 216],
    [55, 82, 130],
    [158, 126, 233],
    [127, 32, 172],
    [235, 103, 249],
    [203, 23, 117],
    [238, 200, 241],
    [120, 40, 87],
    [251, 133, 182],
    [4, 148, 251],
    [150, 198, 118],
    [89, 131, 34],
    [157, 234, 25],
    [104, 61, 13],
    [254, 143, 6],
    [214, 7, 36],
    [200, 147, 105],
    [252, 209, 7],
    [0, 0, 0]
];

exports.run = async (bot, message, args) => {

    message.channel.sendTyping();

    fs.readFile('./data.json', 'utf8', async function (err, data) {
        if (err) {
            console.log(err)
        } else if (args.length >= 1) {
            let fullData = JSON.parse(data);
            let items = fullData.items;
            let history = fullData.history;

            let max = parseInt(args[0].trim());

            let start = history[0].length - max;
            if (start < 0) start = 0;

            let datasets = [];

            for (let i = 0; i < items.length; ++i) {
                datasets.push({
                    label: items[i].item, data: history[i].slice(start, history[i].length),
                    borderColor: items[i].color.length ? ['rgba(' + items[i].color[0] + "," + items[i].color[1] + "," + items[i].color[2] + ", 1)"] :
                        ['rgba(' + colors[i % colors.length][0] / (2 * Math.min(i / colors.length)) + ',' + colors[i % colors.length][1] / (2 * Math.min(i / colors.length))
                            + ',' + colors[i % colors.length][2] / (2 * Math.min(i / colors.length)) + ', 1)'],
                    backgroundColor: items[i].color.length ? 'rgba(' + items[i].color[0] + "," + items[i].color[1] + "," + items[i].color[2] + ", 1)" :
                        'rgba(' + colors[i % colors.length][0] / (2 * Math.min(i / colors.length)) + ',' + colors[i % colors.length][1] / (2 * Math.min(i / colors.length))
                        + ',' + colors[i % colors.length][2] / (2 * Math.min(i / colors.length)) + ', 1)' //0.2
                })
            }

            const renderer = new ChartJSNodeCanvas({ width: 800, height: 600, backgroundColour: 'white' });
            const image = await renderer.renderToBuffer({
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
            });
            const attachment = new MessageAttachment(image, "graph.png");

            const graphEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle("Point Graph")
                .setImage('attachment://graph.png')
                .setTimestamp()
                .setFooter({ text: 'Command b.graphlast', iconURL: 'https://i.imgur.com/kk9lhk3.png' });

            message.reply({ embeds: [graphEmbed], files: [attachment] });
        }
        else {
            message.reply("Invalid syntax. Format should be: b.graphlast <num> (e.g. b.graphlast 50)");
        }
    });
}

exports.help = {
    name: ["graphlast", "gl"]
}
