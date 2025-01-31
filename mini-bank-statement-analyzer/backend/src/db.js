const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./bank.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("Database connection failed: " + err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

module.exports = db;
