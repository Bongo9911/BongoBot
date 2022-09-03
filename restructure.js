const fs = require("fs");

if (fs.existsSync("./data.json")) {
    fs.readFile("./data.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let fullData = JSON.parse(data);
        console.log(fullData)

        let saveData = {
            "279211267443523585": {
                players: fullData.players,
                "980960076686848030": {
                    kills: fullData.kills,
                    killers: fullData.killers,
                    saves: fullData.saves,
                    savers: fullData.savers,
                    history: fullData.history,
                    items: fullData.items,
                    active: fullData.active
                }
            }
        };

        fs.writeFile("./data.json", JSON.stringify(saveData), 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
}

if (fs.existsSync("./themes.json")) {
    fs.readFile("./themes.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let fullData = JSON.parse(data);

        let saveData = {
            "279211267443523585": {
                themes: fullData.themes
            }
        };

        fs.writeFile("./themes.json", JSON.stringify(saveData), 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
}

if (fs.existsSync("./settings.json")) {
    fs.readFile("./settings.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let fullData = JSON.parse(data);

        let saveData = {
            "279211267443523585": {
                admins: fullData.admins
            }
        };

        fs.writeFile("./settings.json", JSON.stringify(saveData), 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
}