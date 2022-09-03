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
        if (guildID in this.data && channelID in this.data[guildID]) {
            return this.data[guildID][channelID];
        }
        else {
            return null;
        }
    }

    getPlayerData(guildID) {
        return this.data[guildID].players;
    }

    getGuildThemes(guildID) {
        return this.themes[guildID];
    }

    getGuildSettings(guildID) {
        return this.settings[guildID];
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

    saveData(data, guildID, channelID) {
        this.savePlayerData(data.players, guildID),
            this.saveGameData(data, guildID, channelID);
    }

    saveGameData(data, guildID, channelID) {
        this.data[guildID][channelID].kills = data.kills;
        this.data[guildID][channelID].killers = data.killers;
        this.data[guildID][channelID].saves = data.saves;
        this.data[guildID][channelID].savers = data.savers;
        this.data[guildID][channelID].history = data.history ?? [];
        this.data[guildID][channelID].items = data.items;
        this.data[guildID][channelID].active = data.active ?? false;

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