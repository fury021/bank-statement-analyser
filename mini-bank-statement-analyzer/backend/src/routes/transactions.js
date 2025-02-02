const express = require("express");
const db = require("../db");
const router = express.Router();

// // Get all transactions
// router.get("/", (req, res) => {
//     db.all("SELECT * FROM transactions", [], (err, rows) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }
//         res.json(rows);
//     });
// });

// // Add a transaction (for testing)
// router.post("/", (req, res) => {
//     const { date, description, amount, category } = req.body;
//     db.run("INSERT INTO transactions (date, description, amount, category) VALUES (?, ?, ?, ?)", 
//         [date, description, amount, category], 
//         function(err) {
//             if (err) {
//                 return res.status(500).json({ error: err.message });
//             }
//             res.json({ id: this.lastID });
//         }
//     );
// });

router.get("/", (req, res) => {
    db.all("SELECT data FROM transactions", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Parse JSON before sending to client
        const transactions = rows.map(row => JSON.parse(row.data));
        res.json(transactions);
    });
});


module.exports = router;
