const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const csv = require('csv-parser');  // To parse CSV files
const fs = require('fs');  // To read files from the filesystem
const path = require('path');
const transactionsRoutes = require("./routes/transactions");
const summaryRoutes = require("./routes/summary");
const db = require("./db");  // Database connection

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionsRoutes);
app.use("/api/summary", summaryRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// File upload handling (using multer)
const multer = require("multer");

// Set up multer to handle file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads');  // Set the upload directory to src/uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  // Make the file name unique
    }
});

const upload = multer({ storage: storage });  // Initialize multer with the above settings

// Handle file upload and parsing CSV or JSON
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    console.log('File uploaded to:', filePath);

    const transactions = [];

    // Check if the file is a CSV or JSON
    if (filePath.endsWith('.csv')) {
        // Parse CSV file
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                console.log('Parsed row:', row); 
                transactions.push(row);
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                // Process transactions and store in DB
                categorizeAndStoreTransactions(transactions);
                res.send('File uploaded and parsed successfully.');
                console.log('File uploaded and parsed successfully.');
            });
    } else if (filePath.endsWith('.json')) {
        // Parse JSON file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error reading JSON file.');
            }
            const transactions = JSON.parse(data);
            console.log('JSON file successfully processed');
            // Process transactions and store in DB
            categorizeAndStoreTransactions(transactions);
            res.send('File uploaded and parsed successfully.');
        });
    } else {
        return res.status(400).send('Unsupported file type. Only CSV and JSON are allowed.');
    }
});

/// Function to categorize and store transactions into the database
const categorizeAndStoreTransactions = (transactions) => {
    transactions.forEach((transaction) => {
        // Convert Amount to number
        const amount = parseFloat(transaction.Amount);
        let category = 'Miscellaneous';

        // Check if 'Description' field exists and categorize accordingly
        if (transaction.Description && transaction.Description.toLowerCase().includes('salary')) {
            category = 'Income';
        } else if (transaction.Description && transaction.Description.toLowerCase().includes('loan')) {
            category = 'EMI';
        } else if (amount < 0) {
            category = 'Expense';
        }

        // Insert into the database
        db.run(
            `INSERT INTO transactions (date, amount, description, category) VALUES (?, ?, ?, ?)`,
            [transaction.Date, amount, transaction.Description, category],
            (err) => {
                if (err) {
                    console.error('Error inserting transaction into database', err);
                } else {
                    console.log('Transaction inserted successfully:', transaction.Date, amount, transaction.Description, category);
                }
            }
        );
    });
};
