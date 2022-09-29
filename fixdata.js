const fs = require("fs");

if (fs.existsSync("./data.json")) {
    fs.readFile("./data.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let fullData = JSON.parse(data);
        let players = fullData["279211267443523585"].players;

        players.forEach(p => {
            p.assists = 0;
        })

        fullData["279211267443523585"].players = players;

        fs.writeFile("./data.json", JSON.stringify(fullData), 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
}