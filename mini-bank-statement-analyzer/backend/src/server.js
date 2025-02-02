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

// /// Function to categorize and store transactions into the database
// // Function to categorize and store transactions into the database
// const categorizeAndStoreTransactions = (transactions) => {
//     // Clear the transactions table before inserting new data
//     db.run('DELETE FROM transactions', (err) => {
//         if (err) {
//             console.error('Error clearing transactions table:', err);
//             return;
//         }
//         console.log('Transactions table cleared.');

//         // Proceed with inserting new transactions
//         transactions.forEach((transaction) => {
//             // Convert Amount to number
//             const amount = parseFloat(transaction.Amount);
//             let category = 'Miscellaneous';

//             // Check if 'Description' field exists and categorize accordingly
//             if (transaction.Description && transaction.Description.toLowerCase().includes('salary')) {
//                 category = 'Income';
//             } else if (transaction.Description && transaction.Description.toLowerCase().includes('loan')) {
//                 category = 'EMI';
//             } else if (amount < 0) {
//                 category = 'Expense';
//             }

//             // Insert into the database
//             db.run(
//                 `INSERT INTO transactions (date, amount, description, category) VALUES (?, ?, ?, ?)`,
//                 [transaction.Date, amount, transaction.Description, category],
//                 (err) => {
//                     if (err) {
//                         console.error('Error inserting transaction into database', err);
//                     } else {
//                         console.log('Transaction inserted successfully:', transaction.Date, amount, transaction.Description, category);
//                     }
//                 }
//             );
//         });
//     });
// };


//ML model classification
const categorizeAndStoreTransactions = async (transactions) => {
    db.run('DELETE FROM transactions', (err) => {
        if (err) {
            console.error('Error clearing transactions table:', err);
            return;
        }
        console.log('Transactions table cleared.');
    });

    for (let transaction of transactions) {
        try {
            let category = "Miscellaneous";  // Default category

            // Rule-based categorization first
            const description = transaction.Description.toLowerCase();

            if (description.includes("salary") || description.includes("credit")) {
                category = "Income";
            } else if (description.includes("emi") || description.includes("loan") || description.includes("payment")) {
                category = "EMI";
            } else if (description.includes("grocery") || description.includes("store")) {
                category = "Groceries";
            } else if (description.includes("dining") || description.includes("restaurant") || description.includes("pizza")) {
                category = "Entertainment";
            } else if (description.includes("electricity") || description.includes("bill") || description.includes("fee")) {
                category = "Bills";
            } else {
                // Call NLP model only if no rule-based match
                const response = await axios.post("http://127.0.0.1:5001/classify", {
                    description: transaction.Description
                });

                category = response.data.category || "Miscellaneous";
            }

            // Convert Amount to number
            const amount = parseFloat(transaction.Amount);

            // Insert transaction into database
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
        } catch (error) {
            console.error("Error calling NLP API:", error);
        }
    }
};
