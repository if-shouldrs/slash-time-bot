// LevelDB imports
const level = require("level");
// DB for storing timezones per user
const db = level("timezone-db");

// All this module does is provide 1 access point to the db for the whole project
module.exports = {
    db,
};
