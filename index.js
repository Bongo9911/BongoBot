require('dotenv').config({ debug: true });

const { prefix } = require("./config.json");

const { Client, Intents, Collection } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const fs = require("fs");

const { MessageEmbed } = require('discord.js');
const DataManager = require('./data/dataManager');

bot.commands = new Collection();

const commandFiles = fs.readdirSync('./commands/').filter(f => f.endsWith('.js'))
for (const file of commandFiles) {
    const props = require(`./commands/${file}`)
    console.log(`${file} loaded`)
    props.help.name.forEach(name => bot.commands.set(name, props));
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

let players = [];

let kills = [];
let killers = [];
let saves = [];
let savers = [];

let history = [];

let items = [];
let active = false;

let dm = DataManager.getInstance();

let winVoteMsg;

//Command Manager
bot.on("messageCreate", async message => {
    try {
        //Check if author is a bot or the message was sent in dms and return
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;

        //get prefix from config and prepare message so it can be read as a command
        let messageArray = message.content.split(" ");
        let cmd = messageArray[0];
        let args = messageArray.slice(1);

        let fullData = dm.getData();
        players = fullData.players;
        kills = fullData.kills;
        killers = fullData.killers;
        saves = fullData.saves;
        savers = fullData.savers;
        history = fullData.history;
        items = fullData.items;
        active = fullData.active;

        let errors = "";

        let valid = true;
        if ((cmd.startsWith("-") || cmd.startsWith("+")) && items.filter(m => m.points > 0).length > 2 &&
            message.content.indexOf("+") != -1 && message.content.indexOf("-") != -1 && active &&
            (message.channel.id == 980960076686848030 || message.channel.id == 389594279758135317)) {

            let minusindex = -1;
            let plusindex = -1;

            if (cmd.startsWith("-")) {
                minusindex = items.map(m => m.labelLower).indexOf(message.content.split("+")[0].substring(1).trim().toLowerCase())
                if (minusindex == -1) minusindex = items.map(m => m.itemLower).indexOf(message.content.split("+")[0].substring(1).trim().toLowerCase());
                plusindex = items.map(m => m.labelLower).indexOf(message.content.split("+")[1].trim().toLowerCase());
                if (plusindex == -1) plusindex = items.map(m => m.itemLower).indexOf(message.content.split("+")[1].trim().toLowerCase());
            }
            else if (cmd.startsWith("+")) {
                plusindex = items.map(m => m.labelLower).indexOf(message.content.split("-")[0].substring(1).trim().toLowerCase());
                if (plusindex == -1) plusindex = items.map(m => m.itemLower).indexOf(message.content.split("-")[0].substring(1).trim().toLowerCase());
                minusindex = items.map(m => m.labelLower).indexOf(message.content.split("-")[1].trim().toLowerCase());
                if (minusindex == -1) minusindex = items.map(m => m.itemLower).indexOf(message.content.split("-")[1].trim().toLowerCase());
            }

            if (minusindex == -1 || items[minusindex].points == 0 || plusindex == -1 || items[plusindex].points == 0 || plusindex == minusindex) {
                valid = false;
                if (minusindex == -1) {
                    errors += "Invalid item to subtract points from. ";
                }
                if (plusindex == -1) {
                    errors += "Invalid item to add points to. ";
                }
                if (minusindex != -1 && items[minusindex].points == 0) {
                    errors += "Item does not have any points to subtract. ";
                }
                if (plusindex != -1 && items[plusindex].points == 0) {
                    errors += "Points cannot be added to an item at 0. ";
                }
                if (plusindex == minusindex && plusindex != -1) {
                    errors += "Cannot subtract and add points from same item.";
                }
            }

            if (valid) {
                //console.log(players);
                let player = players.filter(p => p.id === message.author.id)[0];
                console.log(player);

                if (!player) {
                    players.push({
                        id: message.author.id,
                        lastMsg: new Date().getTime(),
                        lastadd: items[plusindex].label,
                        lastminus: items[minusindex].label,
                        kills: 0,
                        saves: 0,
                        badges: [],
                        featuredBadge: "",
                    });
                    //points[minusindex] -= points.filter(p => p > 0).length <= 5 ? 2 : 1;
                }
                else {
                    let minutesLeft = (player.lastMsg - (new Date().getTime() - (items.filter(m => m.points > 0).length <= 5 ? 1800000 : 3600000))) / (1000 * 60);
                    if (minutesLeft > 0) { //1000 * 60 * 60 * 1 (1 hour)
                        valid = false;
                        errors += "You can send another message <t:" + (Math.ceil(player.lastMsg / 1000) + (items.filter(p => p.points > 0).length <= 5 ? 1800 : 3600)) + ":R>.";
                    }
                    // else if (plusindex == labels.indexOf(player.lastadd) && minusindex == labels.indexOf(player.lastminus) && points.filter(p => p > 0).length > 5) {
                    //     valid = false;
                    //     errors += "You cannot repeat the same action twice in a row.";
                    // }
                    else {
                        player.lastMsg = new Date().getTime();
                        player.lastadd = items[plusindex].label;
                        player.lastminus = items[minusindex].label;
                        //points[minusindex] -= points.filter(p => p > 0).length <= 5 ? 2 : 1;
                    }
                }
            }

            if (valid) {
                let player = players.filter(p => p.id === message.author.id)[0];

                if (items[minusindex].points == 1) {
                    player.kills += 1;
                    kills.push(items[minusindex].label);
                    killers.push(message.author.id);
                    if (items[minusindex].savetime > 0 && items[minusindex].savetime - (new Date().getTime() - 300000) > 0 && player.badges.indexOf("Memento Mori") == -1) {
                        player.badges.push("Memento Mori")
                        message.reply("Badge Awarded! :skull: **Memento Mori**");
                    }

                    if (player.kills == 1) {
                        player.badges.push("Killer");
                        message.reply("Badge Awarded! :knife: **Killer**");
                    }
                    else if (player.kills == 5) {
                        player.badges.push("Serial Killer");
                        message.reply("Badge Awarded! :dagger: **Serial Killer**");
                    }
                }
                //if ((points[plusindex] == 2 && points.filter(p => p > 0).length > 5) || (points[plusindex] == 3 && points.filter(p => p > 0).length <= 5)) {
                if (items[plusindex].points == 1) {
                    player.saves += 1;
                    saves.push(items[plusindex].label);
                    savers.push(message.author.id);

                    if (player.saves == 1) {
                        player.badges.push("Hero");
                        message.reply("Badge Awarded! :superhero: **Hero**");
                    }
                    else if (player.saves == 5) {
                        player.badges.push("Savior");
                        message.reply("Badge Awarded! :innocent: **Savior**");
                    }

                    if (items[plusindex].savetime != 0 && player.badges.indexOf("Double Trouble") == -1) {
                        player.badges.push("Double Trouble");
                        message.reply("Badge Awarded! :camel: **Double Trouble**");
                    }

                    items[plusindex].savetime = new Date().getTime();
                }

                items[minusindex].points -= 1;
                items[plusindex].points += 1;

                if (items[minusindex].points < 0) {
                    items[minusindex].points = 0;
                }
            }

            let totalNonzero = items.filter(m => m.points > 0).length;

            if (valid) {
                let player = players.filter(p => p.id === message.author.id)[0];

                if (totalNonzero == 2 && player.badges.indexOf("Finishing Blow") == -1) {
                    player.badges.push("Finishing Blow");
                    message.reply("Badge Awarded! :boom: **Finishing Blow**");
                }

                let nonZeroItems = items.filter((m, i) => m.points > 0 || (m.points == 0 && i == minusindex));

                let columns = Math.ceil(nonZeroItems.length / 25);
                let perColumn = Math.ceil(nonZeroItems.length / columns);

                if (items[minusindex].points == 0 && items.length > 35 && totalNonzero == Math.floor(items.length / 2)) {
                    message.channel.send("Top half reached! All point totals will now be halved.");
                    items.forEach(m => m.points = Math.round(m.points / 2));
                }

                for (let p = 0; p < items.length; ++p) {
                    history[p].push(items[p].points);
                }

                const pointsEmbed = new MessageEmbed()
                    .setColor('#0099ff')

                for (let i = 0; i < columns; ++i) {
                    let pointCol = "";
                    for (let j = i * perColumn; j < (i + 1) * perColumn && j < nonZeroItems.length; ++j) {
                        if (nonZeroItems[j].points > 0) {
                            pointCol += "(" + nonZeroItems[j].label + ") " + (nonZeroItems[j].emoji ? nonZeroItems[j].emoji + " " : "") + nonZeroItems[j].item + " - **" + nonZeroItems[j].points + "**\n";
                        }
                        else {
                            pointCol += "**(" + nonZeroItems[j].label + ") " + (nonZeroItems[j].emoji ? nonZeroItems[j].emoji + " " : "") + nonZeroItems[j].item + " - " + nonZeroItems[j].points + "** :skull:\n";
                        }
                    }
                    if (i == 0) {
                        pointsEmbed.addField("Points", pointCol, true);
                    }
                    else {
                        pointsEmbed.addField("\u200b", pointCol, true);
                    }
                }

                message.reply({ embeds: [pointsEmbed] });

                if (totalNonzero == 5 && items[minusindex].points == 0) {
                    //All items will now lose 2 points when subtracting. Actions can be repeated twice in a row. 
                    message.channel.send("**TOP 5 RULE CHANGE**: Cooldown shortened to 30 minutes.");
                }

                if (totalNonzero == 2) {
                    nonZeroItems = [];
                    for (let i = 0; i < items.length; ++i) {
                        if (items[i].points > 0) {
                            nonZeroItems.push(items[i].item);
                        }
                    }

                    //"You can send another message <t:" + (Math.ceil(player.lastMsg / 1000) + (items.filter(p => p.points > 0).length <= 5 ? 1800 : 3600)) + ":R>."
                    message.channel.send("**<@&983347003176132608>\nFINAL TWO:**\n(react to vote)\n" +
                        "Voting ends <t:" + ((new Date().getTime() + (1000 * 60 * 60 * 12)) / 60000) + ":R>\n" +
                        "(1️⃣) " + nonZeroItems[0] + "\n(2️⃣) " + nonZeroItems[1]).then(msg => {
                            winVoteMsg = msg;
                            winVoteMsg.pin();

                            winVoteMsg.react("1️⃣").then(() => {
                                winVoteMsg.react("2️⃣").then(async () => {
                                    new Promise(r => setTimeout(r, 1000 * 60 * 60 * 12)).then(() => { //12 hours
                                        if (winVoteMsg.reactions.cache.get("1️⃣").count > winVoteMsg.reactions.cache.get("2️⃣").count) {
                                            message.channel.send("**" + nonZeroItems[0] + " has won the game with " + winVoteMsg.reactions.cache.get("1️⃣").count + " votes!**");
                                        }
                                        else if (winVoteMsg.reactions.cache.get("1️⃣").count < winVoteMsg.reactions.cache.get("2️⃣").count) {
                                            message.channel.send("**" + nonZeroItems[1] + " has won the game with " + winVoteMsg.reactions.cache.get("2️⃣").count + " votes!**");
                                        }
                                        else {
                                            message.channel.send("**The game has ended in a tie!**");
                                        }
                                    });
                                });
                            });
                        });
                }

                let data = {
                    "items": items,
                    "players": players,
                    "kills": kills,
                    "killers": killers,
                    "saves": saves,
                    "savers": savers,
                    "history": history,
                    "active": active,
                }

                dm.saveData(data);
            }
            else {
                message.reply(errors);
            }
        }

        //Check for prefix
        if (!cmd.startsWith(prefix)) return;

        console.log(args);

        if (cmd.startsWith("b.points")) {
            let nonZeroItems = items.filter(m => m.points > 0);

            let columns = Math.ceil(nonZeroItems.length / 25);
            let perColumn = Math.ceil(nonZeroItems.length / columns);

            const pointsEmbed = new MessageEmbed()
                .setColor('#0099ff');

            for (let i = 0; i < columns; ++i) {
                let pointCol = "";
                for (let j = i * perColumn; j < (i + 1) * perColumn && j < nonZeroItems.length; ++j) {
                    pointCol += "(" + nonZeroItems[j].label + ") " + (nonZeroItems[j].emoji ? nonZeroItems[j].emoji + " " : "") + nonZeroItems[j].item + " - **" + nonZeroItems[j].points + "**\n";
                }
                if (i == 0) {
                    pointsEmbed.addField("Points", pointCol, true);
                }
                else {
                    pointsEmbed.addField("\u200b", pointCol, true);
                }
            }
            message.reply({ embeds: [pointsEmbed] });
        }
        else {
            //Get the command from the commands collection and then if the command is found run the command file
            let commandfile = bot.commands.get(cmd.slice(prefix.length));
            if (commandfile) commandfile.run(bot, message, args);
        }
    }
    catch (e) {
        console.error(e.message);
    }
});

bot.login(process.env.TOKEN);