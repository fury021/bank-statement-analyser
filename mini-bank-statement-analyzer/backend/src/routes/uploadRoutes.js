const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const fs = require("fs");
const csv = require("csv-parser");
const db = require("../db");
const { categorizeTransaction } = require("../utils/categorizeML");
const path = require("path");

// Function to store transactions in the database
const storeTransactions = (transactions, res) => {
    db.run("DELETE FROM transactions", (err) => {
        if (err) {
            return res.status(500).json({ message: "Error clearing transactions table" });
        }
        transactions.forEach((transaction) => {
            db.run(
                `INSERT INTO transactions (date, amount, description, category) VALUES (?, ?, ?, ?)`,
                [transaction.date, transaction.amount, transaction.description, transaction.category],
                (err) => {
                    if (err) {
                        console.error("Database insert error:", err);
                    }
                }
            );
        });
        res.json({ message: "File uploaded and transactions categorized successfully!" });
    });
};

// POST /api/upload - Upload file and process it
router.post("/", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.join(__dirname, "../uploads", req.file.filename);
    const transactions = [];

    // CSV Parsing
    if (filePath.endsWith(".csv")) {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                let amount = 0;
                if (row.Amount) {
                    amount = parseFloat(row.Amount) || 0;
                }

                // Adjust amount based on withdrawal/deposit
                if (row.withdrawal && parseFloat(row.withdrawal)) {
                    amount = -Math.abs(parseFloat(row.withdrawal)); // Withdrawal is negative
                } else if (row.deposit && parseFloat(row.deposit)) {
                    amount = Math.abs(parseFloat(row.deposit)); // Deposit is positive
                }

                // Categorize transaction based on description
                const description = row.Description || row.description || row.transaction_remarks || "";
                const category = categorizeTransaction(description);

                const transaction = {
                    date: row.Date || row.date || "", // Match any possible column name variations
                    description: description,
                    amount: amount,
                    category: category
                };

                transactions.push(transaction);
            })
            .on("end", () => {
                storeTransactions(transactions, res);
            });
    }

    // JSON Parsing
    else if (filePath.endsWith(".json")) {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                return res.status(500).json({ message: "Error reading JSON file" });
            }
            const parsedData = JSON.parse(data);
            parsedData.forEach((transaction) => {
                let amount = 0;
                if (transaction.Amount) {
                    amount = parseFloat(transaction.Amount) || 0;
                }

                // Adjust amount based on withdrawal/deposit
                if (transaction.withdrawal && parseFloat(transaction.withdrawal)) {
                    amount = -Math.abs(parseFloat(transaction.withdrawal)); // Withdrawal is negative
                } else if (transaction.deposit && parseFloat(transaction.deposit)) {
                    amount = Math.abs(parseFloat(transaction.deposit)); // Deposit is positive
                }

                // Categorize transaction based on description
                const description = transaction.Description || transaction.description || transaction.transaction_remarks || "";
                const category = categorizeTransaction(description);

                const normalizedTransaction = {
                    date: transaction.Date || transaction.date || "",
                    description: description,
                    amount: amount,
                    category: category
                };
                transactions.push(normalizedTransaction);
            });
            storeTransactions(transactions, res);
        });
    }
});

module.exports = router;
