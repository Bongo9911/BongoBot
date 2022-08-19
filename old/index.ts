const { prefix, token } = require("./config.json");

const { Client, Intents, Collection, DataResolver } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const fs = require("fs");

bot.commands = new Collection();

const commandFiles = fs.readdirSync('./commands/').filter(f => f.endsWith('.js'))
for (const file of commandFiles) {
    const props = require(`./commands/${file}`)
    console.log(`${file} loaded`)
    bot.commands.set(props.help.name, props)
}

const commandSubFolders = fs.readdirSync('./commands/').filter(f => !f.endsWith('.js'))
commandSubFolders.forEach(folder => {
    const commandFiles = fs.readdirSync(`./commands/${folder}/`).filter(f => f.endsWith('.js'))
    for (const file of commandFiles) {
        const props = require(`./commands/${folder}/${file}`)
        console.log(`${file} loaded from ${folder}`)
        bot.commands.set(props.help.name, props)
    }
});

// Load Event files from events folder
const eventFiles = fs.readdirSync('./events/').filter(f => f.endsWith('.js'))

for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if (event.once) {
        bot.once(event.name, (...args) => event.execute(...args, bot))
    } else {
        bot.on(event.name, (...args) => event.execute(...args, bot))
    }
}

let points: number[] = [];
let items: string[] = ['Ingrid Michaelson - "Time Machine"', 'Lorenzo Fragola - "Luce che entra"', 'Indila - "Dernière danse"',
    'Cœur de pirate - "Oublie-moi"', 'George Ogilvie - "Foreign Hands"', 'Ella Eyre - "Comeback"',
    'HMB (ft. Carminho) - "O Amor é Assim"', 'Faouzia - "Knock On My Door"', 'Boy Epic - "Trust"',
    'Night Riots - "Contagious"', 'Maître Gims - "Est-ce que tu m\'aimes?"'];
let labels: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "SE1"]
let labelsLower: string[] = [];

labels.forEach(item => {
    labelsLower.push(item.toLowerCase());
})

let pointsPath = "./points.txt"
if (fs.existsSync(pointsPath)) {
    fs.readFile(pointsPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let values = data.split("\n");
        values.forEach(value => {
            points.push(parseInt(value))
        })
        console.log(data);
    });
}
else {
    labels.forEach(() => {
        points.push(20);
    });
}

let players = [];

fs.readFile('./players.json', 'utf8', function (err, data) {
    if (err) {
        console.log(err)
    } else {
        players = JSON.parse(data);
    }
});

let endgame: boolean = false;
let winVoteMsg;

