const { MessageEmbed, MessageAttachment } = require('discord.js');
const ChartJSImage = require('chart.js-image');
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const fs = require("fs");

colors = [
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255],
    [255, 255, 0],
    [0, 255, 255],
    [255, 0, 255],
    [255, 128, 0],
    [128, 255, 0],
    [128, 0, 255],
    [255, 0, 128],
    [0, 255, 128],
    [0, 128, 255],
    [255, 128, 128],
    [128, 255, 128],
    [128, 128, 255],
    [0, 0, 0],
    [128, 128, 128],
    [128, 0, 0],
    [0, 128, 0],
    [0, 0, 128],
    [128, 128, 0],
    [0, 128, 128],
    [128, 0, 128],
    [128, 64, 0],
    [64, 128, 0],
    [64, 0, 128],
    [128, 0, 64],
    [0, 128, 64],
    [0, 64, 128],
    [128, 64, 64],
    [64, 128, 64],
    [64, 64, 128],
    [64, 64, 64],
]

exports.run = async (bot, message, args) => {

    message.channel.sendTyping();

    fs.readFile('./data.json', 'utf8', async function (err, data) {
        if (err) {
            console.log(err)
        } else {
            let fullData = JSON.parse(data);
            let items = fullData.items;
            let history = fullData.history;

            let datasets = [];

            for (let i = 0; i < items.length; ++i) {
                datasets.push({
                    label: items[i].item, data: history[i],
                    borderColor: items[i].color.length ? ['rgba(' + items[i].color[0] + "," + items[i].color[1] + "," + items[i].color[2] + ", 1)"] :
                        ['rgba(' + colors[i % colors.length][0] + ',' + colors[i % colors.length][1] + ',' + colors[i % colors.length][2] + ',' + (1 - (Math.min(i / colors.length) * 0.5)) + ')'],
                    backgroundColor: items[i].color.length ? 'rgba(' + items[i].color[0] + "," + items[i].color[1] + "," + items[i].color[2] + ", 1)" :
                        'rgba(' + colors[i % colors.length][0] + ',' + colors[i % colors.length][1] + ',' + colors[i % colors.length][2] + ', 1)' //0.2
                })
            }

            const renderer = new ChartJSNodeCanvas({ width: 800, height: 600, backgroundColour: 'white' });
            const image = await renderer.renderToBuffer({
                // Build your graph passing option you want
                type: "line", // Show a line chart
                backgroundColor: "rgba(236,197,1)",
                data: {
                    labels: [...Array(history[0].length).keys()],
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
                .setFooter({ text: 'Command b.graph', iconURL: 'https://i.imgur.com/kk9lhk3.png' });

            message.reply({ embeds: [graphEmbed], files: [attachment] });
        }
    });
}

exports.help = {
    name: ["graph", "g"]
}
