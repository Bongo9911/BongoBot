const fs = require("fs");

if (fs.existsSync("./data.json")) {
    fs.readFile("./data.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let fullData = JSON.parse(data);
        let players = fullData["279211267443523585"].players;

        players["106155803328692224"].kills += 1;
        players["213596035392471040"].kills += 1;
        players["483744393782624267"].kills += 1;
        players["200313450319052801"].kills += 1;
        players["190928550843514881"].kills += 1;
        players["370619552603701281"].kills += 1;
        players["173166238158159872"].kills += 1;
        players["213596035392471040"].kills += 1;
        players["416179979517296641"].kills += 1;
        players["275976428493996032"].kills += 1;
        players["370619552603701281"].kills += 1;
        players["272846817991983107"].kills += 1;
        players["466649841779474452"].kills += 1;
        players["163677099247403009"].kills += 1;
        players["237306200046305290"].kills += 1;
        players["152901471288033280"].kills += 1;
        players["152901471288033280"].kills += 1;
        players["373951390898192384"].kills += 1;
        players["624238518364930068"].kills += 1;
        players["416179979517296641"].kills += 1;
        players["184078051502456832"].kills += 1;
        players["200313450319052801"].kills += 1;
        players["164846785473282048"].kills += 1;
        players["326928174195802113"].kills += 1;
        players["170842681562497025"].kills += 1;
        players["106155803328692224"].kills += 1;
        players["207937954880946176"].kills += 1;
        players["320254255325904897"].kills += 1;
        players["416179979517296641"].kills += 1;
        players["170842681562497025"].kills += 1;
        players["483744393782624267"].kills += 1;
        players["483744393782624267"].kills += 1;
        players["106155803328692224"].kills += 1;
        players["373951390898192384"].kills += 1;
        players["163677099247403009"].kills += 1;
        players["429033918079959040"].kills += 1;
        players["206879808523599876"].kills += 1;
        players["333537760835141632"].kills += 1;
        players["207937954880946176"].kills += 1;


        players["483744393782624267"].saves += 1;
        players["274149956816994307"].saves += 1;
        players["429033918079959040"].saves += 1;
        players["483744393782624267"].saves += 1;
        players["190928550843514881"].saves += 1;
        players["207937954880946176"].saves += 1;
        players["483744393782624267"].saves += 1;
        players["429033918079959040"].saves += 1;
        players["483744393782624267"].saves += 1;
        players["173166238158159872"].saves += 1;
        players["272846817991983107"].saves += 1;
        players["429033918079959040"].saves += 1;
        players["429033918079959040"].saves += 1;
        players["274149956816994307"].saves += 1;
        players["593568262189613159"].saves += 1;


        players["173166238158159872"].badges.push("Memento Mori");
        players["173166238158159872"].badges.push("Serial Killer");
        players["275976428493996032"].badges.push("Killer");
        players["163677099247403009"].badges.push("Serial Killer");
        players["207937954880946176"].badges.push("Hero");
        players["152901471288033280"].badges.push("Serial Killer");
        players["624238518364930068"].badges.push("Serial Killer");
        players["184078051502456832"].badges.push("Killer");
        players["200313450319052801"].badges.push("Memento Mori");
        players["164846785473282048"].badges.push("Killer");
        players["483744393782624267"].badges.push("Savior");
        players["326928174195802113"].badges.push("Memento Mori");
        players["326928174195802113"].badges.push("Killer");
        players["170842681562497025"].badges.push("Memento Mori");
        players["272846817991983107"].badges.push("Hero");
        players["429033918079959040"].badges.push("Savior");
        players["373951390898192384"].badges.push("Memento Mori");
        players["206879808523599876"].badges.push("Killer");
        players["593568262189613159"].badges.push("Hero");
        players["207937954880946176"].badges.push("Serial Killer");
        players["207937954880946176"].badges.push("Finishing Blow");

        fullData["279211267443523585"].players = players;

        fs.writeFile("./data.json", JSON.stringify(fullData), 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
}