//Command Manager
bot.on("messageCreate", async message => {
    //Check if author is a bot or the message was sent in dms and return
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    //get prefix from config and prepare message so it can be read as a command
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let errors = "";

    let valid = true;
    if ((cmd.startsWith("-") || cmd.startsWith("+")) &&
        message.content.indexOf("+") != -1 && message.content.indexOf("-") != -1 &&
        (message.channel.id == 980960076686848030 || message.channel.id == 389594279758135317)) {

        let minusindex: number = -1;
        let plusindex: number = -1;

        if (cmd.startsWith("-")) {
            minusindex = labelsLower.indexOf(message.content.split("+")[0].substring(1).trim().toLowerCase());
            plusindex = labelsLower.indexOf(message.content.split("+")[1].trim().toLowerCase());
        }
        else if (cmd.startsWith("+")) {
            plusindex = labelsLower.indexOf(message.content.split("-")[0].substring(1).trim().toLowerCase());
            minusindex = labelsLower.indexOf(message.content.split("-")[1].trim().toLowerCase());
        }

        if (minusindex == -1 || points[minusindex] == 0 || plusindex == -1 || points[plusindex] == 0 || plusindex == minusindex) {
            valid = false;
            if (minusindex == -1) {
                errors += "Invalid item to subtract points from. ";
            }
            if (plusindex == -1) {
                errors += "Invalid item to add points to. ";
            }
            if (points[minusindex] == 0) {
                errors += "Item does not have any points to subtract. ";
            }
            if (points[plusindex] == 0) {
                errors += "Points cannot be added to an item at 0. ";
            }
            if (plusindex == minusindex) {
                errors += "Cannot subtract and add points from same item.";
            }
        }

        if (valid) {
            console.log(players);
            let player = players.filter(p => p.id === message.author.id)[0];
            console.log(player);
            if (!player) {
                players.push({
                    id: message.author.id,
                    lastMsg: new Date().getTime(),
                    lastadd: labels[plusindex],
                    lastminus: labels[minusindex]
                });
                points[minusindex] -= 1;
                points[plusindex] += 1;
            }
            else if (player.lastMsg > new Date().getTime() - 3600000) { //1000 * 60 * 60 * 1 (1 hour)
                valid = false;
                let minutesLeft: number = Math.ceil((player.lastMsg - (new Date().getTime() - 3600000)) / (1000 * 60));
                if (minutesLeft > 1) {
                    errors += "You must wait " + minutesLeft + " minutes before sending another message.";
                }
                else {
                    errors += "You must wait " + minutesLeft + " minutes before sending another message.";
                }
            }
            else if (plusindex == labels.indexOf(player.lastadd) && minusindex == labels.indexOf(player.lastminus)) {
                valid = false;
                errors += "You cannot repeat the same action twice in a row.";
            }
            else {
                player.lastMsg = new Date().getTime();
                player.lastadd = labels[plusindex];
                player.lastminus = labels[minusindex];
                points[minusindex] -= 1;
                points[plusindex] += 1;
            }

            fs.writeFile('./players.json', JSON.stringify(players), 'utf8', function (err) {
                if (err) {
                    console.log(err);
                } else {
                    //Everything went OK!
                }
            });
        }

        let totalNonzero: number = points.filter(p => p > 0).length;

        if (valid) {
            let reply: string = "";
            for (let i = 0; i < items.length; ++i) {
                if (points[i] > 0 && totalNonzero > 1) {
                    reply += "(" + labels[i] + ") " + items[i] + " - " + points[i]
                }
                else if (points[i] > 0 && totalNonzero == 1) {
                    reply += "**(" + labels[i] + ") " + items[i] + " - " + points[i] + "** :crown:";
                }
                else if (totalNonzero > 1) {
                    reply += "**(" + labels[i] + ") " + items[i] + " - " + points[i] + "** :skull:";
                }
                else {
                    reply += "(" + labels[i] + ") " + items[i] + " - " + points[i] + " :skull:";
                }
                if (i != items.length - 1) {
                    reply += "\n";
                }
            }
            message.reply(reply);

            if (totalNonzero > 2) {
                endgame = true;
                let nonZeroItems: string[] = [];
                for (let i = 0; i < points.length; ++i) {
                    if (points[i] > 0) {
                        nonZeroItems.push(items[i]);
                    }
                }
                winVoteMsg = await message.channel.send("**FINAL TWO:**\n(react to vote)\n(1️⃣) " + nonZeroItems[0] + "\n(2️⃣) " + nonZeroItems[1]);
                winVoteMsg.pin();

                winVoteMsg.react("1️⃣").then(() => {
                    winVoteMsg.react("2️⃣").then(async () => {
                        await new Promise(r => setTimeout(r, 1000 * 60 * 60 * 24)); //24 hours

                        if(winVoteMsg.reactions.cache.get("1️⃣").count > winVoteMsg.reactions.cache.get("2️⃣").count) {
                            message.channel.send("**" + nonZeroItems[0] + " has won the game!**");
                        }
                        else if(winVoteMsg.reactions.cache.get("1️⃣").count < winVoteMsg.reactions.cache.get("2️⃣").count) {
                            message.channel.send("**" + nonZeroItems[1] + " has won the game!**");
                        }
                        else {
                            message.channel.send("**The game has ended in a tie!**");
                        }
                    });
                });
                
                
                //winVoteMsg.react
            }

            if (totalNonzero == 1) {
                let index: number = -1;
                for (let i = 0; i < points.length; i++) {
                    if (points[i] > 0) {
                        index = i;
                    }
                }
                message.channel.send(":crown: **" + items[index] + " has won the game!** :crown:");
            }

            let fileText = "";
            for (let p = 0; p < points.length; ++p) {
                if (p != points.length - 1) {
                    fileText += "" + points[p] + "\n";
                }
                else {
                    fileText += "" + points[p];
                }
            }
            console.log(fileText);
            console.log(points);
            fs.writeFile(pointsPath, fileText, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }
        else {
            message.reply(errors);
        }
    }

    //Check for prefix
    if (!cmd.startsWith(prefix)) return;

    //Get the command from the commands collection and then if the command is found run the command file
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(bot, message, args);

});

bot.login(token);


// bot.on('ready', () => {
//   console.log(`Logged in...`);
// });

// bot.on('message', msg => {
//   msg.reply('pong');
// });

//Token needed in config.json