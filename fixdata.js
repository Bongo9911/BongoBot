const fs = require("fs");

if (fs.existsSync("./data.json")) {
    fs.readFile("./data.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let fullData = JSON.parse(data);
        let players = fullData["279211267443523585"].players;

        players.push({
            id: "206879808523599876",
            lastMsg: new Date().getTime(),
            lastadd: "0",
            lastminus: "0",
            kills: 0,
            saves: 0,
            badges: [],
            featuredBadge: "",
        })

        players.filter(p => p.id == "106155803328692224")[0].kills += 1;
        players.filter(p => p.id == "213596035392471040")[0].kills += 1;
        players.filter(p => p.id == "483744393782624267")[0].kills += 1;
        players.filter(p => p.id == "200313450319052801")[0].kills += 1;
        players.filter(p => p.id == "190928550843514881")[0].kills += 1;
        players.filter(p => p.id == "370619552603701281")[0].kills += 1;
        players.filter(p => p.id == "173166238158159872")[0].kills += 1;
        players.filter(p => p.id == "213596035392471040")[0].kills += 1;
        players.filter(p => p.id == "416179979517296641")[0].kills += 1;
        players.filter(p => p.id == "275976428493996032")[0].kills += 1;
        players.filter(p => p.id == "370619552603701281")[0].kills += 1;
        players.filter(p => p.id == "272846817991983107")[0].kills += 1;
        players.filter(p => p.id == "466649841779474452")[0].kills += 1;
        players.filter(p => p.id == "163677099247403009")[0].kills += 1;
        players.filter(p => p.id == "237306200046305290")[0].kills += 1;
        players.filter(p => p.id == "152901471288033280")[0].kills += 1;
        players.filter(p => p.id == "152901471288033280")[0].kills += 1;
        players.filter(p => p.id == "373951390898192384")[0].kills += 1;
        players.filter(p => p.id == "624238518364930068")[0].kills += 1;
        players.filter(p => p.id == "416179979517296641")[0].kills += 1;
        players.filter(p => p.id == "184078051502456832")[0].kills += 1;
        players.filter(p => p.id == "200313450319052801")[0].kills += 1;
        players.filter(p => p.id == "164846785473282048")[0].kills += 1;
        players.filter(p => p.id == "326928174195802113")[0].kills += 1;
        players.filter(p => p.id == "170842681562497025")[0].kills += 1;
        players.filter(p => p.id == "106155803328692224")[0].kills += 1;
        players.filter(p => p.id == "207937954880946176")[0].kills += 1;
        players.filter(p => p.id == "320254255325904897")[0].kills += 1;
        players.filter(p => p.id == "416179979517296641")[0].kills += 1;
        players.filter(p => p.id == "170842681562497025")[0].kills += 1;
        players.filter(p => p.id == "483744393782624267")[0].kills += 1;
        players.filter(p => p.id == "483744393782624267")[0].kills += 1;
        players.filter(p => p.id == "106155803328692224")[0].kills += 1;
        players.filter(p => p.id == "373951390898192384")[0].kills += 1;
        players.filter(p => p.id == "163677099247403009")[0].kills += 1;
        players.filter(p => p.id == "429033918079959040")[0].kills += 1;
        players.filter(p => p.id == "206879808523599876")[0].kills += 1;
        players.filter(p => p.id == "333537760835141632")[0].kills += 1;
        players.filter(p => p.id == "207937954880946176")[0].kills += 1;


        players.filter(p => p.id == "483744393782624267")[0].saves += 1;
        players.filter(p => p.id == "274149956816994307")[0].saves += 1;
        players.filter(p => p.id == "429033918079959040")[0].saves += 1;
        players.filter(p => p.id == "483744393782624267")[0].saves += 1;
        players.filter(p => p.id == "190928550843514881")[0].saves += 1;
        players.filter(p => p.id == "207937954880946176")[0].saves += 1;
        players.filter(p => p.id == "483744393782624267")[0].saves += 1;
        players.filter(p => p.id == "429033918079959040")[0].saves += 1;
        players.filter(p => p.id == "483744393782624267")[0].saves += 1;
        players.filter(p => p.id == "173166238158159872")[0].saves += 1;
        players.filter(p => p.id == "272846817991983107")[0].saves += 1;
        players.filter(p => p.id == "429033918079959040")[0].saves += 1;
        players.filter(p => p.id == "429033918079959040")[0].saves += 1;
        players.filter(p => p.id == "274149956816994307")[0].saves += 1;
        players.filter(p => p.id == "593568262189613159")[0].saves += 1;


        players.filter(p => p.id == "173166238158159872")[0].badges.push("Memento Mori");
        players.filter(p => p.id == "173166238158159872")[0].badges.push("Serial Killer");
        players.filter(p => p.id == "275976428493996032")[0].badges.push("Killer");
        players.filter(p => p.id == "163677099247403009")[0].badges.push("Serial Killer");
        players.filter(p => p.id == "207937954880946176")[0].badges.push("Hero");
        players.filter(p => p.id == "152901471288033280")[0].badges.push("Serial Killer");
        players.filter(p => p.id == "624238518364930068")[0].badges.push("Serial Killer");
        players.filter(p => p.id == "184078051502456832")[0].badges.push("Killer");
        players.filter(p => p.id == "200313450319052801")[0].badges.push("Memento Mori");
        players.filter(p => p.id == "164846785473282048")[0].badges.push("Killer");
        players.filter(p => p.id == "483744393782624267")[0].badges.push("Savior");
        players.filter(p => p.id == "326928174195802113")[0].badges.push("Memento Mori");
        players.filter(p => p.id == "326928174195802113")[0].badges.push("Killer");
        players.filter(p => p.id == "170842681562497025")[0].badges.push("Memento Mori");
        players.filter(p => p.id == "272846817991983107")[0].badges.push("Hero");
        players.filter(p => p.id == "429033918079959040")[0].badges.push("Savior");
        players.filter(p => p.id == "373951390898192384")[0].badges.push("Memento Mori");
        players.filter(p => p.id == "206879808523599876")[0].badges.push("Killer");
        players.filter(p => p.id == "593568262189613159")[0].badges.push("Hero");
        players.filter(p => p.id == "207937954880946176")[0].badges.push("Serial Killer");
        players.filter(p => p.id == "207937954880946176")[0].badges.push("Finishing Blow");

        fullData["279211267443523585"].players = players;

        fs.writeFile("./data.json", JSON.stringify(fullData), 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
}