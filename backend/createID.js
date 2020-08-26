const { v4: uuidv4} = require('uuid');

//Creates uuid and removes dashes - from it
function createID() {
    return uuidv4().replace(/-/g, "");
}

module.exports = createID;