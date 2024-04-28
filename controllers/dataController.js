const fastJson = require('fast-json-parse');
const fs = require('fs');
const path = require('path');

function dataController() {
    const filePath = path.join(__dirname, '../assets/faux-protected-data.json');
    return fastJson(fs.readFileSync(filePath));
}

module.exports = dataController;