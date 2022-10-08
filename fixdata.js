const fs = require("fs");

if (fs.existsSync("./data.json")) {
    fs.readFile("./data.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let fullData = JSON.parse(data);
        let players = fullData["279211267443523585"]["980960076686848030"].players;

        console.log(Object.keys(fullData["279211267443523585"]));

        players.forEach(p => {
            p.lastMsg = 0;
        })

        fullData["279211267443523585"].players = players;

        fs.writeFile("./data.json", JSON.stringify(fullData), 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
}