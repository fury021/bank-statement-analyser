// const db = require("./db");

// db.run(`CREATE TABLE IF NOT EXISTS transactions (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     date TEXT,
//     description TEXT,
//     amount REAL,
//     category TEXT
// )`, (err) => {
//     if (err) {
//         console.error("Error creating table: " + err.message);
//     } else {
//         console.log("Transactions table created successfully.");
//     }
//     db.close();
// });
const db = require("./db");

db.run(`DROP TABLE IF EXISTS transactions`, (err) => {
    if (err) {
        console.error("Error dropping table: " + err.message);
    } else {
        console.log("Old transactions table dropped.");
    }

    db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data JSON
    )`, (err) => {
        if (err) {
            console.error("Error creating table: " + err.message);
        } else {
            console.log("New transactions table created successfully.");
        }
        db.close();
    });
});
