import React, { useState } from "react";
import { fetchTransactions, fetchSummary } from "./api/index";
import FileUpload from './components/FileUpload'; 

function App() {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false); // New state to track if data exists

    const loadData = async () => {
        try {
            const transactionsData = await fetchTransactions();
            const summaryData = await fetchSummary();
            
            setTransactions(transactionsData.data);
            setSummary(summaryData.data);
            setDataLoaded(true); // Show transactions only after fetching
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Function to categorize transactions based on their category
    const categorizeTransactions = () => {
        return transactions.reduce((categories, transaction) => {
            if (!categories[transaction.category]) {
                categories[transaction.category] = [];
            }
            categories[transaction.category].push(transaction);
            return categories;
        }, {});
    };

    // Function to calculate the summary (total credits, total debits, net)
    const calculateSummary = () => {
        let totalCredits = 0;
        let totalDebits = 0;

        transactions.forEach((transaction) => {
            if (transaction.amount > 0) {
                totalCredits += transaction.amount;
            } else {
                totalDebits += Math.abs(transaction.amount);
            }
        });

        return {
            totalCredits,
            totalDebits,
            net: totalCredits - totalDebits,
        };
    };

    const categorizedTransactions = categorizeTransactions();
    const { totalCredits, totalDebits, net } = calculateSummary();

    return (
        <div>
            <h1>Mini Bank Statement Analyzer</h1>
            <FileUpload onUploadSuccess={loadData} /> {/* Trigger loadData after upload */}
            
            {dataLoaded && ( // Only show data after an upload
                <>
                    <h2>Transactions</h2>
                    {Object.keys(categorizedTransactions).map((category) => (
                        <div key={category}>
                            <h3>{category}</h3>
                            <ul>
                                {categorizedTransactions[category].map((t) => (
                                    <li key={t.id}>
                                        {t.description}: ${t.amount}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <h2>Summary</h2>
                    <ul>
                        <li>Total Credits: ${totalCredits}</li>
                        <li>Total Debits: ${totalDebits}</li>
                        <li>Net: ${net}</li>
                    </ul>
                </>
            )}
        </div>
    );
}

export default App;
