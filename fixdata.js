const fs = require("fs");

if (fs.existsSync("./data.json")) {
    fs.readFile("./data.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let fullData = JSON.parse(data);
        let players = fullData["279211267443523585"].players;

        // fullData["279211267443523585"]["980960076686848030"].history = fullData["279211267443523585"]["980960076686848030"].history.slice(0,35);
        fullData["279211267443523585"]["980960076686848030"].history.forEach(m => {
            m = m.slice(0,35);
        })
        players.find(p => p.id =="106155803328692224").kills -= 1;
        players.find(p => p.id =="272846817991983107").kills -= 1;
        players.find(p => p.id =="429033918079959040").kills -= 1;
        players.find(p => p.id =="333537760835141632").kills -= 1;
        players.find(p => p.id =="207829172775550976").kills -= 1;

        players.find(p => p.id =="190928550843514881").saves -= 1;

        fullData["279211267443523585"]["980960076686848030"].kills = fullData["279211267443523585"]["980960076686848030"].kills.slice(0,3);
        fullData["279211267443523585"]["980960076686848030"].killers = fullData["279211267443523585"]["980960076686848030"].killers.slice(0,3);

        fullData["279211267443523585"]["980960076686848030"].saves = [];
        fullData["279211267443523585"]["980960076686848030"].savers = [];

        players.find(p => p.id =="106155803328692224").badges.splice(players.find(p => p.id =="106155803328692224").badges.indexOf("Serial Killer"));

        fullData["279211267443523585"]["980960076686848030"].items[0].points = 7
        fullData["279211267443523585"]["980960076686848030"].items[1].points = 6
        fullData["279211267443523585"]["980960076686848030"].items[2].points = 5
        fullData["279211267443523585"]["980960076686848030"].items[3].points = 4
        fullData["279211267443523585"]["980960076686848030"].items[4].points = 9
        fullData["279211267443523585"]["980960076686848030"].items[5].points = 0
        fullData["279211267443523585"]["980960076686848030"].items[6].points = 3
        fullData["279211267443523585"]["980960076686848030"].items[7].points = 2
        fullData["279211267443523585"]["980960076686848030"].items[8].points = 6
        fullData["279211267443523585"]["980960076686848030"].items[9].points = 6
        fullData["279211267443523585"]["980960076686848030"].items[10].points = 6
        fullData["279211267443523585"]["980960076686848030"].items[11].points = 7
        fullData["279211267443523585"]["980960076686848030"].items[12].points = 0
        fullData["279211267443523585"]["980960076686848030"].items[13].points = 7
        fullData["279211267443523585"]["980960076686848030"].items[14].points = 6
        fullData["279211267443523585"]["980960076686848030"].items[15].points = 0
        fullData["279211267443523585"]["980960076686848030"].items[16].points = 4
        fullData["279211267443523585"]["980960076686848030"].items[17].points = 12

        fullData["279211267443523585"].players = players;

        fs.writeFile("./data.json", JSON.stringify(fullData), 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
}