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
            DataManager.updateData();
        }

        return this.myInstance;
    }

    static updateData() {
        if (fs.existsSync("./data.json")) {
            fs.readFile("./data.json", 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this.fullData = JSON.parse(data);
                this.players = fullData.players;
                this.kills = fullData.kills;
                this.killers = fullData.killers;
                this.saves = fullData.saves;
                this.savers = fullData.savers;
                this.history = fullData.history ?? [];
                this.items = fullData.items;
                this.active = fullData.active ?? false;
            });
        }
    }

    static getData() {
        return this.fullData;
    }

    static saveData(data) {
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