const fs = require("fs");

module.exports = class DataManager {
    static myInstance = null;

    static data = {};
    static settings = {};
    static themes = {};

    static getInstance() {
        if (DataManager.myInstance == null) {
            DataManager.myInstance = new DataManager();
            this.myInstance.updateData();
        }

        return this.myInstance;
    }

    updateData() {
        if (fs.existsSync("./data.json")) {
            fs.readFile("./data.json", 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this.data = JSON.parse(data);
            });
        }
        if (fs.existsSync("./settings.json")) {
            fs.readFile("./settings.json", 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this.settings = JSON.parse(data);
            });
        }
        if (fs.existsSync("./themes.json")) {
            fs.readFile("./themes.json", 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this.themes = JSON.parse(data);
            });
        }
    }

    checkValidChannel(guildID, channelID) {
        return channelID in this.data[guildID];
    }

    getGameData(guildID, channelID) {
        if (!(guildID in this.data)) {
            console.log("Guild ID: " + guildID + " not found. Adding.");
            this.data[guildID] = {
                players: []
            };
        }
        if(!(channelID in this.data[guildID])) {
            console.log("Channel ID: " + channelID + " for guild ID: " + guildID + " not found. Adding.");
            this.data[guildID][channelID] = {
                assisters: [],
                items: [],
                killers: [],
                kills: [],
                gamePlayers: [],
                savers: [],
                saves: [],
                history: [],
                active: false
            }
        }
        return this.data[guildID][channelID];
    }

    getPlayerData(guildID) {
        return this.data[guildID].players;
    }

    getGuildThemes(guildID) {
        return this.themes[guildID];
    }

    getGuildSettings(guildID) {
        if(!(guildID in this.settings)) {
            createDefaultGuildSettings(guildID)
        }
        return this.settings[guildID];
    }

    createDefaultGuildSettings(guildID) {
        if(!(guildID in this.data)) {
            this.data[guildID] = {
                players: [],
                gamePlayers: [],
                kills: [],
                killers: [],
                saves: [],
                savers: [],
                assisters: [],
                history: [],
                active: false
            }
        }
        if(!(guildID in this.themes)) {
            this.themes[guildID] = {
                themes: []
            }
        }
        console.log("ADDING SETTINGS")
        this.settings[guildID] = {
            admins: ["200313450319052801"],
            blockedUsers: [],
        }
    }

    //Attempts to add a theme for the specified guild
    //If it is sucessfully added, the function returns true, otherwise it returns false
    addTheme(guildID, name, items) {
        if (this.themes[guildID].themes.filter(t => t.name.toLowerCase() == name.toLowerCase()).length == 0) {
            this.themes[guildID].themes.push({
                name: name,
                items: items,
            });
            this.updateThemes();
            return true;
        }
        return false;
    }

    removeTheme(guildID, name) {
        if (this.themes[guildID].themes.filter(t => t.name.toLowerCase() == name.toLowerCase()).length == 1) {
            this.themes[guildID].themes.splice(this.themes[guildID].themes.map(t => t.name.toLowerCase()).indexOf(name.toLowerCase()), 1);
            this.updateThemes();
            return true
        }
        return false;
    }

    updateThemes() {
        fs.writeFile("./themes.json", JSON.stringify(this.themes), 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    saveGameData(data, guildID, channelID) {
        this.data[guildID][channelID] = data

        fs.writeFile("./data.json", JSON.stringify(this.data), 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    savePlayerData(players, guildID) {
        this.data[guildID].players = players;

        fs.writeFile("./data.json", JSON.stringify(this.data), 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
}