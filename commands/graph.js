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

let colors = [[247, 231, 200],
[0, 0, 0],
[0, 0, 255],
[161, 56, 0],
[255, 147, 107],
[220, 20, 60],
[0, 255, 255],
[19, 112, 19],
[247, 189, 12],
[0, 199, 0],
[121, 121, 121],
[72, 11, 190],
[230, 230, 250],
[200, 162, 200],
[120, 247, 0],
[255, 0, 255],
[117, 0, 0],
[62, 180, 137],
[5, 5, 103],
[154, 137, 0],
[255, 128, 0],
[255, 129, 129],
[255, 126, 195],
[183, 14, 239],
[255, 0, 0],
[255, 0, 183],
[190, 190, 190],
[43, 161, 255],
[205, 176, 138],
[19, 120, 130],
[9, 217, 134],
[119, 6, 202],
[240, 240, 240],
[255, 255, 0]]

exports.run = async (bot, message, args) => {

    message.channel.sendTyping();

    fs.readFile('./data.json', 'utf8', async function (err, data) {
        if (err) {
            console.log(err)
        } else {
            let fullData = JSON.parse(data);

            let datasets = [];

            for (let i = 0; i < fullData.items.length; ++i) {
                datasets.push({
                    label: fullData.items[i].item, data: fullData.history[i],
                    borderColor: ['rgba(' + colors[i % colors.length][0] + ',' + colors[i % colors.length][1] + ',' + colors[i % colors.length][2] + ',' + (1 - (Math.min(i/colors.length) * 0.5)) + ')'],
                    backgroundColor: 'rgba(' + colors[i % colors.length][0] + ',' + colors[i % colors.length][1] + ',' + colors[i % colors.length][2] + ', 1)' //0.2
                })
            }

            const renderer = new ChartJSNodeCanvas({ width: 800, height: 600, backgroundColour: 'white' });
            const image = await renderer.renderToBuffer({
                // Build your graph passing option you want
                type: "line", // Show a line chart
                backgroundColor: "rgba(236,197,1)",
                data: {
                    labels: [...Array(fullData.history[0].length).keys()],
                    datasets: datasets
                },
                options: {
                    elements: {
                        point:{
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
    name: "graph"
}
