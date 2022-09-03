const fs = require("fs");

module.exports =  class DataManager {
    static myInstance = null;

    static data = {};

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
    }


    getGameData(guildID, channelID) {
        return this.data[guildID][channelID];
    }

    getPlayerData(guildID) {
        return this.data[guildID].players;
    }

    saveData(data, guildID, channelID) {
        this.data[guildID].players = data.players,
        this.data[guildID][channelID].kills = data.kills;
        this.data[guildID][channelID].killers = data.killers;
        this.data[guildID][channelID].saves = data.saves;
        this.data[guildID][channelID].savers = data.savers;
        this.data[guildID][channelID].history = data.history ?? [];
        this.data[guildID][channelID].items = data.items;
        this.data[guildID][channelID].active = data.active ?? false;
        
        fs.writeFile("./data.json", JSON.stringify(data), 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
}