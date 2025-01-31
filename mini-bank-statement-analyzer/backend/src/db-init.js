const db = require("./db");

db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    description TEXT,
    amount REAL,
    category TEXT
)`, (err) => {
    if (err) {
        console.error("Error creating table: " + err.message);
    } else {
        console.log("Transactions table created successfully.");
    }
    db.close();
});
