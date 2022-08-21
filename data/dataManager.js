const fs = require("fs");

module.exports =  class DataManager {
    static myInstance = null;

    static fullData = {};

    static players = [];
    static kills = [];
    static killers = [];
    static saves = [];
    static savers = [];
    static history = [];
    static items = [];
    static active = false;

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
                this.fullData = JSON.parse(data);
                this.players = this.fullData.players;
                this.kills = this.fullData.kills;
                this.killers = this.fullData.killers;
                this.saves = this.fullData.saves;
                this.savers = this.fullData.savers;
                this.history = this.fullData.history ?? [];
                this.items = this.fullData.items;
                this.active = this.fullData.active ?? false;
            });
        }
    }

    getData() {
        return this.fullData;
    }

    saveData(data) {
        this.fullData = data;
        this.players = data.players;
        this.kills = data.kills;
        this.killers = data.killers;
        this.saves = data.saves;
        this.savers = data.savers;
        this.history = data.history ?? [];
        this.items = data.items;
        this.active = data.active ?? false;
        
        fs.writeFile("./data.json", JSON.stringify(data), 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
}