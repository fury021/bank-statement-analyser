const express = require("express");
const db = require("../db");
const router = express.Router();

// Get summary of income & expenses
router.get("/", (req, res) => {
    db.all("SELECT category, SUM(amount) AS total FROM transactions GROUP BY category", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

module.exports = router;
